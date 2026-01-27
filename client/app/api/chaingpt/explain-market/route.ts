import { NextResponse } from 'next/server';
import { generateMarketExplanation } from '@/src/chaingpt/domain/markets/explanationService';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';
import { demoExplanation, isDemoModeServer } from '@/src/chaingpt/lib/demoFallback';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { signal?: MarketSignal };
    if (!body?.signal?.marketId) {
      return NextResponse.json({ error: 'Missing signal' }, { status: 400 });
    }

    if (isDemoModeServer() && !process.env.CHAINGPT_API_KEY) {
      const explanation = demoExplanation(body.signal);
      return NextResponse.json({ explanation, demo: true });
    }

    const explanation = await generateMarketExplanation(body.signal);
    return NextResponse.json({ explanation });
  } catch (err: any) {
    const msg = err?.message || 'Failed to generate explanation';
    const status =
      msg.includes('CHAINGPT_API_KEY is not set') ? 501 :
      msg.includes('ChainGPT request failed (401)') ? 401 :
      msg.includes('ChainGPT request failed (402)') || msg.includes('ChainGPT request failed (403)') ? 402 :
      500;
    return NextResponse.json({ error: msg }, { status });
  }
}

