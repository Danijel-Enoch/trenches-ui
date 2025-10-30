"use client";

import { Navbar } from "@/components/navbar";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { PredictionMarket, PredictionMarketAbi } from "@/lib/contracts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { formatEther, parseEther } from "viem";

interface PendingMarket {
	marketId: bigint;
	tokenAddress: string;
	initialPrice: bigint;
	creator: string;
	creationTime: number;
	isApproved: boolean;
}

export default function AdminDashboard() {
	const { address } = useAccount();
	const [pendingMarkets, setPendingMarkets] = useState<PendingMarket[]>([]);
	const [adjustedPrices, setAdjustedPrices] = useState<{
		[key: string]: string;
	}>({});
	const { writeContract } = useWriteContract();

	// Check if current user is admin/owner
	const { data: owner } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "owner"
	});

	const isAdmin =
		address &&
		owner &&
		address.toLowerCase() === (owner as string).toLowerCase();

	useEffect(() => {
		// In a real implementation, you'd fetch pending markets from your backend
		// This is a mock implementation
		const fetchPendingMarkets = async () => {
			// Mock data - replace with actual API call
			const mockMarkets: PendingMarket[] = [
				{
					marketId: 1n,
					tokenAddress: "PEPE/USDT",
					initialPrice: parseEther("0.00001234"),
					creator: "0x1234...5678",
					creationTime: Date.now(),
					isApproved: false
				}
			];
			setPendingMarkets(mockMarkets);
		};

		if (isAdmin) {
			fetchPendingMarkets();
		}
	}, [isAdmin]);

	const handleApproveMarket = async (
		marketId: bigint,
		adjustedPrice?: string
	) => {
		try {
			const finalPrice = adjustedPrice
				? parseEther(adjustedPrice)
				: undefined;

			// If price is adjusted, update it first
			if (finalPrice) {
				await writeContract({
					address: PredictionMarket as `0x${string}`,
					abi: PredictionMarketAbi,
					functionName: "updateMarketPrice", // This would need to be added to the contract
					args: [marketId, finalPrice]
				});
			}

			// Then approve the market
			await writeContract({
				address: PredictionMarket as `0x${string}`,
				abi: PredictionMarketAbi,
				functionName: "approveMarket", // This would need to be added to the contract
				args: [marketId]
			});

			// Update local state
			setPendingMarkets((prev) =>
				prev.map((market) =>
					market.marketId === marketId
						? {
								...market,
								isApproved: true,
								initialPrice: finalPrice || market.initialPrice
						  }
						: market
				)
			);
		} catch (error) {
			console.error("Error approving market:", error);
		}
	};

	const handleRejectMarket = async (marketId: bigint) => {
		try {
			await writeContract({
				address: PredictionMarket as `0x${string}`,
				abi: PredictionMarketAbi,
				functionName: "rejectMarket", // This would need to be added to the contract
				args: [marketId]
			});

			// Remove from local state
			setPendingMarkets((prev) =>
				prev.filter((market) => market.marketId !== marketId)
			);
		} catch (error) {
			console.error("Error rejecting market:", error);
		}
	};

	if (!address) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
				<Navbar />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center py-20">
						<div className="text-6xl mb-4">🔐</div>
						<h2 className="text-2xl font-semibold mb-2">
							Connect Your Wallet
						</h2>
						<p className="text-zinc-400">
							Connect your wallet to access admin features
						</p>
					</div>
				</main>
			</div>
		);
	}

	if (!isAdmin) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
				<Navbar />
				<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="text-center py-20">
						<div className="text-6xl mb-4">⛔</div>
						<h2 className="text-2xl font-semibold mb-2">
							Access Denied
						</h2>
						<p className="text-zinc-400">
							You don't have admin privileges
						</p>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
			<Navbar />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
						Admin Dashboard
					</h1>
					<p className="text-zinc-400">
						Review and approve market creations
					</p>
				</motion.div>

				{pendingMarkets.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-center py-20"
					>
						<div className="text-6xl mb-4">✅</div>
						<h2 className="text-2xl font-semibold mb-2">
							No Pending Markets
						</h2>
						<p className="text-zinc-400">
							All markets have been reviewed
						</p>
					</motion.div>
				) : (
					<div className="grid grid-cols-1 gap-6">
						{pendingMarkets.map((market, index) => (
							<motion.div
								key={market.marketId.toString()}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 border border-zinc-700"
							>
								<div className="flex justify-between items-start mb-4">
									<div>
										<h3 className="text-xl font-bold mb-1">
											{market.tokenAddress}
										</h3>
										<p className="text-sm text-zinc-400">
											Created by: {market.creator} •
											Market #{market.marketId.toString()}
										</p>
									</div>
									<span
										className={`px-3 py-1 rounded-full text-xs border ${
											market.isApproved
												? "bg-green-500/20 text-green-400 border-green-500/30"
												: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
										}`}
									>
										{market.isApproved
											? "Approved"
											: "Pending Review"}
									</span>
								</div>

								<div className="grid grid-cols-2 gap-4 mb-4">
									<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
										<p className="text-sm text-blue-400 mb-1">
											Proposed Initial Price
										</p>
										<p className="text-2xl font-bold">
											${formatEther(market.initialPrice)}
										</p>
									</div>
									<div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
										<p className="text-sm text-purple-400 mb-1">
											Admin Adjusted Price
										</p>
										<input
											type="number"
											step="0.000001"
											placeholder={formatEther(
												market.initialPrice
											)}
											value={
												adjustedPrices[
													market.marketId.toString()
												] || ""
											}
											onChange={(e) =>
												setAdjustedPrices((prev) => ({
													...prev,
													[market.marketId.toString()]:
														e.target.value
												}))
											}
											className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-sm focus:outline-none focus:border-purple-500"
										/>
									</div>
								</div>

								{!market.isApproved && (
									<div className="flex gap-3">
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() =>
												handleApproveMarket(
													market.marketId,
													adjustedPrices[
														market.marketId.toString()
													]
												)
											}
											className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all"
										>
											{adjustedPrices[
												market.marketId.toString()
											]
												? "Approve with New Price"
												: "Approve as Proposed"}
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() =>
												handleRejectMarket(
													market.marketId
												)
											}
											className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all"
										>
											Reject Market
										</motion.button>
									</div>
								)}
							</motion.div>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
