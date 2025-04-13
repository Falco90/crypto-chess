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
import { Button } from '@mui/material';

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
        format: (value: number) => value.toLocaleString('en-US'),
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '500px', overflow: 'hidden' }}>
            <TableContainer sx={{ height: '400px' }}>
                <Table stickyHeader aria-label="sticky table" sx={{
                    borderCollapse: 'collapse',
                    boxShadow: 'none',
                    background: 'none',
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
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                            >
                                                Join
                                            </Button>
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
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
