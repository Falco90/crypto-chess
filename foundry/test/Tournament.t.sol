// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "dependencies/forge-std-1.9.5/src/Test.sol";
import {Tournament} from "../src/Tournament.sol";
import {IJsonApi} from "dependencies/flare-periphery-0.0.21/src/coston2/IJsonApi.sol";

contract TournamentTest is Test {
    Tournament public tournament;

    address organizer;
    address playerAddress1;
    address playerAddress2;
    address playerAddress3;
    address playerAddress4;

    function setUp() public {
        organizer = address(0x99);

        Receiver receiver1 = new Receiver();
        playerAddress1 = address(receiver1);
        Receiver receiver2 = new Receiver();
        playerAddress2 = address(receiver2);
        Receiver receiver3 = new Receiver();
        playerAddress3 = address(receiver3);
        Receiver receiver4 = new Receiver();
        playerAddress4 = address(receiver4);

        tournament = new Tournament("myTournament", 1 ether, 4);

        hoax(playerAddress1, 10 ether);
        tournament.addPlayer{value: 1 ether}("player1");

        hoax(playerAddress2, 10 ether);
        tournament.addPlayer{value: 1 ether}("player2");

        hoax(playerAddress3, 10 ether);
        tournament.addPlayer{value: 1 ether}("player3");

        hoax(playerAddress4, 10 ether);
        tournament.addPlayer{value: 1 ether}("player4");
    }

    function test_addPlayers() public view {
        assertEq(address(playerAddress1).balance, 9 ether);
        assertEq(
            tournament.playerAddressToPlayerName(playerAddress1),
            "player1"
        );
        assertEq(tournament.playerNames(2), "player3");
        assertEq(address(tournament).balance, 4 ether);
    }

    function test_startTournament() public {
        tournament.startTournament();
        assertEq(tournament.hasStarted(), true);
    }

    // function test_finishTournament(mock_proof) public {
    //     tournament.startTournament();
    //     tournament.finishTournament();
    //     assertEq(tournament.hasFinished(), true);
    //     assertEq(tournament.winner(), "player1");

    //     uint256 balanceBefore = tournament
    //         .playerNameToPlayerAddress("player1")
    //         .balance;

    //     uint256 balanceAfter = tournament
    //         .playerNameToPlayerAddress("player1")
    //         .balance;

    //     assertEq(balanceAfter - balanceBefore, 4 ether);
    // }
}

contract Receiver {
    receive() external payable {}
}
