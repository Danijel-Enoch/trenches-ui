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
