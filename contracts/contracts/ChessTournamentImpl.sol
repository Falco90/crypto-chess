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
    string public winner;
    mapping(string => address) public playerNameToPlayerAddress;
    mapping(address => string) public playerAddressToPlayerName;
    string[] public playerNames;
    bool public prizeSent;

    struct AddPlayerDTO {
        string url;
        string[] players;
    }

    struct FinishTournamentDTO {
        string url;
        string status;
        string winner;
    }

    function initialize(
        address _organizer,
        string memory _url,
        uint256 _fee
    ) public initializer {
        url = _url;
        fee = _fee;

        __Ownable_init(_organizer);
    }

    function addPlayer(
        IJsonApi.Proof calldata data,
        string memory _playerName
    ) public payable {
        require(isJsonApiProofValid(data), "Proof invalid");

        AddPlayerDTO memory dto = abi.decode(
            data.data.responseBody.abi_encoded_data,
            (AddPlayerDTO)
        );

        require(
            keccak256(bytes(url)) == keccak256(bytes(dto.url)),
            "Tournament URL must match"
        );

        require(
            includes(dto.players, _playerName),
            "Username not in tournament players list"
        );

        require(msg.value == fee, "You need to pay the joining fee");

        playerNameToPlayerAddress[_playerName] = msg.sender;
        playerAddressToPlayerName[msg.sender] = _playerName;
        playerNames.push(_playerName);

        prize += msg.value;
    }

    function finishTournament(IJsonApi.Proof calldata data) public {
        require(isJsonApiProofValid(data), "Proof invalid");

        FinishTournamentDTO memory dto = abi.decode(
            data.data.responseBody.abi_encoded_data,
            (FinishTournamentDTO)
        );

        require(
            keccak256(bytes(url)) == keccak256(bytes(dto.url)),
            "Tournament URL must match"
        );
        require(
            keccak256(bytes(dto.status)) == keccak256(bytes("finished")),
            "Tournament must have finished"
        );

        winner = dto.winner;
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

        require(
            address(this).balance >= prize,
            "Not enough balance in contract"
        );

        (bool sent, ) = payable(playerNameToPlayerAddress[winner]).call{
            value: prize
        }("");
        require(sent, "Failed to send prize");
        prizeSent = true;
    }

    function getPlayers() public view returns (string[] memory){
        return playerNames;
    }

    function includes(
        string[] memory arr,
        string memory target
    ) internal pure returns (bool) {
        bytes32 targetHash = keccak256(bytes(target));

        for (uint i = 0; i < arr.length; i++) {
            if (keccak256(bytes(arr[i])) == targetHash) {
                return true;
            }
        }
        return false;
    }

    function abiSignatureHack(
        AddPlayerDTO calldata addPlayerDTO,
        FinishTournamentDTO calldata finishTournamentDTO
    ) private pure {}
}
