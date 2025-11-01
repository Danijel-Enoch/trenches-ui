"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTransactionSimulation } from "@/lib/hooks/useTransactionSimulation";
import { TransactionSimulationUI } from "@/components/TransactionSimulationUI";
import { parseEther } from "viem";

export default function SimulationDemo() {
	const [ethAmount, setEthAmount] = useState("");
	const [selectedOutcome, setSelectedOutcome] = useState(0);
	const [isProcessingTransaction, setIsProcessingTransaction] =
		useState(false);
	const { simulate, simulationResult, isSimulating, clearSimulation } =
		useTransactionSimulation();

	const handleSimulateBuy = async () => {
		if (!ethAmount || parseFloat(ethAmount) <= 0) return;

		await simulate({
			type: "buyShares",
			marketId: BigInt(1), // Demo market ID
			outcome: selectedOutcome,
			ethAmount
		});
	};

	const handleSimulateCreate = async () => {
		await simulate({
			type: "createMarket",
			tokenAddress: "0x1234567890123456789012345678901234567890",
			initialPrice: parseEther("1000") // $1000 initial price
		});
	};

	const executeTransaction = () => {
		setIsProcessingTransaction(true);
		// Simulate transaction execution
		setTimeout(() => {
			setIsProcessingTransaction(false);
			clearSimulation();
			alert("Transaction executed successfully!");
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black p-8">
			<div className="max-w-2xl mx-auto">
				<h1 className="text-3xl font-bold text-white mb-8 text-center">
					Transaction Simulation Demo
				</h1>

				<div className="space-y-6">
					{/* Buy Shares Simulation */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-zinc-800 rounded-xl p-6 border border-zinc-700"
					>
						<h2 className="text-xl font-semibold text-white mb-4">
							Simulate Buy Shares
						</h2>

						<div className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-zinc-400 mb-2">
									ETH Amount
								</label>
								<input
									type="number"
									step="0.01"
									value={ethAmount}
									onChange={(e) =>
										setEthAmount(e.target.value)
									}
									placeholder="0.1"
									className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-purple-500 focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-zinc-400 mb-2">
									Outcome
								</label>
								<select
									value={selectedOutcome}
									onChange={(e) =>
										setSelectedOutcome(
											parseInt(e.target.value)
										)
									}
									className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
								>
									<option value={0}>
										PUMP (0-50% increase)
									</option>
									<option value={1}>
										DUMP (0-50% decrease)
									</option>
									<option value={2}>NO_CHANGE (±10%)</option>
									<option value={3}>
										RUG (&gt;50% decrease)
									</option>
									<option value={4}>
										MOON (&gt;50% increase)
									</option>
								</select>
							</div>

							<button
								onClick={handleSimulateBuy}
								disabled={
									!ethAmount || parseFloat(ethAmount) <= 0
								}
								className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Simulate Buy Transaction
							</button>
						</div>
					</motion.div>

					{/* Create Market Simulation */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-zinc-800 rounded-xl p-6 border border-zinc-700"
					>
						<h2 className="text-xl font-semibold text-white mb-4">
							Simulate Create Market
						</h2>

						<button
							onClick={handleSimulateCreate}
							className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-semibold text-white hover:from-green-700 hover:to-emerald-700 transition-all"
						>
							Simulate Create Market Transaction
						</button>
					</motion.div>

					{/* Info Box */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-zinc-800 rounded-xl p-6 border border-zinc-700"
					>
						<h3 className="text-lg font-semibold text-white mb-2">
							How Transaction Simulation Works
						</h3>
						<div className="text-zinc-400 space-y-2 text-sm">
							<p>
								• <strong>Pre-transaction Analysis:</strong>{" "}
								Simulates the transaction before execution
							</p>
							<p>
								• <strong>Gas Estimation:</strong> Shows
								estimated gas costs
							</p>
							<p>
								• <strong>Price Impact:</strong> Calculates how
								your trade affects market prices
							</p>
							<p>
								• <strong>Fee Breakdown:</strong> Shows all
								trading fees
							</p>
							<p>
								• <strong>Expected Returns:</strong> Estimates
								shares received or ETH returned
							</p>
							<p>
								• <strong>Failure Detection:</strong> Warns if
								the transaction would fail
							</p>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Transaction Simulation UI */}
			<TransactionSimulationUI
				simulationResult={simulationResult}
				isSimulating={isSimulating}
				transactionType="Demo Transaction"
				onConfirm={executeTransaction}
				onCancel={clearSimulation}
				isProcessing={isProcessingTransaction}
			/>
		</div>
	);
}
