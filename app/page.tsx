'use client';

import { Navbar } from '@/components/navbar';
import { MarketCard } from '@/components/market-card';
import { useReadContract } from 'wagmi';
import { PredictionMarket, PredictionMarketAbi } from '@/lib/contracts';
import { Market } from '@/lib/types';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Home() {
  const [markets, setMarkets] = useState<{ id: bigint; data: Market }[]>([]);

  const { data: nextMarketId } = useReadContract({
    address: PredictionMarket as `0x${string}`,
    abi: PredictionMarketAbi,
    functionName: 'nextMarketId',
  });

  useEffect(() => {
    if (!nextMarketId) return;

    const fetchMarkets = async () => {
      const marketsList: { id: bigint; data: Market }[] = [];
      const totalMarkets = Number(nextMarketId);

      for (let i = 0; i < totalMarkets; i++) {
        try {
          const response = await fetch('/api/market/' + i);
          if (response.ok) {
            const data = await response.json();
            marketsList.push({ id: BigInt(i), data });
          }
        } catch (error) {
          console.error(`Error fetching market ${i}:`, error);
        }
      }

      setMarkets(marketsList);
    };

    fetchMarkets();
  }, [nextMarketId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Prediction Markets
          </h1>
          <p className="text-xl text-zinc-400">
            Bet on token price movements. Settle at midnight.
          </p>
        </motion.div>

        {markets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-semibold mb-2">No Markets Yet</h2>
            <p className="text-zinc-400 mb-6">Be the first to create a prediction market!</p>
            <a
              href="/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Create Market
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {markets.map(({ id, data }) => (
              <MarketCard key={id.toString()} market={data} marketId={id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
