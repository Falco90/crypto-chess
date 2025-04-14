import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText, ListSubheader, TextField } from '@mui/material';
import CreateTournament from '../hooks/create-tournament';
import { useState } from 'react';
import { toChessApiUrl, extractTournamentSlug } from '../utils/utils';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
};

type pageProps = {
    open: boolean,
    onClose: () => void
}
export default function TransitionsModal({ open, onClose }: pageProps) {
    const [tournamentData, setTournamentData] = useState({
        name: "",
        url: "",
        organizer: "",
        status: "",
        type: "",
        players: []
    });
    const [fee, setFee] = useState("0");
    const [fetchedTournament, setFetchedTournament] = useState(false);

    async function fetchTournament(event: any) {
        event.preventDefault();
        const chessApiUrl = toChessApiUrl(tournamentData.url);

        await fetch(chessApiUrl!, {
            method: 'GET',
            mode: 'cors',
        }).then(async (response) => {
            const data = await response.json();
            setTournamentData({
                ...tournamentData,
                name: data.name,
                organizer: data.creator,
                status: data.status,
                type: data.settings.type,
                players: data.players.map((player: {username: string}) => player.username)
            })

            setFetchedTournament(true);
            console.log(data);
        });

    }

    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={onClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '600px' }}>

                            <Typography variant='h5' component='h5'>
                                Create Tournament Contract
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '100px' }}>
                                <TextField id="outlined-basic" label="Chess.com URL" variant="outlined" size="small" sx={{ width: '400px', alignSelf: 'center' }} value={tournamentData.url} onChange={(e) => {
                                    setTournamentData({ ...tournamentData, url: e.target.value })
                                }} />
                                <Button variant="outlined" onClick={(e) => fetchTournament(e)} type="submit">Link</Button>
                            </Box>
                            {fetchedTournament ?
                                <Box sx={{ minWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '400px' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                                        <List sx={{ textAlign: 'center' }}>
                                            <ListSubheader>
                                                Tournament Details
                                            </ListSubheader>
                                            <ListItem>
                                                <Typography><strong>Slug: </strong>{extractTournamentSlug(tournamentData.url)}</Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography><strong>Organizer: </strong>{tournamentData.organizer}</Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography><strong>Status: </strong>{tournamentData.status}</Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography><strong>Start Time: </strong>{tournamentData.status}</Typography>
                                            </ListItem>
                                            <ListItem>
                                                <Typography><strong>Type: </strong>{tournamentData.type}</Typography>
                                            </ListItem>
                                        </List>
                                        <List>
                                            <ListSubheader>Players ({tournamentData.players.length})</ListSubheader>
                                            {tournamentData.players.map((player) => {
                                                return (
                                                    <ListItem>
                                                        <ListItemText>👤 {player}</ListItemText>
                                                    </ListItem>
                                                )
                                            })}
                                        </List>
                                    </Box>
                                    <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                        <TextField id="outlined-basic" label="Fee (FLR)" size="small" variant="outlined" type="number" sx={{ width: '100px', marginTop: 'auto' }} value={fee} slotProps={{
                                            htmlInput: {
                                                min: 0,
                                            },
                                        }} onChange={(e) => {
                                            setFee(e.target.value)
                                        }} />
                                        <CreateTournament url={tournamentData.url} fee={fee} />
                                    </Box>
                                </Box> : ""}
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}