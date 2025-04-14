import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Address } from 'viem';
import { extractTournamentSlug, toChessApiUrl, truncateAddress } from '../utils/utils';
import { Box, Button } from '@mui/material';

interface Column {
    id: 'url' | 'contractAddress' | 'fee';
    label: string;
    minWidth?: number;
    align?: 'left';
    format?: ((value: any) => any)
}

const columns: readonly Column[] = [
    { id: 'url', label: 'Slug', format: extractTournamentSlug },
    { id: 'contractAddress', label: 'Address', format: truncateAddress },
    {
        id: 'fee',
        label: 'Fee',
        align: 'left',
        format: (value: number) => value.toLocaleString('en-US').concat(" FLR"),
    }
];

type Tournament = {
    contractAddress: Address;
    url: string;
    fee: bigint;
}

type pageProps = {
    rows: Tournament[]
}

export default function StickyHeadTable({ rows }: pageProps) {
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
