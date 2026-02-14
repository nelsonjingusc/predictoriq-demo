/**
 * Common types for market data across platforms
 */

export interface Market {
    platform: 'POLYMARKET' | 'KALSHI';
    market_id: string;
    event_id?: string;
    title: string;
    category: string;
    mid_price: number;
    outcomeLabel?: string; // e.g. "Yes", "No", "Trump"
    volume_24h: number;
    liquidity: number;
    status: 'active' | 'closed' | 'resolved';
    url: string;
    created_at: string;
    updated_at: string;
}

export interface Top10Response {
    items: Market[];
    categories: string[];
    generated_at: string;
    metadata: {
        total_markets_analyzed: number;
        platforms_covered: string[];
        cache_age_minutes: number;
    };
}
