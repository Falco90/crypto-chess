// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import { Proxy } from "@openzeppelin/contracts/proxy/Proxy.sol";

contract ChessTournamentProxy is Proxy{
    address implementationAddress;

    constructor(address _implementationAddress) {
        implementationAddress = _implementationAddress;
    }
    function _implementation() internal view override returns (address) {
        return implementationAddress;
    }
}