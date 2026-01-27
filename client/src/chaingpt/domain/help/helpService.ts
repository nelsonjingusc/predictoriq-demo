import { chaingptChatBlob } from '@/src/chaingpt/lib/chaingptClient';

export async function helpAnswer(question: string, sessionId?: string): Promise<string> {
  const prompt = [
    'You are a support assistant for a project called PredictorIQ.',
    '',
    'PredictorIQ is an intelligence layer for prediction markets. It helps users by:',
    '- Comparing prices across platforms to find arbitrage',
    '- Anchoring implied probabilities to option market inputs (when available)',
    '- Ranking markets into a Top10 list with short explanations',
    '',
    'The user is asking about how to use the product or what a metric means.',
    '',
    'User question:',
    `"${question}"`,
    '',
    'Answer rules:',
    '- Simple, direct English.',
    '- 2–4 sentences.',
    '- No hype. No emojis.',
  ].join('\n');

  const answer = await chaingptChatBlob({
    question: prompt,
    chatHistory: 'on',
    sdkUniqueId: sessionId,
  });

  return answer.trim();
}

