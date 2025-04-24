import { useReadContract } from "wagmi";
import implAbi from '../contracts/ChessTournamentImplAbi.json'
import { Address } from "viem";
import { List, ListItem, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

function Winner({ contractAddress}: { contractAddress: string}) {
    const { data, isLoading, isError, error } = useReadContract({
        abi: implAbi,
        address: contractAddress as Address,
        functionName: 'getWinner',
    }) as {
        data: string
        isLoading: boolean
        isError: boolean
        error: Error | null
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error?.message}</div>

    return (
        <ListItem>
            <ListItemText>{data}</ListItemText>
        </ListItem>
    )
}

export default Winner;