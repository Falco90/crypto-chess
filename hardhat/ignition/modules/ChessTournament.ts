// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther, encodeFunctionData } from "viem";
import implJson from "../../artifacts/contracts/ChessTournamentImpl.sol/ChessTournamentImpl.json";

const ChessTournamentModule = buildModule("ChessTournamentModule", (m) => {
  const chessTournamentImpl = m.contract("ChessTournamentImpl", []);

  const initData = encodeFunctionData({
    abi: implJson.abi,
    functionName: "initialize",
    args: ["https://api.chess.com/pub/tournament/-33rd-chesscom-quick-knockouts-1401-1600", 4, parseEther("1")]
  })

  const chessTournamentProxy = m.contract("ChessTournamentProxy", [chessTournamentImpl, initData]);

  return { chessTournamentImpl };
});

export default ChessTournamentModule;
