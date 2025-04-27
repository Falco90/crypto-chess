import { ethers } from "ethers";
import HelpersArtifact from "../artifacts/Helpers.json";
import FdcHubArtifact from "../artifacts/IFdcHub.json";
import FdcRequestFeeConfigurationsArtifact from "../artifacts/IFdcRequestFeeConfigurations.json";
import FlareSystemsManagerArtifact from "../artifacts/IFlareSystemsManager.json";
import IRelayArtifact from "../artifacts/IRelay.json";
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.PRIVATE_KEY!);
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const helpersAddress = process.env.HELPERS_CONTRACT_ADDRESS!;


function getHelpers() {
  return new ethers.Contract(helpersAddress, HelpersArtifact.abi, signer);
}

function toHex(data: string): string {
  return [...data].map((c) => c.charCodeAt(0).toString(16)).join("").padEnd(64, "0");
}

function toUtf8HexString(data: string): string {
  return "0x" + toHex(data);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFdcHub() {
  const helpers = getHelpers();
  const address = await helpers.getFdcHub();
  return new ethers.Contract(address, FdcHubArtifact.abi, signer);
}

async function getFlareSystemsManager() {
  const helpers = getHelpers();
  const address = await helpers.getFlareSystemsManager();
  return new ethers.Contract(address, FlareSystemsManagerArtifact.abi, provider);
}

async function getFdcRequestFee(abiEncodedRequest: string) {
  const helpers = getHelpers();
  const address = await helpers.getFdcRequestFeeConfigurations();
  const contract = new ethers.Contract(
    address,
    FdcRequestFeeConfigurationsArtifact.abi,
    provider
  );
  return await contract.getRequestFee(abiEncodedRequest);
}

async function getRelay() {
  const helpers = getHelpers();
  const address = await helpers.getRelay();
  return new ethers.Contract(address, IRelayArtifact.abi, provider);
}

async function prepareAttestationRequestBase(
  url: string,
  apiKey: string,
  attestationTypeBase: string,
  sourceIdBase: string,
  requestBody: any
) {
  const attestationType = toUtf8HexString(attestationTypeBase);
  const sourceId = toUtf8HexString(sourceIdBase);

  const request = {
    attestationType,
    sourceId,
    requestBody,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (response.status !== 200) {
    throw new Error(`Response status is not OK, status ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

async function calculateRoundId(transaction: ethers.ContractTransactionResponse) {
  const receipt = await provider.waitForTransaction(transaction.hash);

  if (!receipt?.blockNumber) {
    throw new Error("Transaction was mined but no block number was found in the receipt.");
  }

  const block = await provider.getBlock(receipt.blockNumber);
  if (!block?.timestamp) {
    throw new Error("Could not retrieve block timestamp.");
  }

  const timestamp = BigInt(block.timestamp);

  const manager = await getFlareSystemsManager();
  const start = BigInt(await manager.firstVotingRoundStartTs());
  const duration = BigInt(await manager.votingEpochDurationSeconds());

  return Number((timestamp - start) / duration);
}

async function submitAttestationRequest(abiEncodedRequest: string) {
  const fdcHub = await getFdcHub();
  const fee = await getFdcRequestFee(abiEncodedRequest);
  const tx = await fdcHub.requestAttestation(abiEncodedRequest, { value: fee });
  const roundId = await calculateRoundId(tx);
  return roundId;
}

async function postRequestToDALayer(
  url: string,
  request: any,
  watchStatus: boolean = false
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (watchStatus && response.status !== 200) {
    throw new Error(`Response status is not OK, status ${response.status} ${response.statusText}`);
  }
  return await response.json();
}

async function retrieveDataAndProofBase(
  url: string,
  abiEncodedRequest: string,
  roundId: number
) {
  const relay = await getRelay();
  while (!(await relay.isFinalized(200, roundId))) {
    await sleep(30000);
  }

  const request = {
    votingRoundId: roundId,
    requestBytes: abiEncodedRequest,
  };

  await sleep(10000);
  let proof = await postRequestToDALayer(url, request, true);
  while (proof.response_hex === undefined) {
    await sleep(10000);
    proof = await postRequestToDALayer(url, request, false);
  }

  return proof;
}

export {
  toUtf8HexString,
  sleep,
  prepareAttestationRequestBase,
  submitAttestationRequest,
  retrieveDataAndProofBase,
  getFdcHub,
  getFdcRequestFee,
  getRelay,
  calculateRoundId,
  postRequestToDALayer,
};
