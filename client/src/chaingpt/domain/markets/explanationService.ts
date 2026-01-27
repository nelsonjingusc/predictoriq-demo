import { chaingptChatBlob } from '@/src/chaingpt/lib/chaingptClient';
import type { MarketExplanation, MarketSignal, MarketStance } from '@/src/chaingpt/domain/markets/types';

function stanceFromText(text: string): MarketStance {
  const lower = text.toLowerCase();
  if (lower.includes('long yes') || lower.includes('lean yes') || lower.includes('favor yes')) return 'long_yes';
  if (lower.includes('long no') || lower.includes('lean no') || lower.includes('favor no')) return 'long_no';
  if (lower.includes('avoid') || lower.includes('stay away')) return 'avoid';
  return 'neutral';
}

export async function generateMarketExplanation(signal: MarketSignal): Promise<MarketExplanation> {
  const prompt = [
    'You are helping a serious user evaluate a prediction market.',
    '',
    'Structured market signals:',
    `- Title: ${signal.title}`,
    `- URL: ${signal.url}`,
    `- Venue: ${signal.venue}`,
    `- Market implied probability: ${(signal.impliedProbMarket * 100).toFixed(1)}%`,
    `- Options anchor probability: ${(signal.impliedProbOptions * 100).toFixed(1)}%`,
    `- Mispricing (market - options): ${(signal.mispricing * 100).toFixed(1)} percentage points`,
    `- Capital quality YES: ${signal.capitalQualityYes}`,
    `- Capital quality NO: ${signal.capitalQualityNo}`,
    `- Anomaly score (0-1): ${signal.anomalyScore.toFixed(2)}`,
    `- Liquidity: ${signal.liquidityLevel}`,
    '',
    'Task:',
    'Write a short 2–3 sentence explanation of whether the current pricing looks cheap, fair, or expensive, and why.',
    'Clearly state one of: long YES, long NO, neutral, or avoid (e.g., due to low liquidity).',
    'Use simple, direct English. No hype. No emojis.',
    '',
    'Answer in one compact paragraph.',
  ].join('\n');

  const summary = (await chaingptChatBlob({ question: prompt, chatHistory: 'off' })).trim();
  const stance = stanceFromText(summary);

  return { stance, summary };
}

