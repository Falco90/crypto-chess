import { useReadContract } from "wagmi";
import implAbi from '../contracts/ChessTournamentImplAbi.json'
import { Address } from "viem";
import { List, ListItem, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

function PlayerList({ contractAddress, apiPlayers }: { contractAddress: string, apiPlayers: string[] }) {
    const { data, isLoading, isError, error } = useReadContract({
        abi: implAbi,
        address: contractAddress as Address,
        functionName: 'getPlayers',
    }) as {
        data: string[]
        isLoading: boolean
        isError: boolean
        error: Error | null
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {error?.message}</div>

    return (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Players</TableCell>
              <TableCell>Paid Fee?</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apiPlayers.map((player, index) => (
              <TableRow key={index}>
                <TableCell>👤 {player}</TableCell>
                <TableCell>{data.includes(player) ? "✅" : ""}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    )
}

export default PlayerList;