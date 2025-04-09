// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChessTournamentModule = buildModule("ChessTournamentModule", (m) => {
  const chessTournamentImpl = m.contract("ChessTournamentImpl", []);
  const chessTournamentProxy = m.contract("ChessTournamentProxy", [chessTournamentImpl]);
  
  return { chessTournamentImpl, chessTournamentProxy };
});

export default ChessTournamentModule;
