// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Tournament {
    string public name;
    address public organizer;
    uint8 public fee;
    uint8 public maxPlayers;
    bool public hasStarted;
    bool public hasFinished;
    address public winner;
    mapping(string => address) public playerToAddress;
    string[] public players;

    constructor(string memory _name, uint8 _fee, uint8 _maxPlayers) payable {
        name = _name;
        fee = _fee;
        maxPlayers = _maxPlayers;
        organizer = msg.sender;
    }

    function addPlayer(string memory _player) public payable {
        require(msg.value >= fee, "need to pay the joining fee");
        require(players.length < maxPlayers, "tournament is full");

        playerToAddress[_player] = msg.sender;
        players.push(_player);
    }

    function startTournament() public {
        require(
            organizer == msg.sender,
            "only organizer can start the tournament"
        );
        require(players.length == maxPlayers, "tournament is not full yet");

        hasStarted = true;
    }

    function finishTournament() public {
        require(
            organizer == msg.sender,
            "only organizer can start the tournament"
        );
        require(hasStarted, "must have started");

        // set winner

        hasFinished = true;
    }

    function givePrize() public {
        require(hasFinished, "Tournament must have finished");

        winner.call{value: address(this).balance}("");
    }
}
