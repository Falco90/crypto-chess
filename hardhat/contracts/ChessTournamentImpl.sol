// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston2/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston2/IFdcVerification.sol";
import {IJsonApi} from "@flarenetwork/flare-periphery-contracts/coston2/IJsonApi.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract ChessTournamentImpl is Initializable, OwnableUpgradeable {
    string public url;
    uint256 public fee;
    uint256 public prize;
    uint8 public maxPlayers;
    bool public hasStarted;
    bool public hasFinished;
    string public winner;
    mapping(string => address) public playerNameToPlayerAddress;
    mapping(address => string) public playerAddressToPlayerName;
    string[] public playerNames;

    struct DataTransportObject {
        string url;
        string status;
        string winner;
    }

    function initialize(
        string memory _url,
        uint8 _maxPlayers,
        uint256 _fee
    ) public initializer {
        url = _url;
        maxPlayers = _maxPlayers;
        fee = _fee;
    }

    function addPlayer(string memory _playerName) public payable {
        require(!hasStarted, "Tournament has already started");
        require(msg.value == fee, "need to pay the joining fee");
        require(playerNames.length < maxPlayers, "tournament is full");

        playerNameToPlayerAddress[_playerName] = msg.sender;
        playerAddressToPlayerName[msg.sender] = _playerName;
        playerNames.push(_playerName);

        prize += msg.value;
    }

    function startTournament() public onlyOwner {
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
        require(
            playerNameToPlayerAddress[winner] != address(0),
            "player should have address"
        );
        require(prize > 0, "Prize must be greater than 0");
        require(
            address(this).balance >= prize,
            "Not enough balance in contract"
        );

        (bool sent, ) = payable(playerNameToPlayerAddress[winner]).call{
            value: prize
        }("");
        require(sent, "Failed to send prize");
    }

    receive() external payable {}

    function abiSignatureHack(DataTransportObject calldata dto) private pure {}
}
