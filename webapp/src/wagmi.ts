import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  flareTestnet,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
  chains: [
    flareTestnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [flareTestnet] : []),
  ],
  ssr: true,
});
