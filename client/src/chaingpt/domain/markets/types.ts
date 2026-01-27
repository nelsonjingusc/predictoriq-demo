export type CapitalQuality = 'high' | 'medium' | 'low';
export type LiquidityLevel = 'low' | 'medium' | 'high';

export interface MarketSignal {
  marketId: string;
  title: string;
  url: string;
  venue: string;

  impliedProbMarket: number; // 0..1
  impliedProbOptions: number; // 0..1
  mispricing: number; // (market - options), in probability points (e.g. +0.12 = +12pp)

  capitalQualityYes: CapitalQuality;
  capitalQualityNo: CapitalQuality;
  anomalyScore: number; // 0..1
  liquidityLevel: LiquidityLevel;
}

export type MarketStance = 'long_yes' | 'long_no' | 'neutral' | 'avoid';

export interface MarketExplanation {
  stance: MarketStance;
  summary: string; // 2–4 sentences
}

export interface ResearchNote {
  generatedAt: string; // ISO timestamp
  markdown: string;
}

