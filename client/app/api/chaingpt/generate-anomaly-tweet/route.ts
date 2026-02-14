import { NextResponse } from 'next/server';
import { generateAnomalyAlertTweet } from '@/src/chaingpt/domain/tweets/tweetService';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';
import { demoAnomalyTweet, isDemoModeServer } from '@/src/chaingpt/lib/demoFallback';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { market?: MarketSignal; reason?: string };
    if (!body?.market?.marketId) {
      return NextResponse.json({ error: 'Missing market' }, { status: 400 });
    }

    const reason = body.reason?.trim() || `Anomaly score is ${body.market.anomalyScore.toFixed(2)}.`;

    if (isDemoModeServer() && !process.env.CHAINGPT_API_KEY) {
      const tweet = demoAnomalyTweet(body.market.title, reason);
      return NextResponse.json({ tweet, demo: true });
    }

    const tweet = await generateAnomalyAlertTweet(body.market, reason);
    return NextResponse.json({ tweet });
  } catch (err: any) {
    const msg = err?.message || 'Failed to generate alert';
    const status =
      msg.includes('CHAINGPT_API_KEY is not set') ? 501 :
      msg.includes('ChainGPT request failed (401)') ? 401 :
      msg.includes('ChainGPT request failed (402)') || msg.includes('ChainGPT request failed (403)') ? 402 :
      500;
    return NextResponse.json({ error: msg }, { status });
  }
}

