import { useReadContract } from "wagmi";
import factoryJson from '../contracts/ChessTournamentFactory.json'
import { Address } from "viem";
import StickyHeadTable from "../components/Table";
import { Mode } from "../components/Modal";

type Tournament = {
    contractAddress: Address,
    url: string,
    fee: bigint
}

type pageProps = {
    onOpen: () => void,
    setMode: (arg0: Mode) => void,
    setContractAddress: (arg0: string) => void
    setUrl: (arg0: string) => void
}
function GetTournaments({ onOpen, setMode, setContractAddress, setUrl }: pageProps) {
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
        <StickyHeadTable rows={data} onOpen={onOpen} setMode={setMode} setContractAddress={setContractAddress} setUrl={setUrl} />

    )
}

export default GetTournaments;