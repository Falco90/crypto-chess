
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../components/Header';
import { Button, Typography, Container, Box } from '@mui/material';
import GetTournaments from "../hooks/get-tournaments";
import TransitionModal from '../components/Modal';
import { useState } from 'react';
import { Mode } from "../components/Modal";

const Home: NextPage = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(Mode.None);
  const [tournamentContractData, setTournamentContractData] = useState({
    address: "",
    url: "",
    fee: BigInt("")
  })

  return (
    <Container sx={{ minHeight: '100vh', width: '100%' }}>
      <Head>
        <title>Crypto Chess</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Header />
      <TransitionModal open={open} onClose={() => setOpen(false)} mode={mode} setMode={setMode} tournamentContractData={tournamentContractData} />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '40px', padding: '2rem', height: '600px' }}>
        <Box sx={{ backgroundColor: 'white', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '10px' }}>
          <Typography variant="h5" component="h5" sx={{ textAlign: 'center', paddingBottom: '20px' }}>
            <strong>Welcome to CryptoChess!</strong>
          </Typography>
          <Typography variant="body1" component="p" fontSize="16px">
            CryptoChess allows you to attach crypto prizes to chess tournaments on chess.com. Here&apos;s how it works: <br /><br /><strong>♟ Step 1:</strong> Create a chess tournament on chess.com and invite your players. <br /><br /><strong>⛓ Step 2:</strong> Link your tournament to a smart contract by clicking the button below. <br /><br /><strong>💵 Step 3</strong>: Have your players join the smart contract by paying the joining fee. <br /><br /><strong>🏆 Step 4:</strong> Play the tournament on chess.com. <br /><br /><strong>💰	Step 5:</strong> Click the &apos;Send Prize&apos; button on your CryptoChess tournament page, and the prize money will be transferred to the winner!
          </Typography>
          <Button variant="outlined" sx={{ marginTop: 'auto' }} onClick={() => {
            setOpen(true);
            setMode(Mode.Create);
          }}>New Tournament Contract</Button>
        </Box>
        <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '10px' }}>
          <Typography variant='h5' component='h5' sx={{ textAlign: 'center', paddingBottom: '20px', }}><strong>Tournaments</strong></Typography>
          <GetTournaments onOpen={() => setOpen(true)} setMode={setMode} setTournamentContractData={setTournamentContractData} />
        </Box>
      </Box>
      <footer className={styles.footer}>
        Made by Falco90 during Flare x Encode April 2025
      </footer>
    </Container>
  );
};

export default Home;
