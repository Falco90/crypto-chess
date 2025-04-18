import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from 'wagmi';
import { abi as ChessTournamentABI } from '../contracts/ChessTournamentImpl.json';
import JsonApiVerificationJson from '../contracts/utils/IJsonApiVerification.json';
import { Address, decodeAbiParameters, parseEther } from 'viem';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { useState } from 'react';

type AddPlayerParams = {
    contractAddress: `0x${string}`;
    playerName: string;
    proof: {
        response_hex: `0x${string}`;
        proof: string[];
    };
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
            abi: ChessTournamentABI,
            functionName: 'addPlayer',
            args: [
                {
                    merkleProof: proof.proof,
                    data: decodedResponse,
                },
                playerName,
            ],
            value: parseEther("2")
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
    const response = await fetch("http://localhost:3000/api/add-player", {
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

function JoinTournamentButton({ playerName, contractAddress, url }: { playerName: string, contractAddress: Address, url: string }) {
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={40} color='secondary' />
                    <Typography>{isGettingProof ? "Getting Proof" : isPending ? "Pending transaction in your wallet" : isConfirming ? "Confirming Transaction" : ""}</Typography>
                </Box>
                : ""}
            {!isConfirmed ?
                <Button variant="outlined" disabled={isPending || isConfirming || isGettingProof} onClick={() => {
                    setIsGettingProof(true);
                    getDataAndProof(url).then((proof) => {
                        setIsGettingProof(false);
                        addPlayer({ contractAddress, playerName, proof });
                    })
                }}>{isPending ? "Pending" : isConfirming ? "Confirming" : "Join Tournament"}</Button>
                :
                <Box sx={{ backgroundColor: 'grey.100', padding: '1rem' }}>
                    {!error ?
                        <Box>
                            <Typography sx={{ textAlign: 'center', marginBottom: '10px' }}>✅ Transaction Succesful!</Typography>
                            <Typography sx={{ color: 'blue', textAlign: 'center' }}><a href={`https://coston2-explorer.flare.network/tx/${hash}`}>View In Explorer</a></Typography>
                        </Box>
                        : <Typography>❌ {error.message}</Typography>}
                </Box>}
        </Box>
    );
}

export default JoinTournamentButton;