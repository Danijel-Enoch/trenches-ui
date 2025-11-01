"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
	mainnet,
	sepolia,
	base,
	baseSepolia,
	localhost,
	hardhat
} from "wagmi/chains";

export const config = getDefaultConfig({
	appName: "Trenches - Prediction Market",
	projectId:
		process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
	chains: [mainnet, sepolia, base, baseSepolia, localhost, hardhat],
	ssr: true
});
