import { useDeployContract } from 'wagmi'
import { parseEther, encodeFunctionData } from 'viem'
import proxyJson from "../contracts/proxy.json"
import implJson from "../contracts/implementation.json"

const implAddress = "0x4d889cbf8eb7A972C754C85171A5f8CB55F70aE3";
const implAbi = implJson.abi;
const proxyBytecode = proxyJson.bytecode as `0x${string}`;

const initData = encodeFunctionData({
  abi: implAbi,
  functionName: "initialize",
  args: ["https://api.chess.com/pub/tournament/-33rd-chesscom-quick-knockouts-1401-1600", 8, parseEther("2")]
})

function DeployContract() {
  const { deployContract } = useDeployContract()

  return (
    <button
      onClick={() =>
        deployContract({
          abi: proxyJson.abi,
          bytecode: proxyBytecode,
          args: [implAddress, initData]
        })
      }
    >
      Deploy New Contract
    </button>
  )
}

export default DeployContract;