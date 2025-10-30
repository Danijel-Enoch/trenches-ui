'use client';

import { Market, Outcome } from '@/lib/types';
import { motion } from 'framer-motion';
import { formatEther, parseEther } from 'viem';
import { useState } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { PredictionMarket, PredictionMarketAbi } from '@/lib/contracts';

interface MarketCardProps {
  market: Market;
  marketId: bigint;
}

export function MarketCard({ market, marketId }: MarketCardProps) {
  const [amount, setAmount] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<Outcome>(Outcome.UP);
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const { data: upStats } = useReadContract({
    address: PredictionMarket as `0x${string}`,
    abi: PredictionMarketAbi,
    functionName: 'getOutcomeStats',
    args: [marketId, Outcome.UP],
  });

  const { data: downStats } = useReadContract({
    address: PredictionMarket as `0x${string}`,
    abi: PredictionMarketAbi,
    functionName: 'getOutcomeStats',
    args: [marketId, Outcome.DOWN],
  });

  const { data: buyCost } = useReadContract({
    address: PredictionMarket as `0x${string}`,
    abi: PredictionMarketAbi,
    functionName: 'calculateBuyCost',
    args: amount ? [marketId, selectedOutcome, parseEther(amount)] : undefined,
    query: { enabled: !!amount && parseFloat(amount) > 0 },
  });

  const upShares = upStats ? upStats[0] : 0n;
  const downShares = downStats ? downStats[0] : 0n;
  const totalShares = upShares + downShares;
  const upPercentage = totalShares > 0n ? Number((upShares * 100n) / totalShares) : 50;
  const downPercentage = 100 - upPercentage;

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    try {
      await writeContract({
        address: PredictionMarket as `0x${string}`,
        abi: PredictionMarketAbi,
        functionName: 'buyShares',
        args: [marketId, selectedOutcome, parseEther(amount)],
        value: buyCost as bigint,
      });
      setAmount('');
    } catch (error) {
      console.error('Error buying shares:', error);
    }
  };

  const isSettled = market.settled;
  const timeUntilSettlement = Number(market.settlementTime) * 1000 - Date.now();
  const hoursRemaining = Math.max(0, Math.floor(timeUntilSettlement / (1000 * 60 * 60)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-purple-500 transition-all"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-1">{market.tokenAddress}</h3>
          <p className="text-sm text-zinc-400">
            Initial: ${formatEther(market.initialPrice)}
          </p>
        </div>
        <div className="text-right">
          {isSettled ? (
            <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
              Settled
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">
              {hoursRemaining}h left
            </span>
          )}
        </div>
      </div>

      {/* Prediction Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-green-400 font-semibold">↑ UP {upPercentage.toFixed(1)}%</span>
          <span className="text-red-400 font-semibold">↓ DOWN {downPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-zinc-700 rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${upPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-green-500 to-green-400"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${downPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-red-400 to-red-500"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-zinc-500">
          <span>{formatEther(upShares)} shares</span>
          <span>{formatEther(downShares)} shares</span>
        </div>
      </div>

      {!isSettled && address && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedOutcome(Outcome.UP)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                selectedOutcome === Outcome.UP
                  ? 'bg-green-500 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              ↑ UP
            </button>
            <button
              onClick={() => setSelectedOutcome(Outcome.DOWN)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                selectedOutcome === Outcome.DOWN
                  ? 'bg-red-500 text-white'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              ↓ DOWN
            </button>
          </div>

          <input
            type="number"
            placeholder="Amount (shares)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
            step="0.01"
          />

          {buyCost && (
            <p className="text-sm text-zinc-400">
              Cost: {formatEther(buyCost)} ETH
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuy}
            disabled={!amount || parseFloat(amount) <= 0}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Place Bet
          </motion.button>
        </div>
      )}

      {isSettled && market.finalPrice && (
        <div className="mt-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
          <p className="text-sm text-zinc-400">Final Price</p>
          <p className="text-lg font-bold">${formatEther(market.finalPrice)}</p>
        </div>
      )}
    </motion.div>
  );
}
