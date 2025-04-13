import { useReadContract } from "wagmi";
import factoryJson from '../contracts/ChessTournamentFactory.json'
import { Address } from "viem";
import { Button, List, ListItem } from "@mui/material";
import { truncateAddress, extractTournamentSlug } from "../utils/utils";

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
        data: Tournament[] | undefined
        isLoading: boolean
        isError: boolean
        error: Error | null
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error?.message}</div>

    return (
        <List sx={{ backgroundColor: 'lightgray', width: '500px' }}>
            <ListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><p>Address</p> <p>Tournament</p> <p>Fee (ether)</p> <p></p></ListItem>
            {data?.map((element) => (
                <ListItem sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}><p>{truncateAddress(element.contractAddress)}</p> <p><a href={element.url}>{extractTournamentSlug(element.url)}</a></p><p>{element.fee} ether</p><Button>Join</Button></ListItem>
            ))}
        </List>
        
    )
}

export default GetTournaments;