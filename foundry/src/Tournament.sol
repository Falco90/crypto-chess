// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Tournament {
    string public name;
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

    constructor(string memory _name, uint256 _fee, uint8 _maxPlayers) payable {
        name = _name;
        fee = _fee;
        maxPlayers = _maxPlayers;
        organizer = msg.sender;
    }

    receive() external payable {}

    function addPlayer(string memory _playerName) public payable {
        require(!hasStarted, "Tournament has already started");
        require(msg.value == fee , "need to pay the joining fee");
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

    function finishTournament() public {
        require(
            organizer == msg.sender,
            "only organizer can finish the tournament"
        );
        require(hasStarted, "must have started");

        // get winner from json api - hardcoded for now
        winner = "player1";

        hasFinished = true;
    }

    function givePrize() public {
        require(hasFinished, "Tournament must have finished");
        require(
            playerNameToPlayerAddress[winner] != address(0),
            "player should have address"
        );
        require(prize > 0, "Prize must be greater than 0");
        require(address(this).balance >= prize, "Not enough balance in contract");

        emit DebugInfo(playerNameToPlayerAddress[winner], prize, address(this).balance);

        (bool sent, ) = payable(playerNameToPlayerAddress[winner]).call{
            value: prize
        }("");
        require(sent, "Failed to send prize");
    }
}

event DebugInfo(address winner, uint256 prizeAmount, uint256 contractBalance);