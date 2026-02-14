import { NextRequest, NextResponse } from 'next/server';

/**
 * Resolve Polymarket username to wallet address
 * 
 * IMPORTANT: This endpoint only supports Polymarket usernames.
 * It does not work with usernames from other prediction market platforms.
 * 
 * Note: This is a workaround implementation. Polymarket doesn't provide a direct
 * username-to-address API endpoint. The profile pages use client-side rendering,
 * making server-side scraping difficult.
 * 
 * For production use, consider:
 * 1. Building a database of known username->address mappings
 * 2. Using a headless browser service
 * 3. Asking users to provide the address directly
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        let { username } = body;

        if (!username || typeof username !== 'string') {
            return NextResponse.json({ error: 'username is required' }, { status: 400 });
        }

        // Remove @ prefix if present
        username = username.replace(/^@/, '');

        if (!username || username.length === 0) {
            return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
        }

        // Known username mappings (can be expanded)
        const knownMappings: Record<string, string> = {
            'LDSIADAS': '0xd830027529b0baca2a52fd8a4dee43d366a9a592',
            'beachboy4': '0xc2e7800b5af46e6093872b177b7a5e7f0563be51',
            'PuzzleTricker': '0x003932bc605249fbfeb9ea6c3e15ec6e868a6beb',
            'MrSparklySimpsons': '0xd0b4c4c020abdc88ad9a884f999f3d8cff8ffed6',
            // Add more known mappings here
        };

        // Check if we have a known mapping
        // Case-insensitive check
        const lowerUsername = username.toLowerCase();
        const foundKey = Object.keys(knownMappings).find(k => k.toLowerCase() === lowerUsername);

        if (foundKey) {
            return NextResponse.json({
                username: `@${foundKey}`,
                address: knownMappings[foundKey],
            });
        }

        // ------------------------------------------------------------------
        // Dynamic Lookup: Fetch from Polymarket Profile API
        // ------------------------------------------------------------------
        try {
            console.log(`Attempting to resolve username dynamically: ${username}`);
            const profileRes = await fetch(`https://data-api.polymarket.com/profile?username=${username}`);

            if (profileRes.ok) {
                const profileData = await profileRes.json();
                if (profileData && profileData.address) {
                    return NextResponse.json({
                        username: `@${profileData.username || username}`,
                        address: profileData.address,
                        proxyAddress: profileData.proxyAddress
                    });
                }
            } else {
                console.warn(`Polymarket Profile API returned ${profileRes.status} for ${username}`);
            }
        } catch (fetchErr) {
            console.error(`Failed to fetch profile for ${username}:`, fetchErr);
            // Continue to error response if fetch fails
        }

        // For unknown usernames, return a helpful error
        return NextResponse.json({
            error: `Username @${username} not found. We tried fetching it from Polymarket but failed. Please visit https://polymarket.com/@${username} to find their wallet address (starts with 0x) and enter it directly.`,
        }, { status: 404 });

    } catch (err: any) {
        console.error('Resolve username error:', err);
        return NextResponse.json({ error: err?.message || 'Failed to resolve username' }, { status: 500 });
    }
}
