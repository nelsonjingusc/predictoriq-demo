/**
 * Caching layer for market data
 * Caches market data for 15 minutes to reduce API calls
 */

import type { Market } from './types';

const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface CacheEntry {
    markets: Market[];
    timestamp: number;
}

// In-memory cache (server-side only)
let cache: CacheEntry | null = null;

/**
 * Get cached markets if still valid
 */
export function getCachedMarkets(): Market[] | null {
    if (!cache) {
        return null;
    }

    const age = Date.now() - cache.timestamp;

    if (age > CACHE_DURATION_MS) {
        console.log('[Cache] Expired, age:', Math.round(age / 1000), 'seconds');
        cache = null;
        return null;
    }

    console.log('[Cache] Hit, age:', Math.round(age / 1000), 'seconds');
    return cache.markets;
}

/**
 * Set cached markets
 */
export function setCachedMarkets(markets: Market[]): void {
    cache = {
        markets,
        timestamp: Date.now(),
    };
    console.log('[Cache] Stored', markets.length, 'markets');
}

/**
 * Get cache age in minutes
 */
export function getCacheAgeMinutes(): number {
    if (!cache) {
        return 0;
    }
    return Math.round((Date.now() - cache.timestamp) / 60000);
}

/**
 * Clear cache (useful for testing)
 */
export function clearCache(): void {
    cache = null;
    console.log('[Cache] Cleared');
}
