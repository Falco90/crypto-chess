import { useWriteContract } from 'wagmi'
import { Address } from 'viem'
import factoryJson from "../contracts/ChessTournamentFactory.json"
import { Button } from '@mui/material'

const factoryAddress = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;

type pageProps = {
  url: string,
  fee: string
}
function CreateTournament({ url, fee }: pageProps) {
  const { writeContract } = useWriteContract()

  return (
    <Button
      onClick={() =>
        writeContract({
          abi: factoryJson.abi,
          address: factoryAddress as Address,
          functionName: 'createChessTournament',
          args: [url, fee]
        })
      }
    >
      Deploy Tournament Contract
    </Button>
  )
}

export default CreateTournament;