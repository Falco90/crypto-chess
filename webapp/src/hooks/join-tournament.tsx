import {
    useWriteContract,
    useWaitForTransactionReceipt,
} from 'wagmi';
import { abi as ChessTournamentABI } from '../contracts/ChessTournamentImpl.json';
import JsonApiVerificationJson from '../contracts/utils/IJsonApiVerification.json';
import { Address, decodeAbiParameters, parseEther } from 'viem';
import { Box, Button, Typography } from '@mui/material';

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
        isPending,
        isConfirming,
        isConfirmed,
        error,
    };
}

async function getDataAndProof(url: string) {
    console.log(url);
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

    const {
        addPlayer,
        isPending,
        isConfirming,
        isConfirmed,
        error,
    } = useAddPlayer();

    return (
        <Box>
            <Button onClick={() => getDataAndProof(url).then((proof) => {
                console.log(proof);
                addPlayer({ contractAddress, playerName, proof });
            })}>{isPending? "Pending" : isConfirming? "Confirming" : "Join Tournament"}</Button>

            {isConfirmed && <Typography>✅ Player added!</Typography>}
            {error && <p>❌ {error.message}</p>}
        </Box>
    );
}

export default JoinTournamentButton;