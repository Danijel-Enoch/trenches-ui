"use client";

import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWriteContract, useAccount } from "wagmi";
import { PredictionMarket, PredictionMarketAbi } from "@/lib/contracts";
import { parseEther } from "viem";
import { useRouter } from "next/navigation";

export default function CreateMarket() {
	const [tokenAddress, setTokenAddress] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const { address } = useAccount();
	const { writeContract } = useWriteContract();
	const router = useRouter();

	const handleCreate = async () => {
		if (!tokenAddress || !address) return;

		setIsCreating(true);
		try {
			await writeContract({
				address: PredictionMarket as `0x${string}`,
				abi: PredictionMarketAbi,
				functionName: "createMarket",
				args: [tokenAddress, parseEther("0.1")],
				value: parseEther("0.01") // Creation fee
			});

			// Reset form
			setTokenAddress("");

			// Show success message instead of redirect
			alert(
				"Market created successfully! It will be available after admin approval."
			);
		} catch (error) {
			console.error("Error creating market:", error);
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
			<Navbar />

			<main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-8"
				>
					<h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
						Create Prediction Market
					</h1>
					<p className="text-zinc-400">
						Create a market for any token on DexScreener
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-8 border border-zinc-700"
				>
					<div className="space-y-6">
						<div>
							<label className="block text-sm font-medium mb-2 text-zinc-300">
								Token Address / Symbol
							</label>
							<input
								type="text"
								value={tokenAddress}
								onChange={(e) =>
									setTokenAddress(e.target.value)
								}
								placeholder="e.g., 0x... or PEPE/USDT"
								className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
							/>
							<p className="mt-2 text-xs text-zinc-500">
								Enter the token contract address or trading pair
								from DexScreener
							</p>
						</div>

						<div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
							<h3 className="font-semibold mb-2 text-purple-400">
								Market Rules
							</h3>
							<ul className="space-y-2 text-sm text-zinc-300">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>
										Markets require admin approval before
										going live
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>
										Admin may adjust initial price during
										approval process
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>
										Markets settle at midnight (00:00 UTC)
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>
										UP wins if final price {">"} initial
										price
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>
										DOWN wins if final price {"<"} initial
										price
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>
										Winners can sell outcome tokens, losers
										cannot
									</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>Creation fee: 0.01 ETH</span>
								</li>
							</ul>
						</div>

						{!address ? (
							<div className="text-center py-4 px-6 bg-zinc-800 rounded-lg border border-zinc-700">
								<p className="text-zinc-400">
									Connect your wallet to create a market
								</p>
							</div>
						) : (
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={handleCreate}
								disabled={!tokenAddress || isCreating}
								className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isCreating
									? "Creating Market..."
									: "Create Market"}
							</motion.button>
						)}
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="mt-8 text-center text-sm text-zinc-500"
				>
					<p>
						Markets are automatically settled by keeper bots at
						midnight
					</p>
				</motion.div>
			</main>
		</div>
	);
}
