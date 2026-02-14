/**
 * Kalshi API integration
 * Fetches active markets from Kalshi
 */

import type { Market } from './types';

const KALSHI_API = 'https://api.elections.kalshi.com/trade-api/v2';

interface KalshiMarket {
    ticker: string;
    event_ticker: string;
    title: string;
    category: string;
    yes_bid: number;
    yes_ask: number;
    volume: number;
    open_interest: number;
    status: string;
    close_time: string;
    created_time: string;
    last_updated: string;
}

interface KalshiResponse {
    markets: KalshiMarket[];
    cursor?: string;
}

/**
 * Fetch active markets from Kalshi
 */
export async function fetchKalshiMarkets(): Promise<Market[]> {
    try {
        console.log('[Kalshi] Fetching markets...');

        const apiKey = process.env.KALSHI_API_KEY;
        const headers: HeadersInit = {
            'Accept': 'application/json',
        };

        // Add API key if available
        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        }

        const response = await fetch(
            `${KALSHI_API}/markets?limit=100&status=open`,
            {
                headers,
                signal: AbortSignal.timeout(10000),
            }
        );

        if (!response.ok) {
            // If 401, API key might be required
            if (response.status === 401) {
                console.warn('[Kalshi] API key required but not provided');
                return [];
            }
            throw new Error(`Kalshi API error: ${response.status}`);
        }

        const data: KalshiResponse = await response.json();
        const markets = data.markets || [];

        console.log(`[Kalshi] Fetched ${markets.length} markets`);

        // Transform to common format
        return markets
            .filter(m => m.status === 'open')
            .map(transformKalshiMarket)
            .filter(m => m.volume_24h > 0); // Only include markets with volume
    } catch (error) {
        console.error('[Kalshi] Fetch error:', error);
        return []; // Return empty array on error, don't crash
    }
}

/**
 * Transform Kalshi market to common format
 */
function transformKalshiMarket(km: KalshiMarket): Market {
    // Calculate mid price from bid/ask
    const midPrice = (km.yes_bid + km.yes_ask) / 2 / 100; // Kalshi uses cents

    // Estimate liquidity from open interest
    const liquidity = km.open_interest * 100; // Rough estimate

    return {
        platform: 'KALSHI',
        market_id: km.ticker,
        event_id: km.event_ticker,
        title: km.title,
        category: normalizeCategory(km.category || 'Other'),
        mid_price: midPrice,
        volume_24h: km.volume || 0,
        liquidity: liquidity,
        status: km.status === 'open' ? 'active' : 'closed',
        url: `https://kalshi.com/markets/${km.ticker}`,
        created_at: km.created_time || new Date().toISOString(),
        updated_at: km.last_updated || new Date().toISOString(),
    };
}

/**
 * Normalize category names for consistency
 */
function normalizeCategory(category: string): string {
    const normalized = category.trim();

    // Map common variations to standard names
    const categoryMap: Record<string, string> = {
        'crypto': 'Crypto',
        'cryptocurrency': 'Crypto',
        'bitcoin': 'Crypto',
        'politics': 'Politics',
        'political': 'Politics',
        'election': 'Politics',
        'elections': 'Politics',
        'sports': 'Sports',
        'sport': 'Sports',
        'nfl': 'Sports',
        'nba': 'Sports',
        'business': 'Business',
        'finance': 'Business',
        'economics': 'Economics',
        'economy': 'Economics',
        'macro': 'Economics',
        'technology': 'Technology',
        'tech': 'Technology',
        'ai': 'Technology',
        'entertainment': 'Entertainment',
        'pop culture': 'Entertainment',
        'weather': 'Weather',
        'climate': 'Climate',
    };

    const lower = normalized.toLowerCase();
    return categoryMap[lower] || normalized;
}

/**
 * Extract unique categories from Kalshi markets
 */
export function extractKalshiCategories(markets: Market[]): string[] {
    const categories = new Set(markets.map(m => m.category));
    return Array.from(categories).sort();
}
