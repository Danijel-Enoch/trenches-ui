"use client";

/**
 * Home page that fetches all created markets using GraphQL subgraph
 * Uses the useMarketCreateds hook to fetch market data with auto-refresh
 */
import { Navbar } from "@/components/navbar";
import { MarketCard } from "@/components/market-card";
import { Market } from "@/lib/types";
import { motion } from "framer-motion";
import { useMarketCreateds } from "@/lib/hooks";
import { useState, useEffect } from "react";

export default function Home() {
	const [markets, setMarkets] = useState<{ id: bigint; data: Market }[]>([]);

	// Fetch all created markets using the GraphQL subgraph
	const {
		data: marketCreateds,
		loading,
		error
	} = useMarketCreateds({
		first: 100,
		orderBy: "blockTimestamp",
		orderDirection: "desc",
		autoRefresh: true,
		refreshInterval: 10000 // Refresh every 10 seconds
	});

	useEffect(() => {
		if (!marketCreateds || marketCreateds.length === 0) return;

		const transformMarkets = async () => {
			const marketsList: { id: bigint; data: Market }[] = [];

			for (const marketCreated of marketCreateds) {
				try {
					// Convert subgraph data to Market interface format
					const market: Market = {
						id: BigInt(marketCreated.marketId),
						creator: marketCreated.creator as `0x${string}`,
						tokenAddress:
							marketCreated.tokenAddress as `0x${string}`,
						initialPrice: BigInt(marketCreated.initialPrice),
						createdAt: BigInt(marketCreated.blockTimestamp),
						settlementTime: BigInt(marketCreated.settlementTime),
						settled: false, // We'll need to check this separately or get from API
						finalPrice: BigInt(0),
						winningOutcome: undefined
					};

					marketsList.push({
						id: BigInt(marketCreated.marketId),
						data: market
					});
				} catch (error) {
					console.error(
						`Error processing market ${marketCreated.marketId}:`,
						error
					);
				}
			}

			setMarkets(marketsList);
		};

		transformMarkets();
	}, [marketCreateds]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
			<Navbar />

			<main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8 sm:mb-12"
				>
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
						Trenches Prediction Markets
					</h1>
					<p className="text-lg sm:text-xl text-zinc-400 px-4">
						Predict token price movements. Five outcomes. Settle at
						midnight.
					</p>
					{!loading && !error && markets.length > 0 && (
						<p className="text-sm text-zinc-500 mt-2">
							{markets.length} market
							{markets.length === 1 ? "" : "s"} found
						</p>
					)}
				</motion.div>

				{loading ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12 sm:py-20"
					>
						<div className="animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
						<h2 className="text-xl sm:text-2xl font-semibold mb-2">
							Loading Markets
						</h2>
						<p className="text-zinc-400 px-4">
							Fetching the latest prediction markets...
						</p>
					</motion.div>
				) : error ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-20"
					>
						<div className="text-6xl mb-4">⚠️</div>
						<h2 className="text-2xl font-semibold mb-2 text-red-400">
							Error Loading Markets
						</h2>
						<p className="text-zinc-400 mb-6">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all"
						>
							Try Again
						</button>
					</motion.div>
				) : markets.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-12 sm:py-20"
					>
						<div className="text-5xl sm:text-6xl mb-4">🎯</div>
						<h2 className="text-xl sm:text-2xl font-semibold mb-2">
							No Active Markets
						</h2>
						<p className="text-zinc-400 mb-6 px-4">
							Be the first to create a prediction market and start
							earning!
						</p>
						<div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
							<a
								href="/create"
								className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
							>
								Create Market
							</a>
							<a
								href="/positions"
								className="inline-block px-6 py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-semibold transition-all"
							>
								View Positions
							</a>
						</div>
					</motion.div>
				) : (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
					>
						{markets.map(({ id, data }) => (
							<MarketCard
								key={id.toString()}
								market={data}
								marketId={id}
							/>
						))}
					</motion.div>
				)}
			</main>
		</div>
	);
}
