import { useReadContract } from "wagmi";
import factoryJson from '../contracts/ChessTournamentFactory.json'
import { Address } from "viem";
import { Button, List, ListItem } from "@mui/material";
import { truncateAddress, extractTournamentSlug } from "../utils/utils";
import StickyHeadTable from "../components/Table";

type Tournament = {
    contractAddress: Address,
    url: string,
    fee: bigint
}

type pageProps = {
    onOpen: () => void,
    setMode: () => void
}
function GetTournaments({onOpen, setMode}: pageProps) {
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
        <StickyHeadTable rows={data} onOpen={onOpen} setMode={setMode}/>

    )
}

export default GetTournaments;