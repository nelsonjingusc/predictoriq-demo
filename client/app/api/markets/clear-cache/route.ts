/**
 * API Route: /api/markets/clear-cache
 * Clears the market data cache
 */

import { NextResponse } from 'next/server';
import { clearCache } from '@/lib/markets/cache';

export async function POST() {
    try {
        clearCache();
        return NextResponse.json({ success: true, message: 'Cache cleared' });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to clear cache' },
            { status: 500 }
        );
    }
}
