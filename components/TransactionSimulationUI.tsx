import { motion, AnimatePresence } from "framer-motion";
import { SimulationResult } from "@/lib/simulation";

interface TransactionSimulationUIProps {
	simulationResult: SimulationResult | null;
	isSimulating: boolean;
	transactionType: string;
	onConfirm: () => void;
	onCancel: () => void;
	isProcessing: boolean;
}

export function TransactionSimulationUI({
	simulationResult,
	isSimulating,
	transactionType,
	onConfirm,
	onCancel,
	isProcessing
}: TransactionSimulationUIProps) {
	if (!simulationResult && !isSimulating) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
			>
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.9, opacity: 0 }}
					className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full"
				>
					<div className="mb-4">
						<h3 className="text-xl font-semibold mb-2">
							Transaction Preview
						</h3>
						<p className="text-zinc-400 text-sm">
							Review the estimated results before confirming your{" "}
							{transactionType}
						</p>
					</div>

					{isSimulating ? (
						<div className="py-8 text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto mb-4"></div>
							<p className="text-zinc-400">
								Simulating transaction...
							</p>
						</div>
					) : simulationResult ? (
						<div className="space-y-4">
							{!simulationResult.success ? (
								<div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
									<div className="flex items-center mb-2">
										<span className="text-red-400 text-lg mr-2">
											⚠️
										</span>
										<span className="font-medium text-red-400">
											Transaction Will Fail
										</span>
									</div>
									<p className="text-red-300 text-sm">
										{simulationResult.error}
									</p>
								</div>
							) : (
								<div className="space-y-3">
									<div className="bg-green-900/20 border border-green-700 rounded-lg p-3">
										<div className="flex items-center">
											<span className="text-green-400 text-lg mr-2">
												✅
											</span>
											<span className="font-medium text-green-400">
												Transaction Will Succeed
											</span>
										</div>
									</div>

									{/* Estimated Gas */}
									{simulationResult.estimatedGas && (
										<div className="flex justify-between items-center py-2 border-b border-zinc-700">
											<span className="text-zinc-400">
												Estimated Gas
											</span>
											<span className="text-white">
												{simulationResult.estimatedGas.toString()}
											</span>
										</div>
									)}

									{/* Expected Return */}
									{simulationResult.expectedReturn && (
										<div className="flex justify-between items-center py-2 border-b border-zinc-700">
											<span className="text-zinc-400">
												Expected Return
											</span>
											<span className="text-green-400 font-medium">
												{parseFloat(
													simulationResult.expectedReturn
												).toFixed(6)}{" "}
												ETH
											</span>
										</div>
									)}

									{/* Shares Received */}
									{simulationResult.sharesReceived && (
										<div className="flex justify-between items-center py-2 border-b border-zinc-700">
											<span className="text-zinc-400">
												Shares Received
											</span>
											<span className="text-blue-400 font-medium">
												{parseFloat(
													simulationResult.sharesReceived
												).toFixed(6)}
											</span>
										</div>
									)}

									{/* Fees */}
									{simulationResult.fees && (
										<div className="flex justify-between items-center py-2 border-b border-zinc-700">
											<span className="text-zinc-400">
												Trading Fees
											</span>
											<span className="text-orange-400">
												{parseFloat(
													simulationResult.fees
												).toFixed(6)}{" "}
												ETH
											</span>
										</div>
									)}

									{/* Price Impact */}
									{simulationResult.priceImpact && (
										<div className="flex justify-between items-center py-2 border-b border-zinc-700">
											<span className="text-zinc-400">
												Price Impact
											</span>
											<span
												className={`${
													parseFloat(
														simulationResult.priceImpact
													) > 5
														? "text-red-400"
														: parseFloat(
																simulationResult.priceImpact
														  ) > 2
														? "text-yellow-400"
														: "text-green-400"
												}`}
											>
												{simulationResult.priceImpact}
											</span>
										</div>
									)}

									{/* New Share Price */}
									{simulationResult.newSharePrice && (
										<div className="flex justify-between items-center py-2">
											<span className="text-zinc-400">
												New Share Price
											</span>
											<span className="text-white">
												{parseFloat(
													simulationResult.newSharePrice
												).toFixed(6)}{" "}
												ETH
											</span>
										</div>
									)}
								</div>
							)}

							{/* Action Buttons */}
							<div className="flex gap-3 pt-4">
								<button
									onClick={onCancel}
									className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
									disabled={isProcessing}
								>
									Cancel
								</button>
								<button
									onClick={onConfirm}
									disabled={
										!simulationResult.success ||
										isProcessing
									}
									className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
										simulationResult.success &&
										!isProcessing
											? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
											: "bg-zinc-600 cursor-not-allowed opacity-50"
									}`}
								>
									{isProcessing ? (
										<div className="flex items-center justify-center">
											<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
											Processing...
										</div>
									) : (
										`Confirm ${transactionType}`
									)}
								</button>
							</div>
						</div>
					) : null}
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}
