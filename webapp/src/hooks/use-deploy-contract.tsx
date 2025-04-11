import { useDeployContract } from 'wagmi'
import { parseEther, encodeFunctionData } from 'viem'
import proxyJson from "../contracts/proxy.json"
import implJson from "../contracts/implementation.json"

const implAddress = "0x4d889cbf8eb7A972C754C85171A5f8CB55F70aE3";
const implAbi = implJson.abi;
const proxyBytecode = proxyJson.bytecode as `0x${string}`;

type pageProps = {
  url: string,
  maxPlayers: number,
  fee: string
}
function DeployContract({url, maxPlayers, fee}: pageProps) {
  const { deployContract } = useDeployContract()

  const initData = encodeFunctionData({
    abi: implAbi,
    functionName: "initialize",
    args: [url, maxPlayers, parseEther(fee)]
  })

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