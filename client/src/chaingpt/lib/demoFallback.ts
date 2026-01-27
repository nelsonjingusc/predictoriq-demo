import type { MarketExplanation, MarketSignal, ResearchNote } from '@/src/chaingpt/domain/markets/types';
import type { Tweet } from '@/src/chaingpt/domain/tweets/tweetService';

export function isDemoModeServer(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

export function demoExplanation(signal: MarketSignal): MarketExplanation {
  const delta = (signal.impliedProbMarket - signal.impliedProbOptions) * 100;
  const stance =
    signal.liquidityLevel === 'low'
      ? 'avoid'
      : delta > 5
        ? 'long_no'
        : delta < -5
          ? 'long_yes'
          : 'neutral';

  const summary =
    stance === 'avoid'
      ? 'Liquidity looks limited, so the risk of slippage and noisy pricing is high. I would avoid unless you have a strong independent view and can size small.'
      : `Market probability is ${(signal.impliedProbMarket * 100).toFixed(1)}% vs the options anchor ${(signal.impliedProbOptions * 100).toFixed(1)}%. Based on this simplified anchor, pricing looks ${delta > 2 ? 'rich' : delta < -2 ? 'cheap' : 'roughly fair'}; stance: ${stance.replace('_', ' ')}.`;

  return { stance, summary };
}

export function demoHelpAnswer(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('mispricing')) {
    return 'Mispricing is the gap between the market-implied probability and an external anchor probability (for example from options). A positive value means the market is priced higher than the anchor; negative means lower.';
  }
  if (q.includes('anomaly')) {
    return 'Anomaly score highlights unusual behavior relative to a market’s typical patterns. It is a statistical signal to investigate, not an accusation.';
  }
  if (q.includes('arbitrage')) {
    return 'Arbitrage looks for the same event priced differently across venues. If the spread is real and executable, you can buy the cheaper side and sell the more expensive side.';
  }
  return 'PredictorIQ helps you interpret market prices using structured signals like pricing gaps, cross-venue spreads, and liquidity. Ask about a specific market and what looks unusual.';
}

export function demoDailyNote(dateISO: string, markets: MarketSignal[]): ResearchNote {
  const lines = [
    `# Daily Research Note (${dateISO})`,
    '',
    '## Overview',
    `Today we reviewed ${markets.length} markets. The note below is demo output without live ChainGPT calls.`,
    '',
    '## Key Markets',
    ...markets.map((m) => `- ${m.title} (${m.venue}) — ${m.url}`),
    '',
    '## Notable Anomalies',
    ...markets
      .filter((m) => m.anomalyScore >= 0.8)
      .map((m) => `- ${m.title}: anomalyScore=${m.anomalyScore.toFixed(2)}`),
    '',
    '## Cross-Venue Observations',
    '- Compare the same event across venues to validate pricing and liquidity before sizing.',
  ];

  return { generatedAt: new Date().toISOString(), markdown: lines.join('\n') };
}

export function demoDigestTweets(dateISO: string, markets: MarketSignal[]): Tweet[] {
  const top = markets.slice(0, 3);
  return top.map((m) => ({
    text: `[${dateISO}] Watchlist: ${m.title} (${m.venue}). Market ${(m.impliedProbMarket * 100).toFixed(0)}%. Notes: liquidity=${m.liquidityLevel}, anomaly=${m.anomalyScore.toFixed(2)}. ${m.url}`.slice(0, 240),
  }));
}

export function demoAnomalyTweet(market: MarketSignal, reason: string): Tweet {
  const text = `Alert: ${market.title} looks unusual (anomaly=${market.anomalyScore.toFixed(2)}). ${reason} ${market.url}`;
  return { text: text.slice(0, 240) };
}

