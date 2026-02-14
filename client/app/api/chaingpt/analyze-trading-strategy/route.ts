import { NextRequest, NextResponse } from 'next/server';

interface WalletStats {
    totalPositions: number;
    winRate: number;
    totalPnL: number;
    realizedPnL: number;
    unrealizedPnL: number;
    totalTrades: number;
    favoriteCategories: string[];
    avgPositionSize: number;
    largestWin: number;
    largestLoss: number;
}

interface StrategyAnalysisResponse {
    strategy: string;
    riskAssessment: {
        strengths: string[];
        risks: string[];
    };
}

// Mock response for demo mode or when API key is not configured
const getMockResponse = (stats: WalletStats): StrategyAnalysisResponse => {
    const redemptionRate = 45; // Estimated based on typical patterns
    const avgHoldingDays = 12; // Estimated

    return {
        strategy: `This trader demonstrates a selective long-term holder strategy, focusing on ${stats.favoriteCategories[0] || 'political'} markets with early position entry. Their ${redemptionRate}% redemption rate and ${avgHoldingDays}-day average holding period suggest patience in waiting for market resolution rather than trading on price movements. The concentrated position sizing indicates confidence-based allocation rather than diversified market making.`,
        riskAssessment: {
            strengths: [
                `Strong market selection with ${stats.winRate.toFixed(1)}% win rate across ${stats.totalPositions} positions`,
                `Disciplined position sizing averaging $${(stats.avgPositionSize / 1000).toFixed(1)}K per trade`
            ],
            risks: [
                stats.unrealizedPnL < 0
                    ? `Significant unrealized losses ($${(Math.abs(stats.unrealizedPnL) / 1000).toFixed(0)}K) suggest potential disposition effect`
                    : `Concentration in ${stats.favoriteCategories[0] || 'specific'} markets creates event risk exposure`,
                `Largest single loss of $${(Math.abs(stats.largestLoss) / 1000).toFixed(0)}K indicates occasional high-conviction mistakes`
            ]
        }
    };
};

export async function POST(request: NextRequest) {
    try {
        const { walletStats } = await request.json();

        if (!walletStats) {
            return NextResponse.json(
                { error: 'Wallet stats are required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.CHAINGPT_API_KEY;
        const baseUrl = process.env.CHAINGPT_BASE_URL || 'https://api.chaingpt.org';

        // If no API key, return mock response
        if (!apiKey) {
            console.log('[Strategy Analysis] No API key configured, using mock response');
            return NextResponse.json(getMockResponse(walletStats));
        }

        // Construct Web3-specific prompt
        const redemptionRate = 45; // TODO: Calculate from actual data
        const avgHoldingDays = 12; // TODO: Calculate from actual data

        const prompt = `You are a Web3 prediction market analyst specializing in on-chain trading behavior.

Analyze this Polymarket trader's strategy based on their on-chain activity:

Trading Performance:
- Total Positions: ${walletStats.totalPositions}
- Win Rate: ${walletStats.winRate.toFixed(1)}%
- Total P&L: $${(walletStats.totalPnL / 1000).toFixed(1)}K
- Realized P&L: $${(walletStats.realizedPnL / 1000).toFixed(1)}K
- Unrealized P&L: $${(walletStats.unrealizedPnL / 1000).toFixed(1)}K

On-Chain Behavior:
- Total Trades: ${walletStats.totalTrades}
- Redemption Rate: ${redemptionRate}% (redeemed vs sold on secondary market)
- Average Holding Period: ${avgHoldingDays} days
- Average Position Size: $${(walletStats.avgPositionSize / 1000).toFixed(1)}K
- Favorite Categories: ${walletStats.favoriteCategories.join(', ')}

Largest Trades:
- Biggest Win: $${(walletStats.largestWin / 1000).toFixed(1)}K
- Biggest Loss: $${(Math.abs(walletStats.largestLoss) / 1000).toFixed(1)}K

Provide analysis in JSON format:
{
  "strategy": "2-3 sentences describing their primary strategy (arbitrage/market-making/long-term holder/event-driven) using prediction market terminology",
  "riskAssessment": {
    "strengths": ["strength 1", "strength 2"],
    "risks": ["risk 1", "risk 2"]
  }
}

Focus on Web3-specific insights like redemption behavior, on-chain patterns, and prediction market strategies.`;

        // Call ChainGPT API
        const response = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4', // ChainGPT's Web3 LLM model
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            }),
        });

        if (!response.ok) {
            console.error('[Strategy Analysis] ChainGPT API error:', response.statusText);
            // Fallback to mock response on API error
            return NextResponse.json(getMockResponse(walletStats));
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            console.error('[Strategy Analysis] No content in response');
            return NextResponse.json(getMockResponse(walletStats));
        }

        // Parse JSON response from LLM
        try {
            const analysis = JSON.parse(content);
            return NextResponse.json(analysis);
        } catch (parseError) {
            console.error('[Strategy Analysis] Failed to parse LLM response:', parseError);
            // If LLM didn't return valid JSON, fallback to mock
            return NextResponse.json(getMockResponse(walletStats));
        }

    } catch (error) {
        console.error('[Strategy Analysis] Error:', error);
        // Always fallback to mock response on any error
        return NextResponse.json(getMockResponse(
            (await request.json()).walletStats
        ));
    }
}
