"use client";

import { Market, Outcome } from "@/lib/types";
import { motion } from "framer-motion";
import { formatEther, parseEther } from "viem";
import { useState, useEffect } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { useTransactionSimulation } from "@/lib/hooks/useTransactionSimulation";
import { TransactionSimulationUI } from "./TransactionSimulationUI";
import { PredictionMarket, PredictionMarketAbi } from "@/lib/contracts";
import { getTokenInfo, formatSettlementTime } from "@/lib/utils";

interface MarketCardProps {
	market: Market;
	marketId: bigint;
}

export function MarketCard({ market, marketId }: MarketCardProps) {
	const [ethAmount, setEthAmount] = useState("");
	const [selectedOutcome, setSelectedOutcome] = useState<Outcome>(
		Outcome.PUMP
	);
	const [tokenInfo, setTokenInfo] = useState<{
		symbol: string;
		name: string;
	} | null>(null);
	const [estimatedShares, setEstimatedShares] = useState<bigint | null>(null);
	const { address } = useAccount();
	const { writeContract } = useWriteContract();
	const { simulate, simulationResult, isSimulating, clearSimulation } =
		useTransactionSimulation();
	const [isProcessingTransaction, setIsProcessingTransaction] =
		useState(false);

	// Fetch token information
	useEffect(() => {
		async function fetchTokenInfo() {
			if (!market.tokenSymbol || !market.tokenName) {
				const info = await getTokenInfo(market.tokenAddress);
				setTokenInfo(info);
			} else {
				setTokenInfo({
					symbol: market.tokenSymbol,
					name: market.tokenName
				});
			}
		}
		fetchTokenInfo();
	}, [market.tokenAddress, market.tokenSymbol, market.tokenName]);

	// Get stats for all outcomes
	const { data: pumpStats } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "getOutcomeStats",
		args: [marketId, Outcome.PUMP]
	});

	const { data: dumpStats } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "getOutcomeStats",
		args: [marketId, Outcome.DUMP]
	});

	const { data: noChangeStats } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "getOutcomeStats",
		args: [marketId, Outcome.NO_CHANGE]
	});

	const { data: rugStats } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "getOutcomeStats",
		args: [marketId, Outcome.RUG]
	});

	const { data: moonStats } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "getOutcomeStats",
		args: [marketId, Outcome.MOON]
	});

	// Helper function to estimate shares from ETH amount
	// Using a simple linear approximation based on typical prediction market pricing
	const estimateSharesFromEth = async (
		ethAmountStr: string
	): Promise<bigint | null> => {
		if (!ethAmountStr || parseFloat(ethAmountStr) <= 0) return null;

		try {
			const ethAmount = parseFloat(ethAmountStr);

			// Simple estimation: in prediction markets, shares typically cost between 0.01-0.1 ETH each
			// depending on the current probability. We'll use a base rate and adjust based on total shares
			const totalSharesForOutcome =
				outcomes.find((o) => o.type === selectedOutcome)?.shares ||
				BigInt(0);
			const allTotalShares = outcomes.reduce(
				(sum, o) => sum + o.shares,
				BigInt(0)
			);

			// Calculate current implied probability (if any shares exist)
			let basePrice = 0.05; // Default 0.05 ETH per share
			if (allTotalShares > BigInt(0)) {
				const probability =
					Number(totalSharesForOutcome) / Number(allTotalShares);
				// Price increases with probability (but caps at reasonable levels)
				basePrice = Math.max(
					0.01,
					Math.min(0.15, probability * 0.2 + 0.02)
				);
			}

			// Estimate shares = ETH amount / estimated price per share
			const estimatedShares = ethAmount / basePrice;

			return parseEther(estimatedShares.toFixed(6));
		} catch (error) {
			console.error("Error estimating shares:", error);
			return null;
		}
	};

	// Update estimated shares when ETH amount changes
	useEffect(() => {
		const updateEstimate = async () => {
			if (ethAmount) {
				const shares = await estimateSharesFromEth(ethAmount);
				setEstimatedShares(shares);
			} else {
				setEstimatedShares(null);
			}
		};
		updateEstimate();
	}, [ethAmount, selectedOutcome]);

	// Calculate actual cost for the estimated shares
	const { data: actualCost } = useReadContract({
		address: PredictionMarket as `0x${string}`,
		abi: PredictionMarketAbi,
		functionName: "calculateBuyCost",
		args: estimatedShares
			? [marketId, selectedOutcome, estimatedShares]
			: undefined,
		query: { enabled: !!estimatedShares && estimatedShares > BigInt(0) }
	});

	// Calculate shares and percentages for all outcomes
	const pumpShares = pumpStats ? pumpStats[0] : BigInt(0);
	const dumpShares = dumpStats ? dumpStats[0] : BigInt(0);
	const noChangeShares = noChangeStats ? noChangeStats[0] : BigInt(0);
	const rugShares = rugStats ? rugStats[0] : BigInt(0);
	const moonShares = moonStats ? moonStats[0] : BigInt(0);

	const totalShares =
		pumpShares + dumpShares + noChangeShares + rugShares + moonShares;

	const outcomes = [
		{
			type: Outcome.MOON,
			label: "🚀 MOON",
			shortLabel: "🚀",
			description: ">50% up",
			shares: moonShares,
			color: "from-yellow-400 to-orange-500",
			hoverColor: "hover:from-yellow-500 hover:to-orange-600"
		},
		{
			type: Outcome.PUMP,
			label: "📈 PUMP",
			shortLabel: "📈",
			description: "10-50% up",
			shares: pumpShares,
			color: "from-green-400 to-green-600",
			hoverColor: "hover:from-green-500 hover:to-green-700"
		},
		{
			type: Outcome.NO_CHANGE,
			label: "😐 STABLE",
			shortLabel: "😐",
			description: "±10%",
			shares: noChangeShares,
			color: "from-blue-400 to-blue-600",
			hoverColor: "hover:from-blue-500 hover:to-blue-700"
		},
		{
			type: Outcome.DUMP,
			label: "📉 DUMP",
			shortLabel: "📉",
			description: "10-50% down",
			shares: dumpShares,
			color: "from-red-400 to-red-600",
			hoverColor: "hover:from-red-500 hover:to-red-700"
		},
		{
			type: Outcome.RUG,
			label: "💀 RUG",
			shortLabel: "💀",
			description: ">50% down",
			shares: rugShares,
			color: "from-purple-400 to-purple-600",
			hoverColor: "hover:from-purple-500 hover:to-purple-700"
		}
	];

	const getOutcomePercentage = (shares: bigint) => {
		return totalShares > BigInt(0)
			? Number((shares * BigInt(100)) / totalShares)
			: 20;
	};

	const handleBuy = async () => {
		if (!ethAmount || parseFloat(ethAmount) <= 0 || !estimatedShares)
			return;

		// First simulate the transaction
		await simulate({
			type: "buyShares",
			marketId,
			outcome: selectedOutcome,
			ethAmount
		});
	};

	const executeBuyTransaction = async () => {
		if (!ethAmount || parseFloat(ethAmount) <= 0 || !estimatedShares)
			return;

		setIsProcessingTransaction(true);
		try {
			await writeContract({
				address: PredictionMarket as `0x${string}`,
				abi: PredictionMarketAbi,
				functionName: "buyShares",
				args: [marketId, selectedOutcome, estimatedShares],
				value: parseEther(ethAmount)
			});
			setEthAmount("");
			clearSimulation();
		} catch (error) {
			console.error("Error buying shares:", error);
		} finally {
			setIsProcessingTransaction(false);
		}
	};

	const isSettled = market.settled;
	const timeUntilSettlement =
		Number(market.settlementTime) * 1000 - Date.now();
	const hoursRemaining = Math.max(
		0,
		Math.floor(timeUntilSettlement / (1000 * 60 * 60))
	);

	const displaySymbol = tokenInfo?.symbol || "TOKEN";
	const displayName =
		tokenInfo?.name || market.tokenAddress.slice(0, 8) + "...";

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				whileHover={{ scale: 1.01 }}
				className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-4 sm:p-6 border border-zinc-700 hover:border-purple-500 transition-all min-w-0 w-full"
			>
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
					<div className="flex-1">
						<h3 className="text-lg sm:text-xl font-bold mb-1 break-words">
							What will happen to {displaySymbol} by{" "}
							{formatSettlementTime(market.settlementTime)}?
						</h3>
						<p className="text-xs sm:text-sm text-zinc-400 break-all">
							{displayName} • ${formatEther(market.initialPrice)}
						</p>
					</div>
					<div className="text-left sm:text-right shrink-0">
						{isSettled ? (
							<span className="px-2 sm:px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
								Settled
							</span>
						) : (
							<span className="px-2 sm:px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
								{hoursRemaining}h left
							</span>
						)}
					</div>
				</div>

				{/* Outcomes Distribution */}
				<div className="mb-6">
					<div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-3">
						{outcomes.map((outcome) => {
							const percentage = getOutcomePercentage(
								outcome.shares
							);
							return (
								<div key={outcome.type} className="text-center">
									<div className="text-xs font-medium text-zinc-400 mb-1">
										<span className="sm:hidden">
											{outcome.shortLabel}
										</span>
										<span className="hidden sm:inline truncate">
											{outcome.label}
										</span>
									</div>
									<div className="text-sm font-bold">
										{percentage.toFixed(1)}%
									</div>
									<div className="text-xs text-zinc-500 hidden md:block">
										{outcome.description}
									</div>
								</div>
							);
						})}
					</div>

					{/* Visual Distribution Bar */}
					<div className="h-3 bg-zinc-700 rounded-full overflow-hidden flex">
						{outcomes.map((outcome) => {
							const percentage = getOutcomePercentage(
								outcome.shares
							);
							return (
								<motion.div
									key={outcome.type}
									initial={{ width: 0 }}
									animate={{ width: `${percentage}%` }}
									transition={{
										duration: 0.5,
										ease: "easeOut"
									}}
									className={`bg-gradient-to-r ${outcome.color}`}
								/>
							);
						})}
					</div>

					<div className="text-center mt-2 text-xs text-zinc-500">
						Total: {formatEther(totalShares)} shares
					</div>
				</div>

				{/* Trading Interface */}
				{!isSettled && address && (
					<div className="space-y-3">
						{/* Outcome Selection Grid */}
						<div className="grid grid-cols-3 md:grid-cols-5 gap-2">
							{outcomes.map((outcome) => (
								<button
									key={outcome.type}
									onClick={() =>
										setSelectedOutcome(outcome.type)
									}
									className={`p-2 md:p-3 rounded-lg font-medium transition-all text-xs min-h-[60px] md:min-h-[70px] ${
										selectedOutcome === outcome.type
											? `bg-gradient-to-r ${outcome.color} text-white shadow-lg scale-105`
											: `bg-zinc-700 text-zinc-300 ${outcome.hoverColor}`
									}`}
								>
									<div className="font-bold text-xs md:text-sm">
										<span className="sm:hidden">
											{outcome.shortLabel}
										</span>
										<span className="hidden sm:inline">
											{outcome.label}
										</span>
									</div>
									<div className="text-xs opacity-75 hidden sm:block mt-1">
										{outcome.description}
									</div>
								</button>
							))}
						</div>

						{/* ETH Amount Input */}
						<div className="space-y-2">
							<label className="text-sm text-zinc-400">
								Amount to spend (ETH)
							</label>
							<div className="flex gap-2">
								<input
									type="number"
									placeholder="0.1"
									value={ethAmount}
									onChange={(e) =>
										setEthAmount(e.target.value)
									}
									className="flex-1 px-3 sm:px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
									step="0.001"
									min="0"
								/>
								<button
									onClick={() => setEthAmount("0.01")}
									className="px-2 sm:px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-all whitespace-nowrap"
								>
									0.01
								</button>
								<button
									onClick={() => setEthAmount("0.1")}
									className="px-2 sm:px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-all whitespace-nowrap"
								>
									0.1
								</button>
								<button
									onClick={() => setEthAmount("0.5")}
									className="px-2 sm:px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs transition-all whitespace-nowrap"
								>
									0.5
								</button>
							</div>
						</div>

						{/* Shares and Cost Display */}
						{estimatedShares && (
							<div className="space-y-2 text-sm bg-zinc-800/50 p-3 rounded-lg">
								<div className="flex justify-between items-center">
									<span className="text-zinc-400">
										Est. Shares:
									</span>
									<span className="font-semibold">
										{formatEther(estimatedShares)}
									</span>
								</div>
								{actualCost && (
									<div className="flex justify-between items-center">
										<span className="text-zinc-400">
											Actual Cost:
										</span>
										<span className="font-semibold text-purple-400">
											{formatEther(actualCost)} ETH
										</span>
									</div>
								)}
								<div className="text-xs text-zinc-500 text-center">
									Final cost may vary based on market
									conditions
								</div>
							</div>
						)}

						{/* Buy Button */}
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleBuy}
							disabled={
								!ethAmount ||
								parseFloat(ethAmount) <= 0 ||
								!estimatedShares
							}
							className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
						>
							{ethAmount
								? `Buy ${
										outcomes.find(
											(o) => o.type === selectedOutcome
										)?.label || "Position"
								  } for ${ethAmount} ETH`
								: `Select ${
										outcomes.find(
											(o) => o.type === selectedOutcome
										)?.label || "Position"
								  }`}
						</motion.button>
					</div>
				)}

				{/* Settlement Result */}
				{isSettled && market.finalPrice && (
					<div className="mt-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm text-zinc-400">
									Final Price
								</p>
								<p className="text-lg font-bold">
									${formatEther(market.finalPrice)}
								</p>
							</div>
							{market.winningOutcome !== undefined && (
								<div className="text-right">
									<p className="text-sm text-zinc-400">
										Winner
									</p>
									<p className="text-lg font-bold text-green-400">
										{outcomes.find(
											(o) =>
												o.type === market.winningOutcome
										)?.label || "Unknown"}
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</motion.div>

			{/* Transaction Simulation UI */}
			<TransactionSimulationUI
				simulationResult={simulationResult}
				isSimulating={isSimulating}
				transactionType="Buy Shares"
				onConfirm={executeBuyTransaction}
				onCancel={clearSimulation}
				isProcessing={isProcessingTransaction}
			/>
		</>
	);
}
