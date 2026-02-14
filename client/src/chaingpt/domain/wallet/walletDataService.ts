
import type { WalletStats } from './types';
import {
  getPolymarketTrades,
  getPolymarketPositions,
  getPolymarketActivity,
  getPolymarketMarket,
  type PolymarketTrade,
  type PolymarketPosition,
} from '../../lib/polymarketClient';

/**
 * Fetch real wallet stats from Polymarket API
 */
export async function getWalletStats(address: string): Promise<WalletStats> {
  try {
    // Fetch trades, positions, and activity in parallel
    // Activity API gives us historical closed positions that positions API doesn't return
    // increased limit to 5000 by paginating requests (API limit is 1000 per request)
    const [trades, positions, activity] = await Promise.all([
      fetchAllItems(getPolymarketTrades, address, 5000),
      getPolymarketPositions(address, { limit: 100, sizeThreshold: 0 }), // Include all positions
      fetchAllItems(getPolymarketActivity, address, 5000), // Get ALL activity (Trades, Redeems, Merges)
    ]);

    // Fetch details for "Ghost Positions" (trades that imply a position but are not in open positions)
    // This happens for resolved markets where the user held to expiry (redeemed automatically or manually)
    // but the API activity/trades doesn't show the redemption clearly or we missed it.
    const openConditionIds = new Set(positions.map((p) => p.conditionId));
    const ghostConditionIds = new Set<string>();

    // Group trades to find net long positions not in open positions
    const marketTradeMap = new Map<string, { buys: number; sells: number }>();
    for (const trade of trades) {
      if (!marketTradeMap.has(trade.conditionId)) {
        marketTradeMap.set(trade.conditionId, { buys: 0, sells: 0 });
      }
      const entry = marketTradeMap.get(trade.conditionId)!;
      if (trade.side === 'BUY') entry.buys += parseFloat(trade.size);
      else entry.sells += parseFloat(trade.size);
    }

    for (const [conditionId, data] of marketTradeMap) {
      if (!openConditionIds.has(conditionId) && data.buys > data.sells + 0.1) {
        ghostConditionIds.add(conditionId);
      }
    }

    // Fetch markets for ghosts
    const ghostMarkets = new Map<string, any>();
    if (ghostConditionIds.size > 0) {
      // Limit to 50 to avoid spamming API if there are too many
      const idsToFetch = Array.from(ghostConditionIds).slice(0, 50);
      const marketPromises = idsToFetch.map(id => getPolymarketMarket(id));
      const markets = await Promise.all(marketPromises);

      markets.forEach((m, index) => {
        if (m && m.condition_id) {
          ghostMarkets.set(m.condition_id, m);
        }
      });
    }

    // Calculate stats including historical data
    const stats = calculateWalletStats(address, trades, positions, activity, ghostMarkets);
    return stats;
  } catch (err: any) {
    // If Polymarket API fails, throw error
    throw new Error(`Failed to fetch wallet data from Polymarket: ${err.message} `);
  }
}

