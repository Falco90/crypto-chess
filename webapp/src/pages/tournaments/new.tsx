import styles from "../../styles/Home.module.css";
import Header from "../../components/Header";
import { useState } from "react";
import DeployContract from "../../hooks/use-deploy-contract";
import { Box, TextField, Button, List, Collapse, ListItemButton, ListItemIcon, ListItemText, ListSubheader, ListItem } from "@mui/material";

const New = () => {
    const [tournamentData, setTournamentData] = useState({
        name: "",
        url: "",
        organizer: "",
        status: "",
    });
    const [fee, setFee] = useState("0");
    const [fetchedTournament, setFetchedTournament] = useState(false);

    async function fetchTournament(event: any) {
        event.preventDefault();

        await fetch(tournamentData.url, {
            method: 'GET',
            mode: 'cors',
        }).then(async (response) => {
            const data = await response.json();
            setTournamentData({
                ...tournamentData,
                name: data.name,
                organizer: data.organizer,
                status: data.status
            })

            setFetchedTournament(true);
        });

    }

    return (
        <div className={styles.container} >
            <Header />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', minWidth: '600px' }}>

                <h1>
                    Deploy New Tournament
                </h1>
                <Box sx={{ marginBottom: '20px' }}>
                    <TextField id="outlined-basic" label="Chess.com URL" variant="outlined" value={tournamentData.url} onChange={(e) => {
                        setTournamentData({ ...tournamentData, url: e.target.value })
                    }} />
                    <Button onClick={(e) => fetchTournament(e)} type="submit">Link</Button>
                </Box>
                {fetchedTournament ?
                    <Box sx={{ minWidth: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box>
                            <Box>
                                <TextField id="outlined-basic" label="Fee (ether)" variant="outlined" type="number" value={fee} onChange={(e) => {
                                    setFee(e.target.value)
                                }} />
                            </Box>
                        </Box>
                        <List>
                            <ListSubheader component="div" id="nested-list-subheader">
                                Tournament Details
                            </ListSubheader>
                            <ListItem>
                                <ListItemText primary={`URL: ${tournamentData.url}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={`Status: ${tournamentData.status}`} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Current Amount of Players:" />
                            </ListItem>
                        </List>
                        <DeployContract url={tournamentData.url} fee={fee} />
                    </Box> : ""}
            </Box>

            <footer className={styles.footer}>
                <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
                    Made by Falco90 during Flare x Encode April 2025
                </a>
            </footer>
        </div >
    )
}

export default New;