import { GraphQLClient } from "graphql-request";

// Subgraph endpoint
const SUBGRAPH_URL =
	process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
	"http://localhost:8000/subgraphs/name/trenches-graph";

// Create GraphQL client instance
export const graphqlClient = new GraphQLClient(SUBGRAPH_URL);

// GraphQL Queries
export const GET_MARKET_CREATEDS = `
  query GetMarketCreateds($first: Int = 100, $skip: Int = 0, $orderBy: String = "blockTimestamp", $orderDirection: String = "desc") {
    marketCreateds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      transactionHash
      tokenAddress
      settlementTime
      marketId
      initialPrice
      id
      creator
      blockTimestamp
      blockNumber
    }
  }
`;

export const GET_MARKET_SETTLEDS = `
  query GetMarketSettleds($first: Int = 100, $skip: Int = 0, $orderBy: String = "blockTimestamp", $orderDirection: String = "desc") {
    marketSettleds(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      marketId
      id
      finalPrice
      blockTimestamp
      blockNumber
      transactionHash
      winningOutcome
    }
  }
`;

export const GET_FEES_PAIDS = `
  query GetFeesPaids($first: Int = 100, $skip: Int = 0, $orderBy: String = "blockTimestamp", $orderDirection: String = "desc") {
    feesPaids(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      creatorFee
      id
      marketId
      platformFee
      transactionHash
      creator
      blockTimestamp
      blockNumber
    }
  }
`;

// Query for specific market data
export const GET_MARKET_BY_ID = `
  query GetMarketById($marketId: String!) {
    marketCreateds(where: { marketId: $marketId }) {
      transactionHash
      tokenAddress
      settlementTime
      marketId
      initialPrice
      id
      creator
      blockTimestamp
      blockNumber
    }
    marketSettleds(where: { marketId: $marketId }) {
      marketId
      id
      finalPrice
      blockTimestamp
      blockNumber
      transactionHash
      winningOutcome
    }
    feesPaids(where: { marketId: $marketId }) {
      creatorFee
      id
      marketId
      platformFee
      transactionHash
      creator
      blockTimestamp
      blockNumber
    }
  }
`;

// Query for markets by creator
export const GET_MARKETS_BY_CREATOR = `
  query GetMarketsByCreator($creator: String!, $first: Int = 100, $skip: Int = 0) {
    marketCreateds(
      where: { creator: $creator }
      first: $first
      skip: $skip
      orderBy: blockTimestamp
      orderDirection: desc
    ) {
      transactionHash
      tokenAddress
      settlementTime
      marketId
      initialPrice
      id
      creator
      blockTimestamp
      blockNumber
    }
  }
`;

// Types for the GraphQL responses
export interface MarketCreated {
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

export interface MarketSettled {
	marketId: string;
	id: string;
	finalPrice: string;
	blockTimestamp: string;
	blockNumber: string;
	transactionHash: string;
	winningOutcome: string;
}

export interface FeePaid {
	creatorFee: string;
	id: string;
	marketId: string;
	platformFee: string;
	transactionHash: string;
	creator: string;
	blockTimestamp: string;
	blockNumber: string;
}

export interface MarketCreatedsResponse {
	marketCreateds: MarketCreated[];
}

export interface MarketSettledsResponse {
	marketSettleds: MarketSettled[];
}

export interface FeesPaidsResponse {
	feesPaids: FeePaid[];
}

export interface MarketByIdResponse {
	marketCreateds: MarketCreated[];
	marketSettleds: MarketSettled[];
	feesPaids: FeePaid[];
}

export interface MarketsByCreatorResponse {
	marketCreateds: MarketCreated[];
}

// Helper functions to execute queries
export async function getMarketCreateds(variables?: {
	first?: number;
	skip?: number;
	orderBy?: string;
	orderDirection?: string;
}): Promise<MarketCreatedsResponse> {
	return await graphqlClient.request<MarketCreatedsResponse>(
		GET_MARKET_CREATEDS,
		variables
	);
}

export async function getMarketSettleds(variables?: {
	first?: number;
	skip?: number;
	orderBy?: string;
	orderDirection?: string;
}): Promise<MarketSettledsResponse> {
	return await graphqlClient.request<MarketSettledsResponse>(
		GET_MARKET_SETTLEDS,
		variables
	);
}

export async function getFeesPaids(variables?: {
	first?: number;
	skip?: number;
	orderBy?: string;
	orderDirection?: string;
}): Promise<FeesPaidsResponse> {
	return await graphqlClient.request<FeesPaidsResponse>(
		GET_FEES_PAIDS,
		variables
	);
}

export async function getMarketById(
	marketId: string
): Promise<MarketByIdResponse> {
	return await graphqlClient.request<MarketByIdResponse>(GET_MARKET_BY_ID, {
		marketId
	});
}

export async function getMarketsByCreator(
	creator: string,
	variables?: { first?: number; skip?: number }
): Promise<MarketsByCreatorResponse> {
	return await graphqlClient.request<MarketsByCreatorResponse>(
		GET_MARKETS_BY_CREATOR,
		{
			creator,
			...variables
		}
	);
}
