import type { MarketExplanation } from '../domain/markets/types';
import type { ResearchNote } from '../domain/markets/types';

export function isDemoModeServer(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === '1' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

export function demoExplanation(signal?: any): MarketExplanation {
  const title = signal?.title || 'this market';
  return {
    stance: 'neutral',
    summary: `Demo mode: ${title} shows balanced pricing with moderate liquidity. The implied probability aligns with option-anchored estimates, suggesting fair value. Capital quality is mixed on both sides. In live mode, ChainGPT Web3 LLM would provide detailed analysis.`,
  };
}

export function demoHelpAnswer(question: string): string {
  const lowerQ = question.toLowerCase();
  
  if (lowerQ.includes('what are') || lowerQ.includes('what is')) {
    return `Demo mode: Prediction markets let you trade on the outcome of future events. You buy shares that pay out if your prediction is correct. For example, if you think a candidate will win an election, you buy "Yes" shares. If they win, your shares pay $1 each. In live mode, ChainGPT Web3 LLM would provide more detailed explanations.`;
  }
  
  if (lowerQ.includes('get started') || lowerQ.includes('begin')) {
    return `Demo mode: To get started: (1) Choose a platform like Polymarket or Kalshi, (2) Connect your wallet or create an account, (3) Browse markets and find events you understand, (4) Start with small positions to learn. In live mode, ChainGPT Web3 LLM would provide step-by-step guidance.`;
  }
  
  if (lowerQ.includes('strategy') || lowerQ.includes('strategies')) {
    return `Demo mode: For beginners: (1) Trade on topics you know well, (2) Start with binary yes/no markets, (3) Compare odds across platforms, (4) Don't risk more than you can afford to lose. In live mode, ChainGPT Web3 LLM would provide personalized strategy advice.`;
  }
  
  if (lowerQ.includes('risk')) {
    return `Demo mode: Main risks: (1) You can lose your entire position if wrong, (2) Low liquidity can make it hard to exit, (3) Market manipulation is possible, (4) Platform risk (smart contract bugs). Always start small. In live mode, ChainGPT Web3 LLM would provide detailed risk analysis.`;
  }
  
  return `Demo mode: This is a sample answer to "${question}". In live mode, ChainGPT Web3 LLM would provide a detailed, beginner-friendly explanation about prediction markets.`;
}

export function demoDailyNote(dateISO?: string, markets?: any[]): ResearchNote {
  const date = dateISO || new Date().toISOString();
  const marketCount = markets?.length || 3;
  return {
    generatedAt: date,
    markdown: `# Daily Research Note (Demo)

## Overview
Demo mode: This is a sample daily note for ${new Date(date).toLocaleDateString()}. Analyzed ${marketCount} markets. In live mode, ChainGPT would analyze selected markets and generate a comprehensive Markdown summary.

## Key Markets
- Market 1: Balanced pricing, moderate activity
- Market 2: Slight mispricing detected, low liquidity
- Market 3: High capital quality, trending upward

## Notable Anomalies
No significant anomalies detected in demo data.

## Cross-Venue Observations
Demo mode placeholder for cross-platform insights.`,
  };
}

export function demoDigestTweets(dateISO?: string, markets?: any[]): Array<{ text: string }> {
  const date = dateISO ? new Date(dateISO).toLocaleDateString() : 'today';
  const marketCount = markets?.length || 3;
  return [
    { text: `Demo mode: Market digest for ${date}. Analyzed ${marketCount} markets. Market A shows interesting mispricing patterns. Check it out on PredictorIQ.` },
    { text: 'Demo mode: High capital quality detected in Market B. Early movers positioning for upside.' },
    { text: 'Demo mode: Cross-platform arbitrage opportunity spotted between Polymarket and Kalshi. In live mode, ChainGPT would provide detailed insights.' },
  ];
}

export function demoAnomalyTweet(marketTitle: string, reason?: string): { text: string } {
  const reasonText = reason ? ` Reason: ${reason}` : '';
  return {
    text: `Demo mode: 🚨 Anomaly Alert: ${marketTitle} - Unusual activity detected. One-sided flow from new wallets.${reasonText} Exercise caution. In live mode, ChainGPT would provide detailed analysis.`,
  };
}

export function demoWalletSummary(address: string): string {
  return `Demo mode: This wallet (${address.slice(0, 10)}...) shows moderate activity across prediction markets. In live mode, ChainGPT Web3 LLM would provide a detailed analysis of trading patterns, win rate, and risk profile based on on-chain history.`;
}
