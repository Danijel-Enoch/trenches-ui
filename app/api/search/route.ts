import { searchService } from "@/lib/searchService";
import { NextRequest, NextResponse } from "next/server";
import { TokenDetails } from "@/lib/types";
import { formatPriceForContract } from "@/lib/utils";

// Helper function to validate if a string is a valid Ethereum address
function isValidAddress(address: string): boolean {
	return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get("q");
		const chains = searchParams.get("chains")?.split(",") || [
			"ethereum",
			"bsc",
			"solana",
			"base"
		];

		if (!query) {
			return NextResponse.json(
				{ error: "Query parameter 'q' is required" },
				{ status: 400 }
			);
		}

		if (!isValidAddress(query)) {
			return NextResponse.json(
				{
					error: "Only token addresses are allowed. Please provide a valid token contract address (0x...)"
				},
				{ status: 400 }
			);
		}

		const results = await searchService.search(query, chains);

		// Transform results to include formatted price for contract
		const tokenDetails: TokenDetails[] = results.map((result) => ({
			address: result.tokenAddress,
			symbol: result.symbol,
			name: result.name,
			price: result.priceUsd,
			marketCap: result.marketCap,
			liquidity: result.liquidity,
			logo: result.imageUrl,
			chains: [result.chain],
			priceFormatted: formatPriceForContract(result.priceUsd)
		}));

		return NextResponse.json({
			success: true,
			data: tokenDetails,
			query,
			chains,
			resultsCount: tokenDetails.length
		});
	} catch (error) {
		console.error("Search API error:", error);
		return NextResponse.json(
			{
				error: "Internal server error",
				message:
					error instanceof Error ? error.message : "Unknown error"
			},
			{ status: 500 }
		);
	}
}
