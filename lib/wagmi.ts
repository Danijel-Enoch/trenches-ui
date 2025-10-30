'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Trenches - Prediction Market',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [mainnet, sepolia, base, baseSepolia],
  ssr: true,
});
