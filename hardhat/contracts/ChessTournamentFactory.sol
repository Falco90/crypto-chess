// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.25;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import "./ChessTournamentImpl.sol";

contract ChessTournamentFactory {
    address public implementation;
    Tournament[] public allChessTournaments;

    struct Tournament {
        address contractAddress;
        string url;
        uint256 fee;
    }

    event ChessTournamentCloned(
        address indexed organizer,
        string indexed url,
        address clone
    );

    constructor(address _implementation) {
        implementation = _implementation;
    }

    function createChessTournament(
        string calldata _url,
        uint256 _fee
    ) external returns (address clone) {
        clone = Clones.clone(implementation);
        ChessTournamentImpl(clone).initialize(msg.sender, _url, _fee);
        allChessTournaments.push(
            Tournament({contractAddress: clone, url: _url, fee: _fee})
        );

        emit ChessTournamentCloned(msg.sender, _url, clone);
    }

    function getAllChessTournaments() external view returns (Tournament[] memory) {
        return allChessTournaments;
    }
}
