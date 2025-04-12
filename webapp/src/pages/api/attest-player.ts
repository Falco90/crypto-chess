// import { NextApiRequest, NextApiResponse } from "next"
// import { prepareAttestationRequestBase } from "../../lib/Base";


// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method === 'POST') {
//         const { url } = req.body;
        
//         const {
//             JQ_VERIFIER_URL_TESTNET,
//             JQ_VERIFIER_API_KEY_TESTNET,
//             COSTON2_DA_LAYER_URL,
//         } = process.env;

//         const apiUrl = url;
//         const postprocessJq = `{url: .url, players: [.players[].username]}`;
//         const abiSignature = `{\"components\": [{\"internalType\": \"string\", \"name\": \"url\", \"type\": \"string\"},{\"internalType\": \"string[]\", \"name\": \"players\", \"type\": \"string[]\"}],\"name\": \"task\",\"type\": \"tuple\"}`;

//         // Configuration constants
//         const attestationTypeBase = "IJsonApi";
//         const sourceIdBase = "WEB2";
//         const verifierUrlBase = JQ_VERIFIER_URL_TESTNET;








//         res.status(201).json({ message: `User ${name} created` })
//     } else {
//         res.setHeader('Allow', ['POST'])
//         res.status(405).end(`Method ${req.method} Not Allowed`)
//     }
// }

// async function prepareAttestationRequest(
//     apiUrl: string,
//     postprocessJq: string,
//     abiSignature: string
// ) {
//     const requestBody = {
//         url: apiUrl,
//         postprocessJq: postprocessJq,
//         abi_signature: abiSignature,
//     };

//     const url = `${verifierUrlBase}JsonApi/prepareRequest`;
//     const apiKey = JQ_VERIFIER_API_KEY_TESTNET!;

//     return await prepareAttestationRequestBase(
//         url,
//         apiKey,
//         attestationTypeBase,
//         sourceIdBase,
//         requestBody
//     );
// }