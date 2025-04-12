import { Address } from 'viem'
import implJson from "../contracts/ChessTournamentImpl.json"
import { Button } from '@mui/material'
import { useWriteContract } from 'wagmi'

const instanceAddress = process.env.NEXT_PUBLIC_INSTANCE_ADDRESS;
const implAbi = implJson.abi;

type pageProps = {
    playerName: string
}
function JoinTournament({ playerName }: pageProps) {
    const { writeContract } = useWriteContract();

    return (
        <Button
            onClick={() =>
                writeContract({
                    abi: implAbi,
                    address: instanceAddress as Address,
                    functionName: 'addPlayer',
                    args: [playerName
                    ],
                })
            }
        >
            Join
        </Button>
    )
}

export default JoinTournament;