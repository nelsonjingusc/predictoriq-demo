/**
 * Test endpoint to debug Polymarket API fetching
 */

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('[Test] Starting Polymarket fetch test...');

        const url = 'https://gamma-api.polymarket.com/events?closed=false&limit=5&order=volume&ascending=false';
        console.log('[Test] URL:', url);

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        console.log('[Test] Response status:', response.status);
        console.log('[Test] Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const text = await response.text();
            console.error('[Test] Error response:', text);
            return NextResponse.json({ error: `API returned ${response.status}`, body: text });
        }

        const data = await response.json();
        console.log('[Test] Data type:', Array.isArray(data) ? 'array' : typeof data);
        console.log('[Test] Data length:', Array.isArray(data) ? data.length : 'N/A');

        if (Array.isArray(data) && data.length > 0) {
            console.log('[Test] First item keys:', Object.keys(data[0]));
            console.log('[Test] First item sample:', {
                id: data[0].id,
                title: data[0].title,
                volume24hr: data[0].volume24hr,
            });
        }

        return NextResponse.json({
            success: true,
            count: Array.isArray(data) ? data.length : 0,
            sample: Array.isArray(data) && data.length > 0 ? data[0] : null,
        });
    } catch (error) {
        console.error('[Test] Error:', error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
        }, { status: 500 });
    }
}
