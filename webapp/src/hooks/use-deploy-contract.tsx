import { useDeployContract } from 'wagmi'
import { parseEther, encodeFunctionData } from 'viem'
import proxyJson from "../contracts/proxy.json"
import implJson from "../contracts/implementation.json"

const implAddress = "0x3D22bC6Ed706Dc41C25A7D1c0Ec06b3A2d9A90F2";
const implAbi = implJson.abi;
const proxyBytecode = proxyJson.bytecode as `0x${string}`;

const initData = encodeFunctionData({
  abi: implAbi,
  functionName: "initialize",
  args: ["https://api.chess.com/pub/tournament/-33rd-chesscom-quick-knockouts-1401-1600", 4, parseEther("1")]
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