function calculateWalletStats(
  address: string,
  trades: PolymarketTrade[],
  positions: PolymarketPosition[],
  activity: any[],
  ghostMarkets?: Map<string, any>
): WalletStats {
  // Get unique markets from both trades and positions (use conditionId as unique identifier)
  const uniqueMarkets = new Set([
    ...trades.map((t) => t.conditionId),
    ...positions.map((p) => p.conditionId),
  ]);
  const totalMarkets = uniqueMarkets.size;

  // Calculate detailed P&L stats from ALL positions (open + closed)
  let totalRealizedPnL = 0;
  let totalUnrealizedPnL = 0;
  let totalInvested = 0;
  let largestWin = 0;
  let largestLoss = 0;

  // Track processed condition IDs to avoid double counting
  const processedConditionIds = new Set<string>();

  // Analyze ALL open positions (including those with size > 0)
  let winningCount = 0;
  let losingCount = 0;
  let breakEvenCount = 0;

  for (const p of positions) {
    processedConditionIds.add(p.conditionId);

    const realized = parseFloat(p.realizedPnl || '0');
    const unrealized = parseFloat(p.cashPnl || '0');
    const totalPnl = realized + unrealized;
    // Calculate initial value from current value and P&L
    const currentValue = parseFloat(p.currentValue || '0');
    const initialValue = currentValue - unrealized;

    totalRealizedPnL += realized;
    totalUnrealizedPnL += unrealized;
    totalInvested += Math.abs(initialValue);

    if (totalPnl > 0.01) { // Small threshold to avoid rounding errors
      winningCount++;
      largestWin = Math.max(largestWin, totalPnl);
    } else if (totalPnl < -0.01) {
      losingCount++;
      largestLoss = Math.min(largestLoss, totalPnl);
    } else {
      breakEvenCount++;
    }
  }

  // Calculate historical win rate AND P&L from trades
  // Group trades by market to estimate historical positions and P&L
  const marketTradeMap = new Map<string, { buys: number; sells: number; buyValue: number; sellValue: number; conditionId: string; outcome: string }>();

  for (const trade of trades) {
    const key = `${trade.conditionId}-${trade.outcome}`;
    if (!marketTradeMap.has(key)) {
      marketTradeMap.set(key, { buys: 0, sells: 0, buyValue: 0, sellValue: 0, conditionId: trade.conditionId, outcome: trade.outcome });
    }
    const entry = marketTradeMap.get(key)!;

    if (trade.side === 'BUY') {
      entry.buys += parseFloat(trade.size);
      entry.buyValue += parseFloat(trade.size) * parseFloat(trade.price);
    } else {
      entry.sells += parseFloat(trade.size);
      entry.sellValue += parseFloat(trade.size) * parseFloat(trade.price);
    }
  }

  // Pre-process activity for Redemptions and Merges
  const redemptionMap = new Map<string, { amount: number; value: number }>();
  for (const item of activity) {
    if (item.type === 'REDEEM' || item.type === 'MERGE') {
      if (item.conditionId) {
        const current = redemptionMap.get(item.conditionId) || { amount: 0, value: 0 };
        // Use usdcSize if available (most reliable for redeems), else value/usdcValue
        // 'size' in redeem usually matches shares redeemed
        const size = parseFloat(item.size || '0');
        const val = parseFloat(item.usdcSize || item.value || item.usdcValue || '0');

        current.amount += size;
        current.value += val;
        redemptionMap.set(item.conditionId, current);
      }
    }
  }

  // Estimate historical closed positions (where sells > 0 OR ghost positions)
  let historicalWins = 0;
  let historicalLosses = 0;

  for (const [key, data] of marketTradeMap) {
    // Add redemption data if available
    const redemption = redemptionMap.get(data.conditionId);
    let totalSells = data.sells;
    let totalSellValue = data.sellValue;

    if (redemption) {
      totalSells += redemption.amount;
      totalSellValue += redemption.value;
    }

    // Only process if we haven't already processed this market via the positions endpoint
    // AND if there's actual activity
    if (data.buys > 0) {
      const isOpenPosition = processedConditionIds.has(data.conditionId);

      // If it's NOT an open position, we need to calculate its realized P&L from trading history
      if (!isOpenPosition) {
        if (totalSells > 0) {
          // Calculate realized P&L for the closed portion (manually sold)
          const closedSize = Math.min(data.buys, totalSells);
          const avgBuyPrice = data.buys > 0 ? data.buyValue / data.buys : 0;
          const avgSellPrice = totalSells > 0 ? totalSellValue / totalSells : 0;

          const realizedPnl = (avgSellPrice - avgBuyPrice) * closedSize;
          totalRealizedPnL += realizedPnl;

          // Update win/loss counts for this historical position
          if (realizedPnl > 0.01) {
            historicalWins++;
            largestWin = Math.max(largestWin, realizedPnl);
          } else if (realizedPnl < -0.01) {
            historicalLosses++;
            largestLoss = Math.min(largestLoss, realizedPnl);
          }
        }

        // Check for GHOST POSITION (held to expiry/redemption)
        // If we still have remaining shares (buys > totalSells) and it's not open, it's likely resolved
        const remainingShares = data.buys - totalSells;
        if (remainingShares > 0.1 && ghostMarkets && ghostMarkets.has(data.conditionId)) {
          const market = ghostMarkets.get(data.conditionId);
          // Calculate P&L based on resolution
          const avgBuyPrice = data.buys > 0 ? data.buyValue / data.buys : 0;
          const costBasis = remainingShares * avgBuyPrice;

          let payout = 0;
          if (market.tokens) {
            const winningToken = market.tokens.find((t: any) => t.winner);
            if (winningToken && winningToken.outcome === data.outcome) {
              // User held the winner!
              payout = remainingShares * 1.0;
            }
          }

          const realizedPnl = payout - costBasis;
          totalRealizedPnL += realizedPnl;

          if (realizedPnl > 0.01) {
            historicalWins++;
            largestWin = Math.max(largestWin, realizedPnl);
          } else if (realizedPnl < -0.01) {
            historicalLosses++;
            largestLoss = Math.min(largestLoss, realizedPnl);
          }
        }
      }
    }
  }

  // Calculate overall win rate (current + historical closed)
  const totalHistoricalPositions = historicalWins + historicalLosses;
  const totalAllPositions = winningCount + losingCount + breakEvenCount + totalHistoricalPositions;
  const totalWinningPositions = winningCount + historicalWins;
  const totalLosingPositions = losingCount + historicalLosses;

  const winRate = totalAllPositions > 0 ? totalWinningPositions / totalAllPositions : 0;
  const lossRate = totalAllPositions > 0 ? totalLosingPositions / totalAllPositions : 0;
  const totalPnL = totalRealizedPnL + totalUnrealizedPnL;
  const roi = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  // Get favorite categories (extract from market titles from both trades and positions)
  const categoryMap = new Map<string, number>();
  for (const trade of trades) {
    const category = extractCategory(trade.title);
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  }
  for (const position of positions) {
    const category = extractCategory(position.title);
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  }
  const favoriteCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat]) => cat)
    .filter((cat) => cat !== 'Other'); // Remove 'Other' if there are specific categories

  // If all categories are 'Other', keep it
  if (favoriteCategories.length === 0) {
    favoriteCategories.push('Other');
  }

  // Calculate trading volume stats
  let buyVolume = 0;
  let sellVolume = 0;
  for (const trade of trades) {
    const volume = parseFloat(trade.size) * parseFloat(trade.price);
    if (trade.side === 'BUY') {
      buyVolume += volume;
    } else {
      sellVolume += volume;
    }
  }

  const totalVolume = buyVolume + sellVolume;
  const avgPositionSize = trades.length > 0 ? totalVolume / trades.length : 0;

  // Detect notable behaviors
  const notableBehaviors = detectBehaviors(trades, positions);

  return {
    address,
    totalMarkets,

    // Win/Loss Stats (includes historical + current)
    winRate,
    lossRate,
    totalPositions: totalAllPositions,
    winningPositions: totalWinningPositions,
    losingPositions: totalLosingPositions,
    breakEvenPositions: breakEvenCount,

    // P&L Stats
    totalPnL,
    realizedPnL: totalRealizedPnL,
    unrealizedPnL: totalUnrealizedPnL,
    totalInvested,
    roi,

    // Position Stats
    avgPositionSize,
    largestWin,
    largestLoss,

    // Trading Stats
    totalTrades: trades.length,
    buyVolume,
    sellVolume,

    favoriteCategories,
    notableBehaviors,
  };
}

