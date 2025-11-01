export function formatAddress(address: string): string {
	if (!address) return "";
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatPrice(price: bigint): string {
	const formatted = Number(price) / 1e18;
	if (formatted < 0.000001) return formatted.toExponential(2);
	if (formatted < 1) return formatted.toFixed(6);
	return formatted.toFixed(2);
}

export function formatTimeRemaining(timestamp: bigint): string {
	const now = Date.now();
	const target = Number(timestamp) * 1000;
	const diff = target - now;

	if (diff <= 0) return "Ended";

	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

	if (hours > 24) {
		const days = Math.floor(hours / 24);
		return `${days}d ${hours % 24}h`;
	}

	return `${hours}h ${minutes}m`;
}

export function getOutcomeColor(outcome: number): string {
	return outcome === 0 ? "green" : "red";
}

/**
 * Format price to 18 decimal places for smart contract
 * @param priceUsd Price in USD as string
 * @returns Formatted price as string with 18 decimal places
 */
export function formatPriceForContract(priceUsd: string): string {
	try {
		const price = parseFloat(priceUsd);
		if (isNaN(price)) return "0";

		// Convert to wei (18 decimal places)
		const priceInWei = BigInt(Math.floor(price * 1e18));
		return priceInWei.toString();
	} catch (error) {
		console.error("Error formatting price for contract:", error);
		return "0";
	}
}

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
	return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Get token information by address
 */
export async function getTokenInfo(
	address: string
): Promise<{ symbol: string; name: string } | null> {
	try {
		const response = await fetch(
			`https://api.dexscreener.com/latest/dex/tokens/ethereum/${address}`
		);

		if (!response.ok) {
			return null;
		}

		const data = await response.json();

		if (data && data.length > 0) {
			const pair = data[0];
			return {
				symbol: pair.baseToken.symbol || "UNKNOWN",
				name: pair.baseToken.name || "Unknown Token"
			};
		}

		return null;
	} catch (error) {
		console.error("Error fetching token info:", error);
		return null;
	}
}

/**
 * Format settlement time to readable string
 */
export function formatSettlementTime(settlementTime: bigint): string {
	const date = new Date(Number(settlementTime) * 1000);
	const now = new Date();

	// Check if it's today and show "12 midnight today" or tomorrow
	const today = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		0,
		0,
		0
	);
	const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

	if (date.getTime() === today.getTime()) {
		return "12 midnight today";
	} else if (date.getTime() === tomorrow.getTime()) {
		return "12 midnight tomorrow";
	} else {
		return `12 midnight on ${date.toLocaleDateString()}`;
	}
}
