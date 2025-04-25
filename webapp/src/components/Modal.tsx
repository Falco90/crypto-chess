import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText, ListSubheader, TextField } from '@mui/material';
import CreateTournament from '../hooks/create-tournament';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toChessApiUrl, extractTournamentSlug, formatApiData, formatTournamentName } from '../utils/utils';
import JoinTournamentButton from '../hooks/join-tournament';
import FinishTournamentButton from '../hooks/finish-tournament';
import PlayerList from '../hooks/get-players';
import { Address, formatEther } from 'viem';
import Winner from '../hooks/get-winner';

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

export enum Mode {
    Create,
    View,
    None
}

export type Player = {
    username: string,
    status: string
}
type pageProps = {
    open: boolean,
    onClose: () => void,
    mode: Mode,
    setMode: (arg0: Mode) => void,
    tournamentContractData: {
        address: string,
        url: string,
        fee: bigint
    }
}
export default function TransitionsModal({ open, onClose, mode, setMode, tournamentContractData }: pageProps) {
    const [tournamentApiData, setTournamentApiData] = useState({
        name: "",
        url: "",
        organizer: "",
        status: "",
        type: "",
        players: []
    });
    const [fee, setFee] = useState("0");
    const [fetchedTournament, setFetchedTournament] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [allPaid, setAllPaid]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);
    const [prizeSent, setPrizeSent]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(false);

    useEffect(() => {
        if (mode == Mode.View) {
            fetchTournament(tournamentContractData.url)
        }
    }, [mode]);

    useEffect(() => {
        if (!open) {
            setTournamentApiData(
                {
                    name: "",
                    url: "",
                    organizer: "",
                    status: "",
                    type: "",
                    players: []
                }
            )
            setFetchedTournament(false);
            setFee("0");
            setMode(Mode.None);
        }
    }, [open]);

    async function fetchTournament(url: string) {
        if (mode == Mode.Create) {
            url = toChessApiUrl(url)!;
        }

        await fetch(url, {
            method: 'GET',
            mode: 'cors',
        }).then(async (response) => {
            const data = await response.json();
            setTournamentApiData({
                ...tournamentApiData,
                url: data.url,
                name: data.name,
                organizer: data.creator,
                status: data.status,
                type: data.settings.type,
                players: data.players,
            })

            setFetchedTournament(true);
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
                            {mode == Mode.Create ?
                                <Box>
                                    <Typography variant='h5' component='h5' textAlign={'center'}>
                                        Create Tournament Contract
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '100px' }}>
                                        <TextField id="outlined-basic" label="Chess.com URL" variant="outlined" size="small" sx={{ width: '400px', alignSelf: 'center' }} value={tournamentApiData.url} onChange={(e) => {
                                            setTournamentApiData({ ...tournamentApiData, url: e.target.value })
                                        }} />
                                        <Button variant="outlined" onClick={(e) => {
                                            e.preventDefault();
                                            fetchTournament(tournamentApiData.url)
                                        }} type="submit">Link</Button>
                                    </Box>
                                    {fetchedTournament ?
                                        <Box sx={{ minWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '400px' }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                                                <List sx={{ textAlign: 'center' }}>
                                                    <ListSubheader>
                                                        Tournament Details
                                                    </ListSubheader>
                                                    <ListItem>
                                                        <Typography><strong>Name: </strong>{formatTournamentName(extractTournamentSlug(tournamentApiData.url)!)}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Typography><strong>Organizer: </strong>{tournamentApiData.organizer}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Typography><strong>Status: </strong>{formatApiData(tournamentApiData.status)}</Typography>
                                                    </ListItem>
                                                    <ListItem>
                                                        <Typography><strong>Type: </strong>{formatApiData(tournamentApiData.type)}</Typography>
                                                    </ListItem>
                                                </List>
                                                <List>
                                                    <ListSubheader>Players ({tournamentApiData.players.length})</ListSubheader>
                                                    {tournamentApiData.players.map((player: Player) => {
                                                        return (
                                                            <ListItem>
                                                                <ListItemText>👤 {player.username}</ListItemText>
                                                            </ListItem>)
                                                    })}
                                                </List>
                                            </Box>
                                            <CreateTournament url={tournamentApiData.url} fee={fee} setFee={setFee} />
                                        </Box> : ""}
                                </Box>
                                :
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '500px' }}>
                                    <Typography variant="h5" component="h5">{tournamentApiData.name}</Typography>
                                    <List dense sx={{ padding: '2rem' }}>
                                        <ListItem>
                                            <ListItemText><strong>Url: </strong>{tournamentApiData.url}</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText><strong>Address: </strong>{tournamentContractData.address}</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText><strong>Organizer: </strong>{tournamentApiData.organizer}</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText><strong>Fee: </strong>{formatEther(tournamentContractData.fee)} FLR</ListItemText>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText><strong>Status: </strong> {formatApiData(tournamentApiData.status)}</ListItemText>
                                        </ListItem>
                                        <PlayerList contractAddress={tournamentContractData.address} apiPlayers={tournamentApiData.players} status={tournamentApiData.status} setAllPaid={setAllPaid} />
                                    </List>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {tournamentApiData.status == "finished" && allPaid ?
                                            <Winner contractAddress={tournamentContractData.address} prizeSent={prizeSent} setPrizeSent={setPrizeSent} />
                                            : ""}
                                        {
                                            !allPaid ?
                                                <JoinTournamentButton playerName={playerName} setPlayerName={setPlayerName} tournamentContractData={tournamentContractData} />
                                                :
                                                !prizeSent ?
                                                    <FinishTournamentButton status={tournamentApiData.status} tournamentContractData={tournamentContractData} />
                                                    : ""}
                                    </Box>
                                </Box>
                            }
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div >
    );
}