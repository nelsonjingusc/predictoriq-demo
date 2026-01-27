import { chaingptChatBlob } from '@/src/chaingpt/lib/chaingptClient';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';

export type Tweet = { text: string };

function normalizeTweets(raw: string): Tweet[] {
  // Expect 1–3 tweets separated by blank lines. Also accept numbered lists.
  const cleaned = raw
    .replace(/\r\n/g, '\n')
    .trim()
    .replace(/^\s*```[\s\S]*?\n/gm, '')
    .replace(/\n```$/g, '');

  const parts = cleaned
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/^\s*\d+\.\s+/, '').trim());

  const tweets = parts.length ? parts : [cleaned];
  return tweets
    .map((t) => ({ text: t.trim() }))
    .filter((t) => t.text.length > 0)
    .slice(0, 3);
}

export async function generateDailyDigestTweets(markets: MarketSignal[], dateISO: string): Promise<Tweet[]> {
  const marketsText = markets
    .slice(0, 5)
    .map((m, idx) =>
      [
        `[${idx + 1}] ${m.title}`,
        `- URL: ${m.url}`,
        `- Venue: ${m.venue}`,
        `- Market prob: ${(m.impliedProbMarket * 100).toFixed(1)}%`,
        `- Options anchor: ${(m.impliedProbOptions * 100).toFixed(1)}%`,
        `- Mispricing (market - options): ${(m.mispricing * 100).toFixed(1)} pp`,
        `- Capital quality YES/NO: ${m.capitalQualityYes}/${m.capitalQualityNo}`,
        `- Anomaly score: ${m.anomalyScore.toFixed(2)}`,
        `- Liquidity: ${m.liquidityLevel}`,
      ].join('\n')
    )
    .join('\n\n');

  const prompt = [
    'You are writing a daily Twitter digest for serious prediction market users.',
    '',
    `Date: ${dateISO}`,
    '',
    'Based on the markets below, write 1 to 3 tweets in English.',
    'Rules:',
    '- Each tweet must be <= 240 characters.',
    '- Plain, direct English. No hype. No emojis.',
    '- Each tweet should include at least one market URL.',
    '- Focus on mispricing vs options and/or unusual structure/anomaly signals.',
    '',
    'Markets:',
    marketsText,
    '',
    'Output format:',
    '- Return ONLY the tweet text.',
    '- Separate tweets with a blank line.',
  ].join('\n');

  const raw = await chaingptChatBlob({ question: prompt, chatHistory: 'off' });
  return normalizeTweets(raw);
}

export async function generateAnomalyAlertTweet(market: MarketSignal, reason: string): Promise<Tweet> {
  const prompt = [
    'You are writing a short Twitter alert for a prediction market anomaly.',
    '',
    'Rules:',
    '- One tweet, <= 240 characters.',
    '- Plain, direct English. No hype. No emojis.',
    '- Include the market URL.',
    '',
    'Market:',
    `- Title: ${market.title}`,
    `- URL: ${market.url}`,
    `- Venue: ${market.venue}`,
    `- Market prob: ${(market.impliedProbMarket * 100).toFixed(1)}%`,
    `- Options anchor: ${(market.impliedProbOptions * 100).toFixed(1)}%`,
    `- Mispricing (market - options): ${(market.mispricing * 100).toFixed(1)} pp`,
    `- Capital quality YES/NO: ${market.capitalQualityYes}/${market.capitalQualityNo}`,
    `- Anomaly score: ${market.anomalyScore.toFixed(2)}`,
    `- Liquidity: ${market.liquidityLevel}`,
    '',
    'Why it looks anomalous:',
    reason,
    '',
    'Return ONLY the tweet text.',
  ].join('\n');

  const raw = await chaingptChatBlob({ question: prompt, chatHistory: 'off' });
  const tweet = normalizeTweets(raw)[0] || { text: raw.trim() };
  return tweet;
}

