import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Address, formatEther } from 'viem';
import { extractTournamentSlug, toChessApiUrl, truncateAddress, formatTournamentName } from '../utils/utils';
import { Button } from '@mui/material';
import { Mode } from './Modal';

interface Column {
    id: 'url' | 'contractAddress' | 'fee';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: ((value: any) => any)
}

const formatTournamentSlug = (value: string) =>
    formatTournamentName(extractTournamentSlug(value)!);

const columns: readonly Column[] = [
    { id: 'url', label: 'Name', format: formatTournamentSlug },
    { id: 'contractAddress', label: 'Address', format: truncateAddress },
    {
        id: 'fee',
        label: 'Fee',
        align: 'left',
        format: (value: bigint) => formatEther(value).concat(" FLR"),
    }
];

type Tournament = {
    contractAddress: Address;
    url: string;
    fee: bigint;
}

type pageProps = {
    rows: Tournament[],
    onOpen: () => void,
    setMode: (arg0: Mode) => void,
    setTournamentContractData: (arg0: {
        address: string,
        url: string,
        fee: bigint
    }) => void
}

export default function TournamentTable({ rows, onOpen, setMode, setTournamentContractData }: pageProps) {
    return (
        <TableContainer sx={{ height: '400px', width: '500px', backgroundColor: 'white' }}>
            <Table stickyHeader aria-label="sticky table" sx={{

            }}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows
                        .map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.contractAddress}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format ? column.format(value) : value
                                                }
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell align="right" sx={{ border: 'none' }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => {
                                                onOpen();
                                                setMode(Mode.View);
                                                setTournamentContractData({
                                                    address: row.contractAddress,
                                                    url: toChessApiUrl(row.url)!,
                                                    fee: row.fee
                                                })
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
