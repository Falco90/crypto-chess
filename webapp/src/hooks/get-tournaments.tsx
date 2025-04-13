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
function GetTournaments() {
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
        <StickyHeadTable rows={data} />

    )
}

export default GetTournaments;