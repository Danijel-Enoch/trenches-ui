"use client";

import { Navbar } from "@/components/navbar";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWriteContract, useAccount } from "wagmi";
import { useTransactionSimulation } from "@/lib/hooks/useTransactionSimulation";
import { TransactionSimulationUI } from "@/components/TransactionSimulationUI";
import { PredictionMarket, PredictionMarketAbi } from "@/lib/contracts";
import { parseEther } from "viem";
import { useRouter } from "next/navigation";
import { TokenDetails } from "@/lib/types";
import { isValidAddress } from "@/lib/utils";

export default function CreateMarket() {
	const [tokenAddress, setTokenAddress] = useState("");
	const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);
	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState("");
	const [isCreating, setIsCreating] = useState(false);
	const { address } = useAccount();
	const { writeContract } = useWriteContract();
	const router = useRouter();
	const { simulate, simulationResult, isSimulating, clearSimulation } =
		useTransactionSimulation();
	const [isProcessingTransaction, setIsProcessingTransaction] =
		useState(false);

	const handleSearch = async () => {
		if (!tokenAddress.trim()) {
			setSearchError("Please enter a token address");
			return;
		}

		if (!isValidAddress(tokenAddress.trim())) {
			setSearchError(
				"Please enter a valid token contract address (0x...)"
			);
			return;
		}

		setIsSearching(true);
		setSearchError("");
		setTokenDetails(null);

		try {
			const response = await fetch(
				`/api/search?q=${encodeURIComponent(tokenAddress.trim())}`
			);
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to search token");
			}

			if (data.data && data.data.length > 0) {
				setTokenDetails(data.data[0]); // Take the first result
			} else {
				setSearchError("Token not found or not supported");
			}
		} catch (error) {
			console.error("Search error:", error);
			setSearchError(
				error instanceof Error
					? error.message
					: "Failed to search token"
			);
		} finally {
			setIsSearching(false);
		}
	};

	const handleCreate = async () => {
		if (!tokenAddress || !address || !tokenDetails) return;

		setIsCreating(true);

		// First simulate the transaction
		await simulate({
			type: "createMarket",
			tokenAddress,
			initialPrice: BigInt(tokenDetails.priceFormatted)
		});

		setIsCreating(false);
	};

	const executeCreateTransaction = async () => {
		if (!tokenAddress || !address || !tokenDetails) return;

		setIsProcessingTransaction(true);
		try {
			await writeContract({
				address: PredictionMarket as `0x${string}`,
				abi: PredictionMarketAbi,
				functionName: "createMarket",
				args: [tokenAddress, BigInt(tokenDetails.priceFormatted)],
				value: parseEther("0.01") // Creation fee
			});

			// Reset form
			setTokenAddress("");
			setTokenDetails(null);
			setSearchError("");
			clearSimulation();

			// Show success message instead of redirect
			alert(
				"Market created successfully! It will be available after admin approval."
			);
		} catch (error) {
			console.error("Error creating market:", error);
		} finally {
			setIsProcessingTransaction(false);
		}
	};

	return (
		<>
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
							Create a market for any token by searching with its
							contract address
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
									Token Address
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										value={tokenAddress}
										onChange={(e) => {
											setTokenAddress(e.target.value);
											setTokenDetails(null);
											setSearchError("");
										}}
										placeholder="0x..."
										className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
									/>
									<button
										onClick={handleSearch}
										disabled={
											isSearching || !tokenAddress.trim()
										}
										className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
									>
										{isSearching
											? "Searching..."
											: "Search"}
									</button>
								</div>
								<p className="mt-2 text-xs text-zinc-500">
									Enter the token contract address (only
									addresses are supported)
								</p>
								{searchError && (
									<p className="mt-2 text-sm text-red-400">
										{searchError}
									</p>
								)}
							</div>

							{tokenDetails && (
								<div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
									<h3 className="font-semibold mb-3 text-green-400 flex items-center gap-2">
										<span className="w-2 h-2 bg-green-500 rounded-full"></span>
										Token Found
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
										<div className="flex items-center gap-3">
											{tokenDetails.logo && (
												<img
													src={tokenDetails.logo}
													alt={tokenDetails.symbol}
													className="w-8 h-8 rounded-full"
												/>
											)}
											<div>
												<p className="font-medium text-white">
													{tokenDetails.name} (
													{tokenDetails.symbol})
												</p>
												<p className="text-zinc-400 text-xs">
													{tokenDetails.address.slice(
														0,
														10
													)}
													...
													{tokenDetails.address.slice(
														-8
													)}
												</p>
											</div>
										</div>
										<div className="space-y-1">
											<p className="text-zinc-300">
												<span className="text-zinc-500">
													Price:
												</span>{" "}
												$
												{parseFloat(
													tokenDetails.price
												).toFixed(6)}
											</p>
											<p className="text-zinc-300">
												<span className="text-zinc-500">
													Market Cap:
												</span>{" "}
												$
												{parseFloat(
													tokenDetails.marketCap
												).toLocaleString()}
											</p>
											<p className="text-zinc-300">
												<span className="text-zinc-500">
													Liquidity:
												</span>{" "}
												$
												{parseFloat(
													tokenDetails.liquidity
												).toLocaleString()}
											</p>
											<p className="text-zinc-300">
												<span className="text-zinc-500">
													Chains:
												</span>{" "}
												{tokenDetails.chains.join(", ")}
											</p>
										</div>
									</div>
								</div>
							)}

							<div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
								<h3 className="font-semibold mb-2 text-purple-400">
									Market Rules
								</h3>
								<ul className="space-y-2 text-sm text-zinc-300">
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											Markets require admin approval
											before going live
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											Admin may adjust initial price
											during approval process
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											Markets settle at midnight (00:00
											UTC)
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
											DOWN wins if final price {"<"}{" "}
											initial price
										</span>
									</li>
									<li className="flex items-start">
										<span className="mr-2">•</span>
										<span>
											Winners can sell outcome tokens,
											losers cannot
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
									disabled={!tokenDetails || isCreating}
									className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isCreating
										? "Creating Market..."
										: tokenDetails
										? `Create Market for ${tokenDetails.symbol}`
										: "Search for Token First"}
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

			{/* Transaction Simulation UI */}
			<TransactionSimulationUI
				simulationResult={simulationResult}
				isSimulating={isSimulating}
				transactionType="Create Market"
				onConfirm={executeCreateTransaction}
				onCancel={clearSimulation}
				isProcessing={isProcessingTransaction}
			/>
		</>
	);
}
