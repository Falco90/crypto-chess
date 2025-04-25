import { useReadContract, useReadContracts } from "wagmi";
import implAbi from '../contracts/ChessTournamentImplAbi.json'
import { Address } from "viem";
import { List, ListItem, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { truncateAddress } from "../utils/utils";

function Winner({ contractAddress, prizeSent, setPrizeSent }: { contractAddress: string, prizeSent: boolean, setPrizeSent: Dispatch<SetStateAction<boolean>> }) {
    const { data: prizeData } = useReadContract({
        abi: implAbi,
        address: contractAddress as Address,
        functionName: 'prizeSent',
    }) as {
        data: boolean
    }

    setPrizeSent(prizeData);



    const { data: winnerData, isLoading: isLoadingWinner, isError: isErrorWinner } = useReadContracts({
        contracts: [
            {
                abi: implAbi,
                address: contractAddress as `0x${string}`,
                functionName: 'winner',
            },
        ],
    });

    const winner = winnerData?.[0]?.result as string | undefined;

    const {
        data: winnerAddressData,
    } = useReadContracts({
        query: {
            enabled: !!winner,
        },
        contracts: winner
            ? [
                {
                    abi: implAbi,
                    address: contractAddress as `0x${string}`,
                    functionName: 'playerNameToPlayerAddress',
                    args: [winner],
                },
            ]
            : [],
    });

    const winnerAddress = winnerAddressData?.[0]?.result as string | undefined;

    return (
        <ListItem>
            {
                prizeSent ?
                    <ListItemText>💰 Prize Money Sent To {winner} ({truncateAddress(winnerAddress!)})</ListItemText >
                    : ""
            }
        </ListItem>
    )
}

export default Winner;