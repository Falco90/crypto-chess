// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Tournament} from "../src/Tournament.sol";

contract TournamentScript is Script {
    Tournament public tournament;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        tournament = new Tournament("myTournament", 1, 4);

        vm.stopBroadcast();
    }
}
