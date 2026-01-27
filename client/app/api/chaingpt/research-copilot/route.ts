import { NextResponse } from 'next/server';
import { researchCopilotAnswer } from '@/src/chaingpt/domain/markets/researchCopilotService';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';
import { demoHelpAnswer, isDemoModeServer } from '@/src/chaingpt/lib/demoFallback';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { question?: string; signal?: MarketSignal; sessionId?: string };
    if (!body?.question || !body?.signal?.marketId) {
      return NextResponse.json({ error: 'Missing question or signal' }, { status: 400 });
    }

    if (isDemoModeServer() && !process.env.CHAINGPT_API_KEY) {
      const answer = demoHelpAnswer(body.question);
      return NextResponse.json({ answer, demo: true });
    }

    const answer = await researchCopilotAnswer({
      userQuestion: body.question,
      signal: body.signal,
      sdkUniqueId: body.sessionId,
    });

    return NextResponse.json({ answer });
  } catch (err: any) {
    const msg = err?.message || 'Failed to answer question';
    const status =
      msg.includes('CHAINGPT_API_KEY is not set') ? 501 :
      msg.includes('ChainGPT request failed (401)') ? 401 :
      msg.includes('ChainGPT request failed (402)') || msg.includes('ChainGPT request failed (403)') ? 402 :
      500;
    return NextResponse.json({ error: msg }, { status });
  }
}

