export interface Market {
	id: bigint;
	creator: string;
	tokenAddress: string;
	initialPrice: bigint;
	createdAt: bigint;
	settlementTime: bigint;
	settled: boolean;
	finalPrice: bigint;
	winningOutcome?: number;
}

export interface OutcomeStats {
	totalShares: bigint;
	totalVolume: bigint;
}

export interface UserPosition {
	marketId: bigint;
	upShares: bigint;
	downShares: bigint;
}

export enum Outcome {
	UP = 0,
	DOWN = 1
}

export interface TokenDetails {
	address: string;
	symbol: string;
	name: string;
	price: string; // Price in USD
	marketCap: string;
	liquidity: string;
	logo?: string;
	chains: string[];
	// Price formatted to 18 decimal places for smart contract
	priceFormatted: string;
}
