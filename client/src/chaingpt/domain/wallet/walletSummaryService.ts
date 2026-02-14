import { chaingptChatBlob } from '@/src/chaingpt/lib/chaingptClient';
import type { WalletStats } from './types';

interface StrategyAnalysis {
  strategy: string;
  riskAssessment: {
    strengths: string[];
    risks: string[];
  };
}

export async function generateWalletSummary(stats: WalletStats): Promise<string> {
  const prompt = buildWalletSummaryPrompt(stats);
  const answer = await chaingptChatBlob({
    question: prompt,
    chatHistory: 'off',
  });
  return answer.trim();
}

export async function analyzeStrategy(stats: WalletStats): Promise<StrategyAnalysis> {
  try {
    const response = await fetch('/api/chaingpt/analyze-trading-strategy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletStats: stats }),
    });

    if (!response.ok) {
      throw new Error(`Strategy analysis failed: ${response.statusText}`);
    }

    const analysis = await response.json();
    return analysis;
  } catch (error) {
    console.error('[Wallet Summary] Strategy analysis error:', error);
    // Return fallback analysis
    return {
      strategy: 'Unable to analyze trading strategy at this time. Please try again later.',
      riskAssessment: {
        strengths: ['Analysis temporarily unavailable'],
        risks: ['Analysis temporarily unavailable']
      }
    };
  }
}

function buildWalletSummaryPrompt(stats: WalletStats): string {
  return `You are a top-tier crypto analyst and prediction market expert. Analyze this trader's performance with brutal honesty.

=== PERFORMANCE METRICS ===
Win Rate: ${(stats.winRate * 100).toFixed(1)}% (${stats.winningPositions}W / ${stats.losingPositions}L / ${stats.breakEvenPositions}BE)
Total P&L: $${stats.totalPnL.toFixed(2)} (ROI: ${stats.roi.toFixed(1)}%)
Realized: $${stats.realizedPnL.toFixed(2)} | Unrealized: $${stats.unrealizedPnL.toFixed(2)}
Total Invested: $${stats.totalInvested.toFixed(2)}
Best Win: $${stats.largestWin.toFixed(2)} | Worst Loss: $${stats.largestLoss.toFixed(2)}

=== TRADING ACTIVITY ===
Markets: ${stats.totalMarkets} | Positions: ${stats.totalPositions} | Trades: ${stats.totalTrades}
Buy Volume: $${stats.buyVolume.toFixed(0)} | Sell Volume: $${stats.sellVolume.toFixed(0)}
Avg Position: $${stats.avgPositionSize.toFixed(0)}
Categories: ${stats.favoriteCategories.join(', ')}
Behaviors: ${stats.notableBehaviors.join('; ')}

Provide a brutally honest analysis (6-8 sentences):
1. Overall verdict - profitable or losing trader?
2. Trading style - scalper, day trader, swing, or holder?
3. Risk management - good or bad? Evidence?
4. Key strengths (if any)
5. Critical weaknesses
6. Specific recommendations to improve

Be direct. If they're losing, explain why. If winning, explain their edge.`;
}
