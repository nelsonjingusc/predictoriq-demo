import { NextResponse } from 'next/server';
import { generateDailyDigestTweets } from '@/src/chaingpt/domain/tweets/tweetService';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';
import { demoDigestTweets, isDemoModeServer } from '@/src/chaingpt/lib/demoFallback';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { date?: string; markets?: MarketSignal[] };
    if (!Array.isArray(body?.markets) || body.markets.length === 0) {
      return NextResponse.json({ error: 'Missing markets' }, { status: 400 });
    }

    const dateISO = body.date || new Date().toISOString().slice(0, 10);

    if (isDemoModeServer() && !process.env.CHAINGPT_API_KEY) {
      const tweets = demoDigestTweets(dateISO, body.markets);
      return NextResponse.json({ date: dateISO, tweets, demo: true });
    }

    const tweets = await generateDailyDigestTweets(body.markets, dateISO);
    return NextResponse.json({ date: dateISO, tweets });
  } catch (err: any) {
    const msg = err?.message || 'Failed to generate digest';
    const status =
      msg.includes('CHAINGPT_API_KEY is not set') ? 501 :
      msg.includes('ChainGPT request failed (401)') ? 401 :
      msg.includes('ChainGPT request failed (402)') || msg.includes('ChainGPT request failed (403)') ? 402 :
      500;
    return NextResponse.json({ error: msg }, { status });
  }
}

