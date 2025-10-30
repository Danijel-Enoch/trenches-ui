import { NextRequest, NextResponse } from "next/server";
import { getMarketCreateds } from "@/lib/graphql";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const first = searchParams.get("first")
			? parseInt(searchParams.get("first")!)
			: 100;
		const skip = searchParams.get("skip")
			? parseInt(searchParams.get("skip")!)
			: 0;
		const orderBy = searchParams.get("orderBy") || "blockTimestamp";
		const orderDirection = searchParams.get("orderDirection") || "desc";

		const response = await getMarketCreateds({
			first,
			skip,
			orderBy,
			orderDirection
		});

		return NextResponse.json(response.marketCreateds);
	} catch (error) {
		console.error("Error fetching markets from subgraph:", error);
		return NextResponse.json(
			{ error: "Failed to fetch markets" },
			{ status: 500 }
		);
	}
}
