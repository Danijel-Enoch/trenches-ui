import { useState, useEffect } from "react";
import {
	MarketCreated,
	MarketSettled,
	FeePaid,
	getMarketCreateds,
	getMarketSettleds,
	getFeesPaids,
	getMarketById,
	getMarketsByCreator
} from "./graphql";

// Hook for fetching market created events
export function useMarketCreateds(options?: {
	first?: number;
	skip?: number;
	orderBy?: string;
	orderDirection?: string;
	autoRefresh?: boolean;
	refreshInterval?: number;
}) {
	const [data, setData] = useState<MarketCreated[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);
				const response = await getMarketCreateds(options);
				setData(response.marketCreateds);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch markets"
				);
			} finally {
				setLoading(false);
			}
		}

		fetchData();

		// Auto-refresh functionality
		if (options?.autoRefresh && options?.refreshInterval) {
			const interval = setInterval(fetchData, options.refreshInterval);
			return () => clearInterval(interval);
		}
	}, [
		options?.first,
		options?.skip,
		options?.orderBy,
		options?.orderDirection
	]);

	const refetch = () => {
		setLoading(true);
		setError(null);
		getMarketCreateds(options)
			.then((response) => {
				setData(response.marketCreateds);
				setLoading(false);
			})
			.catch((err) => {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch markets"
				);
				setLoading(false);
			});
	};

	return { data, loading, error, refetch };
}

// Hook for fetching settled markets
export function useMarketSettleds(options?: {
	first?: number;
	skip?: number;
	orderBy?: string;
	orderDirection?: string;
	autoRefresh?: boolean;
	refreshInterval?: number;
}) {
	const [data, setData] = useState<MarketSettled[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);
				const response = await getMarketSettleds(options);
				setData(response.marketSettleds);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch settled markets"
				);
			} finally {
				setLoading(false);
			}
		}

		fetchData();

		if (options?.autoRefresh && options?.refreshInterval) {
			const interval = setInterval(fetchData, options.refreshInterval);
			return () => clearInterval(interval);
		}
	}, [
		options?.first,
		options?.skip,
		options?.orderBy,
		options?.orderDirection
	]);

	const refetch = () => {
		setLoading(true);
		setError(null);
		getMarketSettleds(options)
			.then((response) => {
				setData(response.marketSettleds);
				setLoading(false);
			})
			.catch((err) => {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch settled markets"
				);
				setLoading(false);
			});
	};

	return { data, loading, error, refetch };
}

// Hook for fetching fees data
export function useFeesPaids(options?: {
	first?: number;
	skip?: number;
	orderBy?: string;
	orderDirection?: string;
	autoRefresh?: boolean;
	refreshInterval?: number;
}) {
	const [data, setData] = useState<FeePaid[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);
				setError(null);
				const response = await getFeesPaids(options);
				setData(response.feesPaids);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch fees data"
				);
			} finally {
				setLoading(false);
			}
		}

		fetchData();

		if (options?.autoRefresh && options?.refreshInterval) {
			const interval = setInterval(fetchData, options.refreshInterval);
			return () => clearInterval(interval);
		}
	}, [
		options?.first,
		options?.skip,
		options?.orderBy,
		options?.orderDirection
	]);

	const refetch = () => {
		setLoading(true);
		setError(null);
		getFeesPaids(options)
			.then((response) => {
				setData(response.feesPaids);
				setLoading(false);
			})
			.catch((err) => {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch fees data"
				);
				setLoading(false);
			});
	};

	return { data, loading, error, refetch };
}

// Hook for fetching a specific market by ID
export function useMarketById(marketId: string) {
	const [data, setData] = useState<{
		created?: MarketCreated;
		settled?: MarketSettled;
		fees: FeePaid[];
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			if (!marketId) return;

			try {
				setLoading(true);
				setError(null);
				const response = await getMarketById(marketId);
				setData({
					created: response.marketCreateds[0],
					settled: response.marketSettleds[0],
					fees: response.feesPaids
				});
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch market data"
				);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [marketId]);

	const refetch = () => {
		if (!marketId) return;

		setLoading(true);
		setError(null);
		getMarketById(marketId)
			.then((response) => {
				setData({
					created: response.marketCreateds[0],
					settled: response.marketSettleds[0],
					fees: response.feesPaids
				});
				setLoading(false);
			})
			.catch((err) => {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch market data"
				);
				setLoading(false);
			});
	};

	return { data, loading, error, refetch };
}

// Hook for fetching markets by creator
export function useMarketsByCreator(
	creator: string,
	options?: { first?: number; skip?: number }
) {
	const [data, setData] = useState<MarketCreated[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchData() {
			if (!creator) return;

			try {
				setLoading(true);
				setError(null);
				const response = await getMarketsByCreator(creator, options);
				setData(response.marketCreateds);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch creator markets"
				);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, [creator, options?.first, options?.skip]);

	const refetch = () => {
		if (!creator) return;

		setLoading(true);
		setError(null);
		getMarketsByCreator(creator, options)
			.then((response) => {
				setData(response.marketCreateds);
				setLoading(false);
			})
			.catch((err) => {
				setError(
					err instanceof Error
						? err.message
						: "Failed to fetch creator markets"
				);
				setLoading(false);
			});
	};

	return { data, loading, error, refetch };
}

// Hook for real-time market statistics
export function useMarketStats() {
	const { data: markets, loading: marketsLoading } = useMarketCreateds({
		autoRefresh: true,
		refreshInterval: 30000 // 30 seconds
	});
	const { data: settled, loading: settledLoading } = useMarketSettleds({
		autoRefresh: true,
		refreshInterval: 30000
	});
	const { data: fees, loading: feesLoading } = useFeesPaids({
		autoRefresh: true,
		refreshInterval: 30000
	});

	const stats = {
		totalMarkets: markets.length,
		settledMarkets: settled.length,
		activeMarkets: markets.length - settled.length,
		totalVolume: fees.reduce(
			(sum, fee) =>
				sum + BigInt(fee.creatorFee) + BigInt(fee.platformFee),
			BigInt(0)
		),
		totalFees: fees.reduce(
			(sum, fee) =>
				sum + BigInt(fee.creatorFee) + BigInt(fee.platformFee),
			BigInt(0)
		)
	};

	return {
		stats,
		loading: marketsLoading || settledLoading || feesLoading
	};
}
