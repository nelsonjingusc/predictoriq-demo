/**
 * Polymarket Data API Client
 * Docs: https://docs.polymarket.com/api-reference/core
 * Base URL: https://data-api.polymarket.com
 */

const POLYMARKET_API_BASE = 'https://data-api.polymarket.com';

export interface PolymarketTrade {
  id: string;
  side: 'BUY' | 'SELL';
  asset: string;
  conditionId: string;
  size: string;
  price: string;
  timestamp: string;
  title: string;
  outcome: string;
  market: string;
  eventId: string;
}

export interface PolymarketPosition {
  id: string;
  market: string;
  conditionId: string;
  title: string;
  outcome: string;
  size: string;
  avgPrice: string;
  currentValue: string;
  cashPnl: string;
  percentPnl: string;
  realizedPnl: string;
  redeemable: boolean;
  mergeable: boolean;
}

export interface PolymarketActivity {
  id: string;
  type: 'TRADE' | 'SPLIT' | 'MERGE' | 'REDEEM' | 'REWARD' | 'CONVERSION' | 'MAKER_REBATE';
  timestamp: string;
  user: string;
  market?: string;
  conditionId?: string;
  title?: string;
  outcome?: string;
  amount?: string;
  price?: string;
  side?: 'BUY' | 'SELL';
}

/**
 * Get trades for a user
 * Endpoint: GET /trades
 */
export async function getPolymarketTrades(
  userAddress: string,
  options?: {
    limit?: number;
    offset?: number;
    side?: 'BUY' | 'SELL';
  }
): Promise<PolymarketTrade[]> {
  const params = new URLSearchParams({
    user: userAddress,
    limit: String(options?.limit || 100),
    offset: String(options?.offset || 0),
  });
  if (options?.side) params.set('side', options.side);

  const url = `${POLYMARKET_API_BASE}/trades?${params}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get current positions for a user
 * Endpoint: GET /positions
 */
export async function getPolymarketPositions(
  userAddress: string,
  options?: {
    limit?: number;
    offset?: number;
    sizeThreshold?: number;
  }
): Promise<PolymarketPosition[]> {
  const params = new URLSearchParams({
    user: userAddress,
    limit: String(options?.limit || 100),
    offset: String(options?.offset || 0),
    sizeThreshold: String(options?.sizeThreshold || 0.01),
  });

  const url = `${POLYMARKET_API_BASE}/positions?${params}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get user activity (trades, splits, merges, redeems, rewards)
 * Endpoint: GET /activity
 */
export async function getPolymarketActivity(
  userAddress: string,
  options?: {
    limit?: number;
    offset?: number;
    type?: string;
  }
): Promise<PolymarketActivity[]> {
  const params = new URLSearchParams({
    user: userAddress,
    limit: String(options?.limit || 100),
    offset: String(options?.offset || 0),
  });
  if (options?.type) params.set('type', options.type);

  const url = `${POLYMARKET_API_BASE}/activity?${params}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get market details by condition ID
 * Endpoint: CLOB /markets/{condition_id}
 */
export async function getPolymarketMarket(conditionId: string): Promise<any> {
  const url = `https://clob.polymarket.com/markets/${conditionId}`;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } }); // Cache for 1 hour

  if (!res.ok) {
    // Fallback or just return null?
    console.warn(`Failed to fetch market ${conditionId}: ${res.status}`);
    return null;
  }

  return res.json();
}
