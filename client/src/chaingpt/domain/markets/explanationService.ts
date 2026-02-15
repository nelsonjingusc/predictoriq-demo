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
    'You are ChainGPT, an elite prediction market analyst.',
    'Provide a structured assessment of this market opportunity in JSON format.',
    '',
    'MARKET DATA:',
    `- Title: ${signal.title}`,
    `- Platform: ${signal.venue}`,
    `- Current Probability: ${(signal.impliedProbMarket * 100).toFixed(1)}%`,
    `- Anchor Probability (Options-implied): ${(signal.impliedProbOptions * 100).toFixed(1)}%`,
    `- Mispricing Spread: ${(signal.mispricing * 100).toFixed(1)}%`,
    `- Smart Money Flow (YES): ${signal.capitalQualityYes}`,
    `- Smart Money Flow (NO): ${signal.capitalQualityNo}`,
    `- Market Anomaly Score: ${signal.anomalyScore.toFixed(2)}`,
    `- Liquidity Depth: ${signal.liquidityLevel}`,
    '',
    'OUTPUT FORMAT (JSON ONLY):',
    '{',
    '  "valuation": "Brief assessment of price vs anchor (max 15 words)",',
    '  "smart_money": "Analysis of capital flows (max 15 words)",',
    '  "verdict": "Explanation of the trading stance (max 15 words)",',
    '  "detailed_analysis": "Comprehensive deep dive (2-3 paragraphs). Discuss market mechanics, volume trends, and specific catalyst risks. Use professional financial tone.",',
    '  "stance": "long_yes" | "long_no" | "neutral" | "avoid"',
    '}'
  ].join('\n');

  const raw = await chaingptChatBlob({ question: prompt, chatHistory: 'off' });

  // Clean markdown code blocks for JSON parsing
  const jsonString = raw
    .replace(/^```json\s*/, '')
    .replace(/^```\s*/, '')
    .replace(/```$/, '')
    .trim();

  try {
    const data = JSON.parse(jsonString);
    return {
      stance: data.stance || 'neutral',
      summary: data.verdict,
      details: {
        valuation: data.valuation,
        smart_money: data.smart_money,
        verdict: data.verdict,
        detailed_analysis: data.detailed_analysis,
      }
    };
  } catch (e) {
    // Fallback: Parsing failed (likely model error or malformed JSON)

    // Check for common AI failure modes
    if (raw.includes("technical issue") || raw.includes("apologize")) {
      return {
        stance: 'neutral',
        summary: 'AI Analysis temporarily unavailable. Please try again later.',
      };
    }

    // Attempt to salvage text from the raw response (strip backticks)
    const cleanText = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/[{}"]/g, '') // Basic attempt to clean JSON syntax if it leaked
      .trim();

    return {
      stance: stanceFromText(cleanText),
      summary: cleanText,
    };
  }
}

/**
 * Generates a very short (one sentence) AI summary for the Top 10 list chips.
 * Optimized for brevity and credit efficiency.
 */
export async function generateMarketChipSummary(title: string, price: number, label: string): Promise<string> {
  const prompt = `You are a prediction market analyst. Generate a ONE SENTENCE professional insight for this market: "${title}" at ${(price * 100).toFixed(1)}% for ${label}. Focus on trend or sentiment. Max 12 words. No emojis. Start with "ChainGPT: "`;

  const summary = await chaingptChatBlob({
    question: prompt,
    chatHistory: 'off',
  });

  return summary.trim();
}

