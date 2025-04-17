import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const HelpersModule = buildModule("HelpersModule", (m) => {
  const Helpers = m.contract("Helpers", []);

  return { Helpers };
});

export default HelpersModule;
