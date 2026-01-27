import { chaingptChatBlob } from '@/src/chaingpt/lib/chaingptClient';
import type { MarketSignal, ResearchNote } from '@/src/chaingpt/domain/markets/types';

export async function generateDailyResearchNote(dateISO: string, markets: MarketSignal[]): Promise<ResearchNote> {
  const marketsText = markets
    .map((m, idx) =>
      [
        `[${idx + 1}] ${m.title}`,
        `- URL: ${m.url}`,
        `- Venue: ${m.venue}`,
        `- Market prob: ${(m.impliedProbMarket * 100).toFixed(1)}%`,
        `- Options anchor: ${(m.impliedProbOptions * 100).toFixed(1)}%`,
        `- Mispricing: ${(m.mispricing * 100).toFixed(1)} pp`,
        `- Capital quality YES/NO: ${m.capitalQualityYes}/${m.capitalQualityNo}`,
        `- Anomaly score: ${m.anomalyScore.toFixed(2)}`,
        `- Liquidity: ${m.liquidityLevel}`,
      ].join('\n')
    )
    .join('\n\n');

  const prompt = [
    'You are writing a daily research note for a small internal team that tracks prediction markets.',
    '',
    `Date: ${dateISO}`,
    '',
    'Below are key markets and their structured signals:',
    marketsText,
    '',
    'Task:',
    '- Write a concise research note in Markdown.',
    '- Sections: (1) Overview (2) Key Opportunities (3) Notable Anomalies (4) Cross-Venue Observations',
    '- Use simple, professional English.',
    '- No hype. No emojis.',
  ].join('\n');

  const markdown = (await chaingptChatBlob({ question: prompt, chatHistory: 'off' })).trim();

  return {
    generatedAt: new Date().toISOString(),
    markdown,
  };
}

