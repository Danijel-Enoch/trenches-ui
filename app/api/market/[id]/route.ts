import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { PredictionMarket, PredictionMarketAbi } from '@/lib/contracts';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const marketId = BigInt(params.id);

    const marketInfo = await publicClient.readContract({
      address: PredictionMarket as `0x${string}`,
      abi: PredictionMarketAbi,
      functionName: 'getMarketInfo',
      args: [marketId],
    });

    const market = {
      id: marketId,
      creator: marketInfo[0],
      tokenAddress: marketInfo[1],
      initialPrice: marketInfo[2],
      createdAt: marketInfo[3],
      settlementTime: marketInfo[4],
      settled: marketInfo[5],
      finalPrice: marketInfo[6],
    };

    return NextResponse.json(market);
  } catch (error) {
    console.error('Error fetching market:', error);
    return NextResponse.json({ error: 'Market not found' }, { status: 404 });
  }
}
