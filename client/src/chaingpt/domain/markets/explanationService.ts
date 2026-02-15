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
    'You are ChainGPT, an elite prediction market analyst with a focus on "Predictive Alpha".',
    'Your goal is to provide a sharp, institutional-grade assessment of this market opportunity.',
    '',
    'MARKET DATA:',
    `- Title: ${signal.title}`,
    `- Platform: ${signal.venue}`,
    `- Current Probability: ${(signal.impliedProbMarket * 100).toFixed(1)}%`,
    `- Anchor Probability (Options-implied): ${(signal.impliedProbOptions * 100).toFixed(1)}%`,
    `- Mispricing Spread: ${(signal.mispricing * 100).toFixed(1)}%`,
    `- Smart Money Flow (YES): ${signal.capitalQualityYes}`,
    `- Smart Money Flow (NO): ${signal.capitalQualityNo}`,
    `- Market Anomaly Score: ${signal.anomalyScore.toFixed(2)} (0=Normal, 1=High Anomaly)`,
    `- Liquidity Depth: ${signal.liquidityLevel}`,
    '',
    'ANALYSIS REQUIRED:',
    '1. VALUATION: Is this market Mispriced, Fair, or Crowded? Compare market prob vs. anchor prob.',
    '2. SMART MONEY: Analyze the capital quality flows. acts as a leading indicator.',
    '3. VERDICT: "Long YES", "Long NO", "Neutral", or "Avoid".',
    '',
    'STYLE GUIDELINES:',
    '- Be concise (max 3 sentences).',
    '- Focus on asymmetric risk/reward.',
    '- Suggest a specific trading action based on the data.',
    '- Tone: Professional, direct, "Alpha-seeking". No filler words.',
  ].join('\n');

  const summary = (await chaingptChatBlob({ question: prompt, chatHistory: 'off' })).trim();
  const stance = stanceFromText(summary);

  return { stance, summary };
}