function extractCategory(title: string): string {
  const lower = title.toLowerCase();

  if (lower.includes('trump') || lower.includes('biden') || lower.includes('election') || lower.includes('president')) {
    return 'Politics';
  }
  if (lower.includes('bitcoin') || lower.includes('eth') || lower.includes('crypto') || lower.includes('btc')) {
    return 'Crypto';
  }
  if (lower.includes('nfl') || lower.includes('nba') || lower.includes('soccer') || lower.includes('football')) {
    return 'Sports';
  }
  if (lower.includes('taylor swift') || lower.includes('celebrity') || lower.includes('movie') || lower.includes('music')) {
    return 'Pop Culture';
  }
  if (lower.includes('science') || lower.includes('research') || lower.includes('discovery')) {
    return 'Science';
  }
  if (lower.includes('business') || lower.includes('economy') || lower.includes('stock') || lower.includes('company')) {
    return 'Business';
  }

  return 'Other';
}

function detectBehaviors(trades: PolymarketTrade[], positions: PolymarketPosition[]): string[] {
  const behaviors: string[] = [];

  // Check if user is an early trader
  const sortedTrades = [...trades].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const earlyTrades = sortedTrades.slice(0, Math.min(10, sortedTrades.length));
  const earlyWins = earlyTrades.filter((t) => {
    const pos = positions.find((p) => p.conditionId === t.conditionId);
    return pos && parseFloat(pos.realizedPnl || '0') > 0;
  });
  if (earlyWins.length / earlyTrades.length > 0.6) {
    behaviors.push('Often early on winning side');
  }

  // Check holding duration
  const avgHoldingTime = calculateAvgHoldingTime(trades);
  if (avgHoldingTime > 7 * 24 * 60 * 60 * 1000) {
    behaviors.push('Tends to hold positions longer than average');
  } else if (avgHoldingTime < 24 * 60 * 60 * 1000) {
    behaviors.push('Active day trader with quick position flips');
  }

  // Check for high-liquidity preference
  const highLiquidityMarkets = positions.filter((p) => parseFloat(p.currentValue) > 1000);
  if (highLiquidityMarkets.length / positions.length > 0.7) {
    behaviors.push('Prefers high-liquidity markets');
  }

  // Check trading time patterns
  const usHoursTrades = trades.filter((t) => {
    const hour = new Date(t.timestamp).getUTCHours();
    return hour >= 13 && hour <= 23; // 9am-7pm ET
  });
  if (usHoursTrades.length / trades.length > 0.7) {
    behaviors.push('Active during US market hours');
  }

  // Check diversification
  const uniqueMarkets = new Set(trades.map((t) => t.market));
  if (uniqueMarkets.size > 20) {
    behaviors.push('Diversified across multiple markets');
  }

  // Check for contrarian behavior
  const buyTrades = trades.filter((t) => t.side === 'BUY');
  const lowPriceBuys = buyTrades.filter((t) => parseFloat(t.price) < 0.3);
  if (lowPriceBuys.length / buyTrades.length > 0.5) {
    behaviors.push('Contrarian trader - often bets against consensus');
  }

  return behaviors.slice(0, 5); // Return top 5 behaviors
}

