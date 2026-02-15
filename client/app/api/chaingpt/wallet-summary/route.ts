import { NextRequest, NextResponse } from 'next/server';
import { getMockWalletStats } from '@/src/chaingpt/domain/wallet/mockWalletData';
import { getWalletStats } from '@/src/chaingpt/domain/wallet/walletDataService';
import { generateWalletSummary } from '@/src/chaingpt/domain/wallet/walletSummaryService';
import { ENV } from '@/src/chaingpt/config/env';
import { isDemoModeServer, demoWalletSummary } from '@/src/chaingpt/lib/demoFallback';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address || typeof address !== 'string') {
      return NextResponse.json({ error: 'address is required' }, { status: 400 });
    }

    // Trim whitespace to prevent validation errors
    const cleanedAddress = address.trim();

    // Validate address format - relaxed for Polymarket proxy addresses
    if (!/^0x[a-fA-F0-9]{40}(-[0-9]+)?$/.test(cleanedAddress)) {
      return NextResponse.json({ error: 'Invalid EVM address format' }, { status: 400 });
    }

    // Try to get real stats from Polymarket API
    let stats;
    let isRealData = false;
    try {
      stats = await getWalletStats(cleanedAddress);
      isRealData = true;
      console.log(`Fetched real Polymarket data for ${cleanedAddress}`);
    } catch (err: any) {
      console.warn(`Failed to fetch Polymarket data for ${cleanedAddress}, using mock:`, err.message);
      stats = getMockWalletStats(cleanedAddress);
    }

    // Generate summary using ChainGPT or demo fallback
    let summaryData: any;

    if (isDemoModeServer() && !ENV.CHAINGPT_API_KEY) {
      summaryData = demoWalletSummary(cleanedAddress);
    } else {
      try {
        summaryData = await generateWalletSummary(stats);
      } catch (err: any) {
        console.error('ChainGPT wallet summary error:', err);

        if (err.message?.includes('401')) {
          return NextResponse.json({ error: 'ChainGPT API key invalid' }, { status: 401 });
        }
        if (err.message?.includes('402') || err.message?.includes('403')) {
          return NextResponse.json({ error: 'ChainGPT credits exhausted' }, { status: 402 });
        }

        summaryData = demoWalletSummary(cleanedAddress);
      }
    }

    return NextResponse.json({
      address: stats.address,
      stats,
      summary: summaryData.summary || summaryData, // handle legacy string or new object
      strategy: summaryData.strategy || '',
      riskAssessment: summaryData.riskAssessment || { strengths: [], risks: [] },
      isRealData,
    });
  } catch (err: any) {
    console.error('Wallet summary route error:', err);
    return NextResponse.json({ error: err?.message || 'Internal error' }, { status: 500 });
  }
}
