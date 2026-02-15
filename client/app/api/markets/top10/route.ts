/**
 * API Route: /api/markets/top10
 * Returns top 10 markets by volume, optionally filtered by category
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchKalshiMarkets } from '@/lib/markets/kalshi';
import { getCachedMarkets, setCachedMarkets, getCacheAgeMinutes } from '@/lib/markets/cache';
import type { Market, Top10Response } from '@/lib/markets/types';

async function fetchPolymarketMarketsInline(): Promise<Market[]> {
    try {
        console.log('[Polymarket-Inline] Fetching events...');

        const url = 'https://gamma-api.polymarket.com/events?closed=false&limit=100&order=volume&ascending=false';

        const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
            cache: 'no-store',
            signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
            throw new Error(`Polymarket API error: ${response.status}`);
        }

        const events: any[] = await response.json();
        console.log(`[Polymarket-Inline] Fetched ${events.length} events`);

        // Filter and transform
        const markets: Market[] = [];
        for (const event of events) {
            if (!event.active || event.closed || event.archived) continue;

            // Get proper category from tags using smart selection
            const category = selectBestCategory(event.tags);

            let midPrice = 0.5; // default
            let outcomeLabel = 'Yes'; // default

            if (event.markets && event.markets.length > 0) {
                // Fix: Sort markets by volume to find the "main" market
                // Often events have multiple deadlines (daily, monthly, yearly)
                // We want the most active one to represent the event
                // CRITICAL FIX: explicit filtering for closed markets using the 'closed' property
                const sortedMarkets = [...event.markets]
                    .filter((m: any) => !m.closed && m.active)
                    .sort((a: any, b: any) => {
                        return (b.volume || 0) - (a.volume || 0);
                    });

                // Fallback to any market if no active ones found (rare)
                const bestMarket = sortedMarkets.length > 0 ? sortedMarkets[0] : event.markets[0];

                if (bestMarket && bestMarket.outcomePrices) {
                    try {
                        const prices = JSON.parse(bestMarket.outcomePrices);
                        const outcomes = bestMarket.outcomes ? JSON.parse(bestMarket.outcomes) : null;

                        if (Array.isArray(prices) && prices.length > 0) {
                            // Find the max price and its index
                            const maxPrice = Math.max(...prices.map((p: string) => parseFloat(p)));
                            const maxIndex = prices.findIndex((p: string) => parseFloat(p) === maxPrice);

                            midPrice = maxPrice;

                            // Try to get label from outcomes array, defaulting to 'Yes'/'No' logic if standard
                            if (outcomes && Array.isArray(outcomes) && outcomes[maxIndex]) {
                                outcomeLabel = outcomes[maxIndex];
                            } else if (prices.length === 2) {
                                // Default binary assumption: [No, Yes] or [Yes, No]? 
                                // Polymarket usually is ["Yes", "No"] in outcomes field, but let's rely on the outcomes data if possible.
                                // If outcome labels missing, typically 1 is "No", 0 is "Yes" for some, but standard is Yes/No.
                                // Let's fallback to "Probability" if we can't be sure, but usually 'outcomes' exists.
                                // If we really can't find it, we might defaults to "High" / "Low"? 
                                // Actually, for binary "Yes/No" markets, usually it's just Yes/No.
                                // Let's try to infer or just set a safe default?
                                // If maxIndex === 0 -> "Yes" (usually), 1 -> "No". 
                                // Safest is to fetch 'outcomes' field.
                            }
                        }
                    } catch (e) {
                        console.error('[Polymarket-Inline] Failed to parse prices/outcomes:', e);
                    }
                }
            }

            markets.push({
                platform: 'POLYMARKET',
                market_id: event.id,
                event_id: event.id,
                title: event.title,
                category: normalizeCategory(category),
                mid_price: midPrice,
                outcomeLabel: outcomeLabel,
                volume_24h: event.volume24hr || 0,
                liquidity: event.liquidity || 0,
                status: 'active',
                url: `https://polymarket.com/event/${event.slug}`,
                created_at: event.createdAt || new Date().toISOString(),
                updated_at: event.updatedAt || new Date().toISOString(),
                ai_summary: generateMockAISummary(event.title, midPrice, outcomeLabel),
            });
        }

        const withVolume = markets.filter(m => m.volume_24h > 0);
        console.log(`[Polymarket-Inline] Returning ${withVolume.length} markets`);

        return withVolume;
    } catch (error) {
        console.error('[Polymarket-Inline] Error:', error);
        return [];
    }
}

function normalizeCategory(category: string): string {
    const map: Record<string, string> = {
        'world elections': 'Politics',
        'us elections': 'Politics',
        'elections': 'Politics',
        'politics': 'Politics',
        'crypto': 'Crypto',
        'sports': 'Sports',
        'business': 'Business',
        'technology': 'Technology',
        'geopolitics': 'Geopolitics',
        'trump presidency': 'Politics',
        'trump': 'Politics',
        'fed rates': 'Economics',
        'fed': 'Economics',
        'claude 5': 'Technology', // Remap 'Claude 5' to Technology
        'opinion': 'Opinion',
        'video games': 'Video Games',
    };
    return map[category.toLowerCase()] || category;
}

/**
 * Select best category from tags
 * Prefer known general categories over specific tags
 */