function calculateAvgHoldingTime(trades: PolymarketTrade[]): number {
  // Group trades by market
  const marketTrades = new Map<string, PolymarketTrade[]>();
  for (const trade of trades) {
    const key = `${trade.market} -${trade.outcome} `;
    if (!marketTrades.has(key)) marketTrades.set(key, []);
    marketTrades.get(key)!.push(trade);
  }

  let totalHoldingTime = 0;
  let count = 0;

  for (const [_, marketTradeList] of marketTrades) {
    const sorted = marketTradeList.sort((a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (sorted.length >= 2) {
      const firstBuy = sorted.find((t) => t.side === 'BUY');
      const firstSell = sorted.find((t) => t.side === 'SELL');

      if (firstBuy && firstSell) {
        const holdingTime = new Date(firstSell.timestamp).getTime() - new Date(firstBuy.timestamp).getTime();
        totalHoldingTime += holdingTime;
        count++;
      }
    }
  }

  return count > 0 ? totalHoldingTime / count : 0;
}

/**
 * Helper to fetch items with pagination
 */
async function fetchAllItems<T>(
  fetchFn: (address: string, options: any) => Promise<T[]>,
  address: string,
  limit: number,
  extraOptions: any = {}
): Promise<T[]> {
  let allItems: T[] = [];
  let offset = 0;
  const batchSize = 1000; // API limit

  while (allItems.length < limit) {
    try {
      const items = await fetchFn(address, {
        ...extraOptions,
        limit: batchSize,
        offset,
      });

      if (!items || items.length === 0) break;

      allItems = [...allItems, ...items];
      offset += batchSize;

      if (items.length < batchSize) break; // End of data

      // Add a small delay to respect API rate limits (200ms)
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err) {
      console.warn(`Failed to fetch batch at offset ${offset}: `, err);
      break;
    }
  }

  return allItems.slice(0, limit);
}
