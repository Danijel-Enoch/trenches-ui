import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";
import { PredictionMarket, PredictionMarketAbi } from "@/lib/contracts";
import { getMarketById } from "@/lib/graphql";
import { EnhancedMarket } from "@/lib/types";

const publicClient = createPublicClient({
	chain: mainnet,
	transport: http()
});

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const marketId = BigInt(id);
		const marketIdString = id;

		// Fetch contract data
		const marketInfo = await publicClient.readContract({
			address: PredictionMarket as `0x${string}`,
			abi: PredictionMarketAbi,
			functionName: "getMarketInfo",
			args: [marketId]
		});

		// Fetch subgraph data
		const subgraphData = await getMarketById(marketIdString);

		// Combine contract and subgraph data
		const marketCreated = subgraphData.marketCreateds[0];
		const marketSettled = subgraphData.marketSettleds[0];
		const feesPaid = subgraphData.feesPaids;

		// Calculate total fees
		const totalCreatorFees = feesPaid.reduce(
			(sum, fee) => sum + BigInt(fee.creatorFee),
			0n
		);
		const totalPlatformFees = feesPaid.reduce(
			(sum, fee) => sum + BigInt(fee.platformFee),
			0n
		);

		const enhancedMarket: EnhancedMarket = {
			id: marketId,
			creator: marketInfo[0],
			tokenAddress: marketInfo[1],
			initialPrice: marketInfo[2],
			createdAt: marketInfo[3],
			settlementTime: marketInfo[4],
			settled: marketInfo[5],
			finalPrice: marketInfo[6],
			// Enhanced data from subgraph
			creationTransaction: marketCreated?.transactionHash,
			settlementTransaction: marketSettled?.transactionHash,
			creationBlock: marketCreated?.blockNumber,
			settlementBlock: marketSettled?.blockNumber,
			creationTimestamp: marketCreated?.blockTimestamp,
			settlementTimestamp: marketSettled?.blockTimestamp,
			totalFeesPaid: totalCreatorFees + totalPlatformFees,
			creatorFeesEarned: totalCreatorFees,
			platformFeesGenerated: totalPlatformFees
		};

		return NextResponse.json(enhancedMarket);
	} catch (error) {
		console.error("Error fetching market:", error);
		return NextResponse.json(
			{ error: "Market not found" },
			{ status: 404 }
		);
	}
}
