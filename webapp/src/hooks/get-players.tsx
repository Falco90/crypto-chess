import { useReadContract } from "wagmi";
import implAbi from '../contracts/ChessTournamentImplAbi.json'
import { Address } from "viem";
import { List, ListItem, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";

function PlayerList({ contractAddress, apiPlayers, allPaid, setAllPaid }: { contractAddress: string, apiPlayers: string[], allPaid: boolean, setAllPaid: Dispatch<SetStateAction<boolean>> }) {
    const { data: playersPaid, isLoading, isError, error } = useReadContract({
        abi: implAbi,
        address: contractAddress as Address,
        functionName: 'getPlayers',
    }) as {
        data: string[]
        isLoading: boolean
        isError: boolean
        error: Error | null
    }

    useEffect(() => {
        if (!playersPaid || !playersPaid.length || !apiPlayers.length) {
            setAllPaid(false);
            return;
        }

        const allPresent = apiPlayers.every(player =>
            playersPaid.includes(player)
        );
        setAllPaid(prev => (prev !== allPresent ? allPresent : prev));
    }, [playersPaid, apiPlayers]);

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
                        <TableCell>{playersPaid.includes(player) ? "✅" : ""}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default PlayerList;