// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract ChessTournamentProxy is ERC1967Proxy {
    constructor(
        address _logic,
        bytes memory _initData
    ) ERC1967Proxy(_logic, _initData) {}
}
