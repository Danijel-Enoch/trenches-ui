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

// Subgraph data types
export interface SubgraphMarketCreated {
	transactionHash: string;
	tokenAddress: string;
	settlementTime: string;
	marketId: string;
	initialPrice: string;
	id: string;
	creator: string;
	blockTimestamp: string;
	blockNumber: string;
}

export interface SubgraphMarketSettled {
	marketId: string;
	id: string;
	finalPrice: string;
	blockTimestamp: string;
	blockNumber: string;
	transactionHash: string;
	winningOutcome: string;
}

export interface SubgraphFeePaid {
	creatorFee: string;
	id: string;
	marketId: string;
	platformFee: string;
	transactionHash: string;
	creator: string;
	blockTimestamp: string;
	blockNumber: string;
}

// Enhanced market interface combining contract and subgraph data
export interface EnhancedMarket extends Market {
	// Subgraph data
	creationTransaction?: string;
	settlementTransaction?: string;
	creationBlock?: string;
	settlementBlock?: string;
	creationTimestamp?: string;
	settlementTimestamp?: string;
	// Fee information
	totalFeesPaid?: bigint;
	creatorFeesEarned?: bigint;
	platformFeesGenerated?: bigint;
}
