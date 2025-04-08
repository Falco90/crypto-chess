// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IJsonApi} from "dependencies/flare-periphery-0.0.21/src/coston2/IJsonApi.sol";
import {ContractRegistry} from "dependencies/flare-periphery-0.0.21/src/coston2/ContractRegistry.sol";

contract Tournament {
    string public url;
    address public organizer;
    uint256 public fee;
    uint256 public prize;
    uint8 public maxPlayers;
    bool public hasStarted;
    bool public hasFinished;
    string public winner;
    mapping(string => address) public playerNameToPlayerAddress;
    mapping(address => string) public playerAddressToPlayerName;
    string[] public playerNames;
    address[] public playerAddresses;

    struct DataTransportObject {
        string url;
        string creator;
        string status;
        string winner;
    }

    struct Player {
        string username;
        string status;
    }

    constructor(string memory _url, uint256 _fee, uint8 _maxPlayers) payable {
        url = _url;
        fee = _fee;
        maxPlayers = _maxPlayers;
        organizer = msg.sender;
    }

    receive() external payable {}

    function addPlayer(string memory _playerName) public payable {
        require(!hasStarted, "Tournament has already started");
        require(msg.value == fee, "need to pay the joining fee");
        require(playerNames.length < maxPlayers, "tournament is full");

        playerNameToPlayerAddress[_playerName] = msg.sender;
        playerAddressToPlayerName[msg.sender] = _playerName;
        playerNames.push(_playerName);

        prize += msg.value;
    }

    function startTournament() public {
        require(
            organizer == msg.sender,
            "only organizer can start the tournament"
        );
        require(playerNames.length == maxPlayers, "tournament is not full yet");

        hasStarted = true;
    }

    function finishTournament(IJsonApi.Proof calldata data) public {
        require(isJsonApiProofValid(data), "proof invalid");

        DataTransportObject memory dto = abi.decode(
            data.data.responseBody.abi_encoded_data,
            (DataTransportObject)
        );

        require(
            keccak256(bytes(url)) == keccak256(bytes(dto.url)),
            "tournament url must match"
        );
        require(
            keccak256(bytes(dto.status)) == keccak256(bytes("finished")),
            "tournament must have finished"
        );

        winner = dto.winner;
        hasFinished = true;
        givePrize();
    }

    function isJsonApiProofValid(
        IJsonApi.Proof calldata _proof
    ) private view returns (bool) {
        return
            ContractRegistry.auxiliaryGetIJsonApiVerification().verifyJsonApi(
                _proof
            );
    }

    function givePrize() private {
        require(hasFinished, "Tournament must have finished");
        require(
            playerNameToPlayerAddress[winner] != address(0),
            "player should have address"
        );
        require(prize > 0, "Prize must be greater than 0");
        require(
            address(this).balance >= prize,
            "Not enough balance in contract"
        );

        emit DebugInfo(
            playerNameToPlayerAddress[winner],
            prize,
            address(this).balance
        );

        (bool sent, ) = payable(playerNameToPlayerAddress[winner]).call{
            value: prize
        }("");
        require(sent, "Failed to send prize");
    }
}
