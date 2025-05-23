import express from 'express';
import {
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBase,
} from "./fdc/Base";
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const {
    JQ_VERIFIER_URL_TESTNET,
    JQ_VERIFIER_API_KEY_TESTNET,
    COSTON2_DA_LAYER_URL,
} = process.env;

const attestationTypeBase = "IJsonApi";
const sourceIdBase = "WEB2";
const verifierUrlBase = JQ_VERIFIER_URL_TESTNET;

app.post('/api/add-player', async (req, res) => {
    const { url } = req.body;

    const postprocessJq = `{url : .url, players : [.players[].username]}`;

    const abiSignature = `{\"components\": [{\"internalType\": \"string\", \"name\": \"url\", \"type\": \"string\"},{\"internalType\": \"string[]\", \"name\": \"players\", \"type\": \"string[]\"}],\"name\": \"task\",\"type\": \"tuple\"}`;

    // Prepare attestation
    const data = await prepareAttestationRequest(url, postprocessJq, abiSignature);

    const abiEncodedRequest = data.abiEncodedRequest;

    // Submit attestation
    const roundId = await submitAttestationRequest(abiEncodedRequest);

    // Retrieve proof and data from DA layer
    const dataAndProof = await retrieveDataAndProof(abiEncodedRequest, roundId);

    // Send to frontend
    res.json(dataAndProof);
}
);

app.post('/api/finish-tournament', async (req, res) => {
    const { url } = req.body;

    const postprocessJq = `{url : .url, status: .status, winner : [.players[] | select(.status == "active")][0].username}`;

    const abiSignature = `{\"components\": [{\"internalType\": \"string\", \"name\": \"url\", \"type\": \"string\"},{\"internalType\": \"string\", \"name\": \"status\", \"type\": \"string\"}, {\"internalType\": \"string\", \"name\": \"winner\", \"type\": \"string\"} ],\"name\": \"task\",\"type\": \"tuple\"}`;

    // Prepare attestation
    const data = await prepareAttestationRequest(url, postprocessJq, abiSignature);

    const abiEncodedRequest = data.abiEncodedRequest;

    // Submit attestation
    const roundId = await submitAttestationRequest(abiEncodedRequest);
    console.log("roundID: ", roundId);

    // Retrieve proof and data from DA layer
    const dataAndProof = await retrieveDataAndProof(abiEncodedRequest, roundId);

    // Send to frontend
    res.json(dataAndProof);
})

app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});

async function prepareAttestationRequest(
    apiUrl: string,
    postprocessJq: string,
    abiSignature: string
) {
    const requestBody = {
        url: apiUrl,
        postprocessJq: postprocessJq,
        abi_signature: abiSignature,
    };

    const url = `${verifierUrlBase}JsonApi/prepareRequest`;
    const apiKey = JQ_VERIFIER_API_KEY_TESTNET!;

    return await prepareAttestationRequestBase(
        url,
        apiKey,
        attestationTypeBase,
        sourceIdBase,
        requestBody
    );
}

async function retrieveDataAndProof(
    abiEncodedRequest: string,
    roundId: number
) {
    const url = `${COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;

    return await retrieveDataAndProofBase(url, abiEncodedRequest, roundId);
}