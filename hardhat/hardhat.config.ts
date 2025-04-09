import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const FLARE_API_KEY = process.env.FLARE_API_KEY ?? "";
const FLARESCAN_API_KEY = process.env.FLARESCAN_API_KEY ?? "";
const FLARE_EXPLORER_API_KEY = process.env.FLARE_EXPLORER_API_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.25",
        settings: {
          evmVersion: "london",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    coston2: {
      url:
        "https://coston2-api.flare.network/ext/C/rpc" +
        (FLARE_API_KEY ? `?x-apikey=${FLARE_API_KEY}` : ""),
      accounts: [`${PRIVATE_KEY}`],
      chainId: 114,
    },
  },
  etherscan: {
    apiKey: {
      coston2: `${FLARESCAN_API_KEY}`,
    },
    customChains: [
      {
        network: "coston2",
        chainId: 114,
        urls: {
          apiURL:
            "https://coston2-explorer.flare.network/api" +
            (FLARE_EXPLORER_API_KEY
              ? `?x-apikey=${FLARE_EXPLORER_API_KEY}`
              : ""),
          browserURL: "https://coston2-explorer.flare.network",
        },
      },
    ],
  },
};

export default config;
