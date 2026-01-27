import { chaingptChatBlob } from '@/src/chaingpt/lib/chaingptClient';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';

export interface ResearchCopilotInput {
  userQuestion: string;
  signal: MarketSignal;
  sdkUniqueId?: string;
}

export async function researchCopilotAnswer(input: ResearchCopilotInput): Promise<string> {
  const { userQuestion, signal, sdkUniqueId } = input;

  const prompt = [
    'You are assisting a serious prediction market user.',
    '',
    'Current market context (structured signals):',
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
    'User question:',
    `"${userQuestion}"`,
    '',
    'Answer rules:',
    '- Plain, direct English.',
    '- No hype. No emojis.',
    '- If you speculate, explicitly say that you are speculating.',
  ].join('\n');

  const answer = await chaingptChatBlob({
    question: prompt,
    chatHistory: 'on',
    sdkUniqueId,
  });

  return answer.trim();
}

