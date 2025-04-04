// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Tournament} from "../src/Tournament.sol";

contract TournamentTest is Test {
    Tournament public tournament;

    function setUp() public {
        tournament = new Tournament("myTournament", 1, 4);
    }

    function test_addPlayers() public {
        tournament.addPlayer{ value: 1 ether }("player1");
        tournament.addPlayer{ value: 1 ether }("player2");
        tournament.addPlayer{ value: 1 ether }("player3");
        tournament.addPlayer{ value: 1 ether }("player4");
        assertEq(tournament.players(0), "player1");
        assertEq(tournament.players(1), "player2");
        assertEq(tournament.players(2), "player3");
        assertEq(tournament.players(3), "player4");
    }

    function test_startTournament() public {
        tournament.addPlayer{ value: 1 ether }("player1");
        tournament.addPlayer{ value: 1 ether }("player2");
        tournament.addPlayer{ value: 1 ether }("player3");
        tournament.addPlayer{ value: 1 ether }("player4");
        tournament.startTournament();
        assertEq(tournament.hasStarted(), true);
    }

    function test_finishTournament() public {
        tournament.addPlayer{ value: 1 ether }("player1");
        tournament.addPlayer{ value: 1 ether }("player2");
        tournament.addPlayer{ value: 1 ether }("player3");
        tournament.addPlayer{ value: 1 ether }("player4");
        tournament.startTournament();
        tournament.finishTournament();
        assertEq(tournament.hasFinished(), true);
    }

    // function test_givePrize() public {
    //     tournament.addPlayer{ value: 1 ether }("player1");
    //     tournament.addPlayer{ value: 1 ether }("player2");
    //     tournament.addPlayer{ value: 1 ether }("player3");
    //     tournament.addPlayer{ value: 1 ether }("player4");
    //     tournament.startTournament();
    //     tournament.finishTournament();
    //     tournament.givePrize();
    // }
}
