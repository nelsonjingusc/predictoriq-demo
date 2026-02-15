import { chaingptChatBlob } from '@/src/chaingpt/lib/chaingptClient';
import type { WalletStats } from './types';

interface StrategyAnalysis {
  strategy: string;
  riskAssessment: {
    strengths: string[];
    risks: string[];
  };
}

export async function generateWalletSummary(stats: WalletStats) {
  const prompt = [
    'You are a top-tier crypto analyst and prediction market expert.',
    '',
    '=== PERFORMANCE METRICS ===',
    `Win Rate: ${(stats.winRate * 100).toFixed(1)}% (${stats.winningPositions}W / ${stats.losingPositions}L / ${stats.breakEvenPositions}BE)`,
    `Total P&L: $${stats.totalPnL.toFixed(2)} (ROI: ${stats.roi.toFixed(1)}%)`,
    `Realized: $${stats.realizedPnL.toFixed(2)} | Unrealized: $${stats.unrealizedPnL.toFixed(2)}`,
    `Total Invested: $${stats.totalInvested.toFixed(2)}`,
    `Best Win: $${stats.largestWin.toFixed(2)} | Worst Loss: $${stats.largestLoss.toFixed(2)}`,
    '',
    '=== TRADING ACTIVITY ===',
    `Markets: ${stats.totalMarkets} | Positions: ${stats.totalPositions} | Trades: ${stats.totalTrades}`,
    `Buy Volume: $${stats.buyVolume.toFixed(0)} | Sell Volume: $${stats.sellVolume.toFixed(0)}`,
    `Avg Position: $${stats.avgPositionSize.toFixed(0)}`,
    `Categories: ${stats.favoriteCategories.join(', ')}`,
    `Behaviors: ${stats.notableBehaviors.join('; ')}`,
    '',
    'Analyze this activity and respond in JSON format:',
    '{',
    '  "summary": "A brutally honest 4-sentence overview of their profile.",',
    '  "strategy": "2-3 sentences describing their primary strategy using prediction market terms.",',
    '  "riskAssessment": {',
    '    "strengths": ["string", "string"],',
    '    "risks": ["string", "string"]',
    '  }',
    '}'
  ].join('\n');

  const rawJson = await chaingptChatBlob({
    question: prompt,
    chatHistory: 'off',
  });

  // Sanitize the response: remove markdown code blocks if present
  const jsonString = rawJson.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // Fallback if AI output is not clean JSON
    return {
      summary: rawJson.slice(0, 300),
      strategy: "Manual analysis required.",
      riskAssessment: { strengths: ["Data received"], risks: ["Incomplete analysis"] }
    };
  }
}
