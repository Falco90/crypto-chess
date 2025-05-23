import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from 'wagmi';
import implAbi from '../contracts/ChessTournamentImplAbi.json';
import JsonApiVerificationJson from '../contracts/utils/IJsonApiVerification.json';
import { decodeAbiParameters } from 'viem';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';

type AddPlayerParams = {
    contractAddress: `0x${string}`;
    playerName: string;
    proof: {
        response_hex: `0x${string}`;
        proof: string[];
    };
    fee: bigint;
};

export function useAddPlayer() {
    const {
        writeContract,
        data: hash,
        isPending,
        error,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
    } = useWaitForTransactionReceipt({ hash });

    const addPlayer = ({
        contractAddress,
        playerName,
        proof,
        fee
    }: AddPlayerParams) => {
        const responseType = JsonApiVerificationJson.abi[0].inputs[0].components[1];
        const decoded = decodeAbiParameters(
            [
                {
                    type: responseType.type,
                    name: responseType.name,
                    components: responseType.components,
                },
            ],
            proof.response_hex as `0x${string}`
        );

        const decodedResponse = decoded[0];

        writeContract({
            address: contractAddress,
            abi: implAbi,
            functionName: 'addPlayer',
            args: [
                {
                    merkleProof: proof.proof,
                    data: decodedResponse,
                },
                playerName,
            ],
            value: fee
        });
    };

    return {
        addPlayer,
        hash,
        isPending,
        isConfirming,
        isConfirmed,
        error,
    };
}

async function getDataAndProof(url: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/add-player`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: url,
        }),
    });

    const data = await response.json();
    return data;
}

function JoinTournamentButton({ playerName, setPlayerName, tournamentContractData }: { playerName: string, setPlayerName: (arg0: string) => void, tournamentContractData: { address: string, url: string, fee: bigint } }) {
    const [isGettingProof, setIsGettingProof] = useState(false);

    const {
        addPlayer,
        isPending,
        isConfirming,
        isConfirmed,
        error,
        hash
    } = useAddPlayer();

    return (
        <Box>
            {isGettingProof || isPending || isConfirming ?
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <CircularProgress size={30} color='secondary' />
                    <Typography>{isGettingProof ? "Verifying Player (this can take a while)..." : isPending ? "Pending Wallet Transaction..." : isConfirming ? "Confirming Transaction..." : ""}</Typography>
                </Box>
                :
                !isConfirmed ?
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        <TextField disabled={isPending || isConfirming || isGettingProof} id="outlined-basic" label="Your Chess.com Username" variant="outlined" size="small" sx={{ width: '250px', alignSelf: 'center' }} value={playerName} onChange={(e) => {
                            setPlayerName(e.target.value);
                        }} />
                        <Button variant="outlined" disabled={isPending || isConfirming || isGettingProof} onClick={() => {
                            setIsGettingProof(true);
                            getDataAndProof(tournamentContractData.url).then((proof) => {
                                setIsGettingProof(false);
                                addPlayer({ contractAddress: tournamentContractData.address as `0x${string}`, playerName: playerName.toLowerCase(), proof, fee: tournamentContractData.fee });
                            })
                        }}>Pay Fee</Button>
                    </Box>
                    :
                    <Box sx={{ padding: '1rem' }}>
                        {!error ?
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                <Typography sx={{ textAlign: 'center', marginBottom: '10px' }}>✅ Transaction Succesful!</Typography>
                                <Typography sx={{ color: 'blue', textAlign: 'center' }}><a href={`https://coston2-explorer.flare.network/tx/${hash}`}>View In Explorer</a></Typography>
                            </Box>
                            : <Typography>❌ {error.message}</Typography>}
                    </Box>}

        </Box>
    );
}

export default JoinTournamentButton;