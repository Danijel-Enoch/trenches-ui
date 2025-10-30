import React from "react";
import {
	useMarketCreateds,
	useMarketSettleds,
	useFeesPaids,
	useMarketStats
} from "@/lib/hooks";

// Component to display recent markets
export function RecentMarkets() {
	const {
		data: markets,
		loading,
		error,
		refetch
	} = useMarketCreateds({
		first: 10,
		orderBy: "blockTimestamp",
		orderDirection: "desc"
	});

	if (loading)
		return <div className="animate-pulse">Loading recent markets...</div>;
	if (error) return <div className="text-red-500">Error: {error}</div>;

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold">Recent Markets</h2>
				<button
					onClick={refetch}
					className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
				>
					Refresh
				</button>
			</div>
			<div className="space-y-2">
				{markets.map((market) => (
					<div
						key={market.id}
						className="border rounded-lg p-4 bg-white shadow-sm"
					>
						<div className="flex justify-between items-start">
							<div>
								<h3 className="font-semibold">
									Market #{market.marketId}
								</h3>
								<p className="text-sm text-gray-600">
									Token: {market.tokenAddress}
								</p>
								<p className="text-sm text-gray-600">
									Creator: {market.creator}
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm">
									Initial Price: {market.initialPrice}
								</p>
								<p className="text-xs text-gray-500">
									{new Date(
										parseInt(market.blockTimestamp) * 1000
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Component to display settled markets
export function SettledMarkets() {
	const {
		data: settled,
		loading,
		error
	} = useMarketSettleds({
		first: 10,
		orderBy: "blockTimestamp",
		orderDirection: "desc"
	});

	if (loading)
		return <div className="animate-pulse">Loading settled markets...</div>;
	if (error) return <div className="text-red-500">Error: {error}</div>;

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Recently Settled Markets</h2>
			<div className="space-y-2">
				{settled.map((market) => (
					<div
						key={market.id}
						className="border rounded-lg p-4 bg-gray-50 shadow-sm"
					>
						<div className="flex justify-between items-start">
							<div>
								<h3 className="font-semibold">
									Market #{market.marketId}
								</h3>
								<p className="text-sm text-gray-600">
									Final Price: {market.finalPrice}
								</p>
								<p className="text-sm text-gray-600">
									Winning Outcome:{" "}
									{market.winningOutcome === "0"
										? "UP"
										: "DOWN"}
								</p>
							</div>
							<div className="text-right">
								<p className="text-xs text-gray-500">
									Settled:{" "}
									{new Date(
										parseInt(market.blockTimestamp) * 1000
									).toLocaleDateString()}
								</p>
								<a
									href={`https://etherscan.io/tx/${market.transactionHash}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xs text-blue-500 hover:underline"
								>
									View Transaction
								</a>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Component to display fee information
export function FeesOverview() {
	const {
		data: fees,
		loading,
		error
	} = useFeesPaids({
		first: 20,
		orderBy: "blockTimestamp",
		orderDirection: "desc"
	});

	if (loading)
		return <div className="animate-pulse">Loading fees data...</div>;
	if (error) return <div className="text-red-500">Error: {error}</div>;

	const totalCreatorFees = fees.reduce(
		(sum, fee) => sum + BigInt(fee.creatorFee),
		BigInt(0)
	);
	const totalPlatformFees = fees.reduce(
		(sum, fee) => sum + BigInt(fee.platformFee),
		BigInt(0)
	);

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Fees Overview</h2>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
					<h3 className="font-semibold text-blue-800">
						Total Transactions
					</h3>
					<p className="text-2xl font-bold text-blue-900">
						{fees.length}
					</p>
				</div>
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<h3 className="font-semibold text-green-800">
						Creator Fees
					</h3>
					<p className="text-2xl font-bold text-green-900">
						{totalCreatorFees.toString()}
					</p>
				</div>
				<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
					<h3 className="font-semibold text-purple-800">
						Platform Fees
					</h3>
					<p className="text-2xl font-bold text-purple-900">
						{totalPlatformFees.toString()}
					</p>
				</div>
			</div>

			{/* Recent Fees */}
			<div className="space-y-2">
				<h3 className="font-semibold">Recent Fee Payments</h3>
				{fees.slice(0, 10).map((fee) => (
					<div
						key={fee.id}
						className="border rounded-lg p-3 bg-white shadow-sm"
					>
						<div className="flex justify-between items-start">
							<div>
								<p className="font-semibold">
									Market #{fee.marketId}
								</p>
								<p className="text-sm text-gray-600">
									Creator: {fee.creator}
								</p>
							</div>
							<div className="text-right">
								<p className="text-sm">
									Creator Fee: {fee.creatorFee}
								</p>
								<p className="text-sm">
									Platform Fee: {fee.platformFee}
								</p>
								<p className="text-xs text-gray-500">
									{new Date(
										parseInt(fee.blockTimestamp) * 1000
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// Component to display overall market statistics
export function MarketStats() {
	const { stats, loading } = useMarketStats();

	if (loading)
		return <div className="animate-pulse">Loading statistics...</div>;

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-bold">Market Statistics</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
					<h3 className="font-semibold text-blue-800">
						Total Markets
					</h3>
					<p className="text-3xl font-bold text-blue-900">
						{stats.totalMarkets}
					</p>
				</div>
				<div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
					<h3 className="font-semibold text-green-800">
						Settled Markets
					</h3>
					<p className="text-3xl font-bold text-green-900">
						{stats.settledMarkets}
					</p>
				</div>
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
					<h3 className="font-semibold text-yellow-800">
						Active Markets
					</h3>
					<p className="text-3xl font-bold text-yellow-900">
						{stats.activeMarkets}
					</p>
				</div>
				<div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
					<h3 className="font-semibold text-purple-800">
						Total Volume
					</h3>
					<p className="text-xl font-bold text-purple-900">
						{stats.totalVolume.toString()}
					</p>
				</div>
			</div>
		</div>
	);
}

// Main dashboard component combining all subgraph data
export function SubgraphDashboard() {
	return (
		<div className="max-w-7xl mx-auto p-6 space-y-8">
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					Trenches Market Dashboard
				</h1>
				<p className="text-gray-600 mt-2">
					Real-time data from The Graph subgraph
				</p>
			</div>

			<MarketStats />

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<RecentMarkets />
				<SettledMarkets />
			</div>

			<FeesOverview />
		</div>
	);
}
