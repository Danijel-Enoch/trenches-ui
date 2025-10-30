'use client';

import { Navbar } from '@/components/navbar';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { PredictionMarket, PredictionMarketAbi } from '@/lib/contracts';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { formatEther, parseEther } from 'viem';
import { Outcome } from '@/lib/types';

interface Position {
  marketId: bigint;
  tokenAddress: string;
  upShares: bigint;
  downShares: bigint;
  settled: boolean;
  winningOutcome?: number;
  initialPrice: bigint;
  finalPrice?: bigint;
}

export default function Positions() {
  const { address } = useAccount();
  const [positions, setPositions] = useState<Position[]>([]);
  const { writeContract } = useWriteContract();

  const { data: nextMarketId } = useReadContract({
    address: PredictionMarket as `0x${string}`,
    abi: PredictionMarketAbi,
    functionName: 'nextMarketId',
  });

  useEffect(() => {
    if (!address || !nextMarketId) return;

    const fetchPositions = async () => {
      const positionsList: Position[] = [];
      const totalMarkets = Number(nextMarketId);

      for (let i = 0; i < totalMarkets; i++) {
        try {
          const response = await fetch(`/api/user-position?marketId=${i}&address=${address}`);
          if (response.ok) {
            const data = await response.json();
            if (data.upShares > 0n || data.downShares > 0n) {
              positionsList.push(data);
            }
          }
        } catch (error) {
          console.error(`Error fetching position ${i}:`, error);
        }
      }

      setPositions(positionsList);
    };

    fetchPositions();
  }, [address, nextMarketId]);

  const handleSell = async (marketId: bigint, outcome: Outcome, shares: bigint) => {
    try {
      await writeContract({
        address: PredictionMarket as `0x${string}`,
        abi: PredictionMarketAbi,
        functionName: 'sellShares',
        args: [marketId, outcome, shares],
      });
    } catch (error) {
      console.error('Error selling shares:', error);
    }
  };

  const handleClaimWinnings = async (marketId: bigint) => {
    try {
      await writeContract({
        address: PredictionMarket as `0x${string}`,
        abi: PredictionMarketAbi,
        functionName: 'claimWinnings',
        args: [marketId],
      });
    } catch (error) {
      console.error('Error claiming winnings:', error);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-zinc-400">Connect your wallet to view your positions</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Positions
          </h1>
          <p className="text-zinc-400">Track and manage your prediction market positions</p>
        </motion.div>

        {positions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2">No Positions Yet</h2>
            <p className="text-zinc-400 mb-6">Start trading on prediction markets!</p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              View Markets
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {positions.map((position, index) => {
              const hasWon = position.settled && (
                (position.winningOutcome === Outcome.UP && position.upShares > 0n) ||
                (position.winningOutcome === Outcome.DOWN && position.downShares > 0n)
              );

              return (
                <motion.div
                  key={position.marketId.toString()}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl p-6 border border-zinc-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{position.tokenAddress}</h3>
                      <p className="text-sm text-zinc-400">
                        Market #{position.marketId.toString()} • Initial: ${formatEther(position.initialPrice)}
                      </p>
                    </div>
                    {position.settled && (
                      <span className={`px-3 py-1 rounded-full text-xs border ${
                        hasWon
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }`}>
                        {hasWon ? '✓ Won' : '✗ Lost'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {position.upShares > 0n && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-sm text-green-400 mb-1">↑ UP Position</p>
                        <p className="text-2xl font-bold">{formatEther(position.upShares)}</p>
                        <p className="text-xs text-zinc-400 mt-1">shares</p>
                      </div>
                    )}
                    {position.downShares > 0n && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm text-red-400 mb-1">↓ DOWN Position</p>
                        <p className="text-2xl font-bold">{formatEther(position.downShares)}</p>
                        <p className="text-xs text-zinc-400 mt-1">shares</p>
                      </div>
                    )}
                  </div>

                  {position.settled && position.finalPrice && (
                    <div className="mb-4 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                      <p className="text-sm text-zinc-400">Final Price</p>
                      <p className="text-lg font-bold">${formatEther(position.finalPrice)}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {!position.settled && (
                      <>
                        {position.upShares > 0n && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSell(position.marketId, Outcome.UP, position.upShares)}
                            className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all"
                          >
                            Sell UP
                          </motion.button>
                        )}
                        {position.downShares > 0n && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSell(position.marketId, Outcome.DOWN, position.downShares)}
                            className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all"
                          >
                            Sell DOWN
                          </motion.button>
                        )}
                      </>
                    )}

                    {position.settled && hasWon && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleClaimWinnings(position.marketId)}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        Claim Winnings
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
