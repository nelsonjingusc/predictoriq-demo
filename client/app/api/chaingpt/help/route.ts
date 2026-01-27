import { NextResponse } from 'next/server';
import { helpAnswer } from '@/src/chaingpt/domain/help/helpService';
import { demoHelpAnswer, isDemoModeServer } from '@/src/chaingpt/lib/demoFallback';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { question?: string; sessionId?: string };
    if (!body?.question) {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }

    if (isDemoModeServer() && !process.env.CHAINGPT_API_KEY) {
      const answer = demoHelpAnswer(body.question);
      return NextResponse.json({ answer, demo: true });
    }

    const answer = await helpAnswer(body.question, body.sessionId);
    return NextResponse.json({ answer });
  } catch (err: any) {
    const msg = err?.message || 'Failed to answer help question';
    const status =
      msg.includes('CHAINGPT_API_KEY is not set') ? 501 :
      msg.includes('ChainGPT request failed (401)') ? 401 :
      msg.includes('ChainGPT request failed (402)') || msg.includes('ChainGPT request failed (403)') ? 402 :
      500;
    return NextResponse.json({ error: msg }, { status });
  }
}

