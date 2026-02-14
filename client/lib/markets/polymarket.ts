/**
 * Polymarket API integration
 * Fetches active events from Polymarket Gamma API
 */

import type { Market } from './types';

const POLYMARKET_API = 'https://gamma-api.polymarket.com';

interface PolymarketEvent {
    id: string;
    title: string;
    slug: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    image?: string;
    icon?: string;
    active: boolean;
    closed: boolean;
    archived: boolean;
    new: boolean;
    featured: boolean;
    restricted: boolean;
    liquidity: number;
    volume: number;
    volume24hr: number;
    openInterest: number;
    createdAt: string;
    updatedAt?: string;
    markets: PolymarketMarket[];
    tags?: Array<{
        id: string;
        label: string;
        slug: string;
    }>;
}

interface PolymarketMarket {
    id: string;
    question: string;
    outcomes: string[];
    outcomePrices: string[];
    volume: string;
    liquidity: string;
    active: boolean;
    closed: boolean;
}

/**
 * Fetch active events from Polymarket
 */
export async function fetchPolymarketMarkets(): Promise<Market[]> {
    try {
        console.log('[Polymarket] Fetching events...');

        const url = `${POLYMARKET_API}/events?closed=false&limit=100&order=volume&ascending=false`;
        console.log('[Polymarket] URL:', url);

        // Use /events endpoint with proper parameters
        // Disable Next.js caching
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
            // Disable Next.js caching
            cache: 'no-store',
            // Add timeout
            signal: AbortSignal.timeout(15000),
        });

        console.log('[Polymarket] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Polymarket] API error response:', errorText);
            throw new Error(`Polymarket API error: ${response.status}`);
        }

        const events: PolymarketEvent[] = await response.json();

        console.log(`[Polymarket] Fetched ${events.length} events`);

        if (events.length > 0) {
            console.log('[Polymarket] First event sample:', {
                id: events[0].id,
                title: events[0].title,
                volume24hr: events[0].volume24hr,
                marketsCount: events[0].markets?.length || 0,
            });
        }

        // Filter active events
        const activeEvents = events.filter(e => {
            if (!e.active || e.closed || e.archived) return false;
            if (e.endDate) {
                const endDate = new Date(e.endDate);
                if (endDate < new Date()) return false;
            }
            return true;
        });

        console.log(`[Polymarket] After filtering: ${activeEvents.length} active events`);

        // Transform events to markets
        const markets: Market[] = [];
        for (const event of activeEvents) {
            // Use the primary market from the event
            if (event.markets && event.markets.length > 0) {
                const primaryMarket = event.markets[0];
                markets.push(transformPolymarketEvent(event, primaryMarket));
            } else {
                // If no markets array, create from event data
                markets.push(transformPolymarketEventOnly(event));
            }
        }

        // Filter by volume
        const withVolume = markets.filter(m => m.volume_24h > 0);
        console.log(`[Polymarket] After volume filter: ${withVolume.length} markets`);

        return withVolume;
    } catch (error) {
        console.error('[Polymarket] Fetch error:', error);
        if (error instanceof Error) {
            console.error('[Polymarket] Error message:', error.message);
            console.error('[Polymarket] Error stack:', error.stack);
        }
        return [];
    }
}

/**
 * Transform Polymarket event + market to common format
 */
function transformPolymarketEvent(event: PolymarketEvent, market: PolymarketMarket): Market {
    // Calculate mid price from outcome prices
    const prices = market.outcomePrices.map(p => parseFloat(p));
    const midPrice = prices.length > 0 ? prices[0] : 0.5;

    // Get category from tags
    const category = event.tags && event.tags.length > 0
        ? normalizeCategory(event.tags[0].label)
        : 'Other';

    return {
        platform: 'POLYMARKET',
        market_id: market.id,
        event_id: event.id,
        title: event.title,
        category,
        mid_price: midPrice,
        volume_24h: event.volume24hr || 0,
        liquidity: event.liquidity || 0,
        status: event.active && !event.closed ? 'active' : 'closed',
        url: `https://polymarket.com/event/${event.slug}`,
        created_at: event.createdAt || new Date().toISOString(),
        updated_at: event.updatedAt || new Date().toISOString(),
    };
}

/**
 * Transform Polymarket event without market data
 */
function transformPolymarketEventOnly(event: PolymarketEvent): Market {
    const category = event.tags && event.tags.length > 0
        ? normalizeCategory(event.tags[0].label)
        : 'Other';

    return {
        platform: 'POLYMARKET',
        market_id: event.id,
        event_id: event.id,
        title: event.title,
        category,
        mid_price: 0.5, // Default
        volume_24h: event.volume24hr || 0,
        liquidity: event.liquidity || 0,
        status: event.active && !event.closed ? 'active' : 'closed',
        url: `https://polymarket.com/event/${event.slug}`,
        created_at: event.createdAt || new Date().toISOString(),
        updated_at: event.updatedAt || new Date().toISOString(),
    };
}

/**
 * Normalize category names for consistency
 */
function normalizeCategory(category: string): string {
    const normalized = category.trim();

    const categoryMap: Record<string, string> = {
        'crypto': 'Crypto',
        'cryptocurrency': 'Crypto',
        'bitcoin': 'Crypto',
        'politics': 'Politics',
        'political': 'Politics',
        'election': 'Politics',
        'elections': 'Politics',
        'world elections': 'Politics',
        'us elections': 'Politics',
        'sports': 'Sports',
        'sport': 'Sports',
        'nfl': 'Sports',
        'nba': 'Sports',
        'business': 'Business',
        'finance': 'Business',
        'economics': 'Economics',
        'economy': 'Economics',
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
 * Extract unique categories from Polymarket markets
 */
export function extractPolymarketCategories(markets: Market[]): string[] {
    const categories = new Set(markets.map(m => m.category));
    return Array.from(categories).sort();
}
