export interface WalletStats {
  address: string;
  totalMarkets: number;
  
  // Win/Loss Stats
  winRate: number; // 0-1
  lossRate: number; // 0-1
  totalPositions: number;
  winningPositions: number;
  losingPositions: number;
  breakEvenPositions: number;
  
  // P&L Stats
  totalPnL: number; // USD (realized + unrealized)
  realizedPnL: number; // USD
  unrealizedPnL: number; // USD
  totalInvested: number; // USD
  roi: number; // Return on Investment (%)
  
  // Position Stats
  avgPositionSize: number; // USD
  largestWin: number; // USD
  largestLoss: number; // USD
  
  // Trading Stats
  totalTrades: number;
  buyVolume: number; // USD
  sellVolume: number; // USD
  
  favoriteCategories: string[];
  notableBehaviors: string[];
}

export interface WalletSummary {
  address: string;
  stats: WalletStats;
  summary: string; // LLM-generated plain English
}
