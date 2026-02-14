import type { WalletStats } from './types';

/**
 * Mock wallet stats generator for PoC.
 * In production, this would call Polymarket API or our backend.
 */
export function getMockWalletStats(address: string): WalletStats {
  // Generate deterministic but varied stats based on address hash
  const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = hash % 100;

  const categories = ['Politics', 'Crypto', 'Sports', 'Pop Culture', 'Science'];
  const behaviors = [
    'Often early on winning side',
    'Tends to hold positions longer than average',
    'Prefers high-liquidity markets',
    'Active during US market hours',
    'Diversified across multiple categories',
  ];

  const totalMarkets = 15 + (seed % 50);
  const winRate = 0.45 + (seed % 30) / 100;
  const lossRate = 1 - winRate;
  const totalPositions = 20 + (seed % 80);
  const winningPositions = Math.floor(totalPositions * winRate);
  const losingPositions = Math.floor(totalPositions * lossRate);
  const breakEvenPositions = totalPositions - winningPositions - losingPositions;
  const realizedPnL = -500 + seed * 100;
  const unrealizedPnL = 1000 + (seed % 5000) - 2500;
  const totalPnL = realizedPnL + unrealizedPnL;
  const totalInvested = 50000 + (seed % 100000);
  const roi = (totalPnL / totalInvested) * 100;
  const avgPositionSize = 100 + seed * 10;
  const largestWin = avgPositionSize * 5;
  const largestLoss = avgPositionSize * -3;
  const totalTrades = 100 + (seed % 400);
  const buyVolume = totalInvested * 0.6;
  const sellVolume = totalInvested * 0.4;

  return {
    address,
    totalMarkets,
    winRate,
    lossRate,
    totalPositions,
    winningPositions,
    losingPositions,
    breakEvenPositions,
    totalPnL,
    realizedPnL,
    unrealizedPnL,
    totalInvested,
    roi,
    avgPositionSize,
    largestWin,
    largestLoss,
    totalTrades,
    buyVolume,
    sellVolume,
    favoriteCategories: categories.slice(0, 2 + (seed % 3)),
    notableBehaviors: behaviors.slice(0, 2 + (seed % 3)),
  };
}
