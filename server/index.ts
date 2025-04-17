import express from 'express';
import {
    prepareAttestationRequestBase,
    submitAttestationRequest,
    retrieveDataAndProofBase,
} from "./fdc/Base";

const app = express();
const port = 3000;

app.use(express.json());

const {
    JQ_VERIFIER_URL_TESTNET,
    JQ_VERIFIER_API_KEY_TESTNET,
    COSTON2_DA_LAYER_URL,
} = process.env;

const attestationTypeBase = "IJsonApi";
const sourceIdBase = "WEB2";
const verifierUrlBase = JQ_VERIFIER_URL_TESTNET;

// prepare attestation -- backend
// submit attestation -- backend
// retrieve proof and data -- backend
// verify proof -- backend
// send proof and data to frontend
// interact with contract -- frontend

app.post('/api/add-player', async (req, res) => {
    const { url } = req.body;

    const apiUrl = url;
    const postprocessJq = `{url : .url, players : [.players[].username]}`;
    const abiSignature = `{\"components\": [{\"internalType\": \"string\", \"name\": \"url\", \"type\": \"string\"},{\"internalType\": \"string[]\", \"name\": \"players\", \"type\": \"string[]\"}],\"name\": \"task\",\"type\": \"tuple\"}`;

    //prepare attestation
    const data = await prepareAttestationRequest(apiUrl, postprocessJq, abiSignature);

    const abiEncodedRequest = data.abiEncodedRequest;
    //submit attestation
    const roundId = await submitAttestationRequest(abiEncodedRequest);
    console.log("roundID: ", roundId);

    //retrieve proof and data
    const dataAndProof = await retrieveDataAndProof(abiEncodedRequest, roundId);
    res.json({ dataAndProof: dataAndProof });
}
);

app.post('/api/finish-tournament', async (req, res) => {
    const { contractAddress, args } = req.body;
    res.json({ proof: '' })
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
    console.log("Url:", url, "\n");
    return await retrieveDataAndProofBase(url, abiEncodedRequest, roundId);
  }