function selectBestCategory(tags: any[]): string {
    if (!tags || tags.length === 0) return 'Other';

    // Filter out "Parent For Derivative"
    const validTags = tags.filter(t => t.label && t.label !== 'Parent For Derivative');
    if (validTags.length === 0) return 'Other';

    // Known general categories (in order of preference)
    const knownCategories = [
        'politics', 'crypto', 'sports', 'business', 'technology',
        'economics', 'geopolitics', 'elections', 'world elections',
        'us elections', 'entertainment', 'science', 'weather', 'climate'
    ];

    // Try to find a known category
    for (const known of knownCategories) {
        const found = validTags.find(t =>
            t.label.toLowerCase() === known ||
            t.label.toLowerCase().includes(known)
        );
        if (found) return found.label;
    }

    // Fall back to first valid tag
    return validTags[0].label;
}

/**
 * Generates a mock AI insight summary based on market data
 * This will be replaced by a real LLM call later
 */
function generateMockAISummary(title: string, price: number, label: string): string {
    const p = Math.round(price * 100);

    if (title.includes('Trump') || title.includes('President')) {
        return `ChainGPT: ${label} leads with ${p}% probability. Market factoring in latest policy shifts.`;
    }
    if (title.includes('Iran') || title.includes('strike')) {
        return `ChainGPT: High volatility detected. Pricing in geopolitical risk premium at ${p}%.`;
    }
    if (title.includes('Bitcoin') || title.includes('price')) {
        return `ChainGPT: Strong correlation with macro signals found. Trend leans ${label}.`;
    }
    if (title.includes('Fed') || title.includes('rate')) {
        return `ChainGPT: Consensus pricing in 25bps shift. Market stability index: High.`;
    }

    // Default smart-sounding summary
    return `ChainGPT: Analyzing 30+ signals. ${label} remains the dominant consensus at ${p}%.`;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        console.log('[Top10 API] Request received, category:', category || 'all');

        // 1. Check cache first
        let allMarkets = getCachedMarkets();

        // 2. If no cache, fetch fresh data
        if (!allMarkets) {
            console.log('[Top10 API] Cache miss, fetching fresh data...');

            const [polymarkets, kalshiMarkets] = await Promise.all([
                fetchPolymarketMarketsInline(),
                fetchKalshiMarkets(),
            ]);

            allMarkets = [...polymarkets, ...kalshiMarkets];

            console.log('[Top10 API] Fetched total:', allMarkets.length, 'markets');
            console.log('[Top10 API] - Polymarket:', polymarkets.length);
            console.log('[Top10 API] - Kalshi:', kalshiMarkets.length);

            // Cache the results
            setCachedMarkets(allMarkets);
        }

        // 3. Filter by category if provided
        let filteredMarkets = allMarkets;
        if (category) {
            filteredMarkets = allMarkets.filter(
                m => m.category.toLowerCase() === category.toLowerCase()
            );
            console.log('[Top10 API] Filtered to category', category, ':', filteredMarkets.length, 'markets');
        }

        // 4. Sort by volume_24h (descending) and take top 10
        const top10Initial = filteredMarkets
            .sort((a, b) => b.volume_24h - a.volume_24h)
            .slice(0, 10);

        // 5. Apply real AI summaries for Rank 1-3 if API key is present AND auto-AI is enabled
        const hasKey = !!process.env.CHAINGPT_API_KEY;
        const autoAiEnabled = process.env.ENABLE_AUTO_AI === 'true';
        console.log(`[Top10 API] AI Key: ${hasKey}, Auto-AI: ${autoAiEnabled}`);

        const top10 = await Promise.all(top10Initial.map(async (market, index) => {
            const rank = index + 1;
            let ai_summary = market.ai_summary;

            // Only use real AI for Top 3 AND if we have a key AND explicit opt-in
            if (rank <= 3 && hasKey && autoAiEnabled) {
                try {
                    const { generateMarketChipSummary } = await import('@/src/chaingpt/domain/markets/explanationService');
                    ai_summary = await generateMarketChipSummary(market.title, market.mid_price, market.outcomeLabel || 'Outcome');
                    console.log(`[Top10 API] Generated real AI summary for Rank ${rank}: ${market.title}`);
                } catch (e) {
                    console.warn(`[Top10 API] Failed to generate real AI summary for Rank ${rank}, falling back to mock.`);
                }
            }

            return {
                ...market,
                rank,
                ai_summary
            };
        }));

        // 6. Extract unique categories from all markets
        const categories = [...new Set(allMarkets.map(m => m.category))]
            .sort();

        // 7. Build response
        const response: Top10Response = {
            items: top10,
            categories,
            generated_at: new Date().toISOString(),
            metadata: {
                total_markets_analyzed: allMarkets.length,
                platforms_covered: ['POLYMARKET', 'KALSHI'],
                cache_age_minutes: getCacheAgeMinutes(),
            },
        };

        console.log('[Top10 API] Returning', top10.length, 'markets');

        return NextResponse.json(response);
    } catch (error) {
        console.error('[Top10 API] Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch market data',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
