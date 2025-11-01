import { useState, useCallback } from "react";
import {
	SimulationResult,
	TransactionSimulation,
	simulateTransaction
} from "@/lib/simulation";

export function useTransactionSimulation() {
	const [isSimulating, setIsSimulating] = useState(false);
	const [simulationResult, setSimulationResult] =
		useState<SimulationResult | null>(null);

	const simulate = useCallback(async (simulation: TransactionSimulation) => {
		setIsSimulating(true);
		setSimulationResult(null);

		try {
			const result = await simulateTransaction(simulation);
			setSimulationResult(result);
			return result;
		} catch (error) {
			const errorResult: SimulationResult = {
				success: false,
				error:
					error instanceof Error ? error.message : "Simulation failed"
			};
			setSimulationResult(errorResult);
			return errorResult;
		} finally {
			setIsSimulating(false);
		}
	}, []);

	const clearSimulation = useCallback(() => {
		setSimulationResult(null);
	}, []);

	return {
		simulate,
		clearSimulation,
		isSimulating,
		simulationResult
	};
}
