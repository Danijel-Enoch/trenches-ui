import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { PredictionMarket, PredictionMarketAbi } from '@/lib/contracts';
import { Outcome } from '@/lib/types';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const marketId = BigInt(searchParams.get('marketId') || '0');
    const address = searchParams.get('address') as `0x${string}`;

    if (!address) {
      return NextResponse.json({ error: 'Address required' }, { status: 400 });
    }

    const [marketInfo, upShares, downShares] = await Promise.all([
      publicClient.readContract({
        address: PredictionMarket as `0x${string}`,
        abi: PredictionMarketAbi,
        functionName: 'getMarketInfo',
        args: [marketId],
      }),
      publicClient.readContract({
        address: PredictionMarket as `0x${string}`,
        abi: PredictionMarketAbi,
        functionName: 'getUserShares',
        args: [marketId, address, Outcome.UP],
      }),
      publicClient.readContract({
        address: PredictionMarket as `0x${string}`,
        abi: PredictionMarketAbi,
        functionName: 'getUserShares',
        args: [marketId, address, Outcome.DOWN],
      }),
    ]);

    const position = {
      marketId,
      tokenAddress: marketInfo[1],
      upShares,
      downShares,
      settled: marketInfo[5],
      initialPrice: marketInfo[2],
      finalPrice: marketInfo[6],
    };

    return NextResponse.json(position);
  } catch (error) {
    console.error('Error fetching position:', error);
    return NextResponse.json({ error: 'Position not found' }, { status: 404 });
  }
}
