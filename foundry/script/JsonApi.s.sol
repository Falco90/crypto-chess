// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "dependencies/forge-std-1.9.5/src/Script.sol";
import {console} from "dependencies/forge-std-1.9.5/src/console.sol";
import {Surl} from "dependencies/surl-0.0.0/src/Surl.sol";
import {Base} from "./Base.s.sol";
import {Base as StringsBase} from "src/utils/fdcStrings/Base.sol";
import {Strings} from "dependencies/@openzeppelin-contracts-5.2.0-rc.1/utils/Strings.sol";
import {IJsonApi} from "dependencies/flare-periphery-0.0.21/src/coston2/IJsonApi.sol";
import {ContractRegistry} from "dependencies/flare-periphery-0.0.21/src/coston2/ContractRegistry.sol";

string constant attestationTypeName = "IJsonApi";
string constant dirPath = "data/";

contract PrepareAttestationRequest is Script {
    using Surl for *;
    // Setting request data
    string public apiUrl =
        "https://api.chess.com/pub/tournament/-33rd-chesscom-quick-knockouts-1401-1600";
    string public postprocessJq =
        '{url: .url, creator: .creator, status: .status, winner: ([.players[] | select(.status == \\"active\\")][0].username)}';

    string publicAbiSignature =
        '{\\"components\\": ['
        '{\\"internalType\\": \\"string\\", \\"name\\": \\"url\\", \\"type\\": \\"string\\"},'
        '{\\"internalType\\": \\"string\\", \\"name\\": \\"creator\\", \\"type\\": \\"string\\"},'
        '{\\"internalType\\": \\"string\\", \\"name\\": \\"status\\", \\"type\\": \\"string\\"},'
        '{\\"internalType\\": \\"string\\", \\"name\\": \\"winner\\", \\"type\\": \\"string\\"}'
        "],"
        '\\"name\\": \\"task\\",\\"type\\": \\"tuple\\"}';

    string public sourceName = "WEB2";

    function prepareRequestBody(
        string memory url,
        string memory postprocessJq,
        string memory publicAbiSignature
    ) private pure returns (string memory) {
        return
            string.concat(
                '{"url": "',
                url,
                '","postprocessJq": "',
                postprocessJq,
                '","abi_signature": "',
                publicAbiSignature,
                '"}'
            );
    }

    function run() external {
        // Preparing request data
        string memory attestationType = Base.toUtf8HexString(
            attestationTypeName
        );
        string memory sourceId = Base.toUtf8HexString(sourceName);
        string memory requestBody = prepareRequestBody(
            apiUrl,
            postprocessJq,
            publicAbiSignature
        );

        (string[] memory headers, string memory body) = Base
            .prepareAttestationRequest(attestationType, sourceId, requestBody);

        string memory baseUrl = vm.envString("JQ_VERIFIER_URL_TESTNET");
        string memory url = string.concat(baseUrl, "JsonApi/prepareRequest");

        // Posting the attestation request
        (, bytes memory data) = url.post(headers, body);

        Base.AttestationResponse memory response = Base.parseAttestationRequest(
            data
        );

        // Writing to a file
        Base.writeToFile(
            dirPath,
            string.concat(attestationTypeName, "_abiEncodedRequest"),
            StringsBase.toHexString(response.abiEncodedRequest),
            true
        );
    }
}

contract SubmitAttestationRequest is Script {
    using Surl for *;
    function run() external {
        string memory fileName = string.concat(
            attestationTypeName,
            "_abiEncodedRequest.txt"
        );
        string memory filePath = string.concat(dirPath, fileName);
        string memory requestStr = vm.readLine(filePath);
        bytes memory request = vm.parseBytes(requestStr);

        Base.submitAttestationRequest(request);

        uint32 votingRoundId = Base.calculateRoundId();

        fileName = string.concat(
            attestationTypeName,
            "_votingRoundId"
        );

        Base.writeToFile(dirPath, fileName, Strings.toString(votingRoundId), true);
    }
}

contract RetrieveDataAndProof is Script {
    using Surl for *;

    function run() external {
        string memory daLayerUrl = vm.envString("COSTON2_DA_LAYER_URL"); // XXX
        string memory apiKey = vm.envString("X_API_KEY");

        // We import the roundId and abiEncodedRequest from the first file
        string memory requestBytes = vm.readLine(
            string.concat(
                dirPath,
                attestationTypeName,
                "_abiEncodedRequest",
                ".txt"
            )
        );
        string memory votingRoundId = vm.readLine(
            string.concat(
                dirPath,
                attestationTypeName,
                "_votingRoundId",
                ".txt"
            )
        );

        console.log("votingRoundId: %s\n", votingRoundId);
        console.log("requestBytes: %s\n", requestBytes);

        string[] memory headers = Base.prepareHeaders(apiKey);
        string memory body = string.concat(
            '{"votingRoundId":',
            votingRoundId,
            ',"requestBytes":"',
            requestBytes,
            '"}'
        );
        console.log("body: %s\n", body);
        console.log(
            "headers: %s",
            string.concat("{", headers[0], ", ", headers[1]),
            "}\n"
        );

        string memory url = string.concat(
            daLayerUrl,
            "api/v1/fdc/proof-by-request-round-raw"
        );
        console.log("url: %s\n", url);

        (uint256 status, bytes memory data) = Base.postAttestationRequest(url, headers, body);
        console.log("status: ",status);

        bytes memory dataJson = Base.parseData(data);
        Base.ParsableProof memory proof = abi.decode(
            dataJson,
            (Base.ParsableProof)
        );

        IJsonApi.Response memory proofResponse = abi.decode(
            proof.responseHex,
            (IJsonApi.Response)
        );

        IJsonApi.Proof memory _proof = IJsonApi.Proof(
            proof.proofs,
            proofResponse
        );
        verifyProof(_proof);
    }

    function verifyProof(IJsonApi.Proof memory proof) public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        bool isValid = ContractRegistry
            .auxiliaryGetIJsonApiVerification()
            .verifyJsonApi(proof);
        console.log("proof is valid: %s\n", StringsBase.toString(isValid));

        vm.stopBroadcast();
    }
}

contract Deploy is Script {}
