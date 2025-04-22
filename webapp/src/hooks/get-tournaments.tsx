import { useReadContract } from "wagmi";
import factoryJson from '../contracts/ChessTournamentFactory.json'
import { Address } from "viem";
import TournamentTable from "../components/Table";
import { Mode } from "../components/Modal";

type Tournament = {
    contractAddress: Address,
    url: string,
    fee: bigint
}

type pageProps = {
    onOpen: () => void,
    setMode: (arg0: Mode) => void,
    setTournamentContractData: (arg0: {
        address: string,
        url: string,
        fee: bigint
    }) => void
}
function GetTournaments({ onOpen, setMode, setTournamentContractData }: pageProps) {
    const { data, isLoading, isError, error } = useReadContract({
        abi: factoryJson.abi,
        address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS as Address,
        functionName: 'getAllChessTournaments',
    }) as {
        data: Tournament[]
        isLoading: boolean
        isError: boolean
        error: Error | null
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error?.message}</div>

    return (
        <TournamentTable rows={data} onOpen={onOpen} setMode={setMode} setTournamentContractData={setTournamentContractData} />

    )
}

export default GetTournaments;