'use client';

import { useState } from 'react';

// Format number with commas
const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// Format currency
const formatCurrency = (num: number, compact: boolean = false): string => {
  if (compact && Math.abs(num) >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  }
  if (compact && Math.abs(num) >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  }
  return `$${formatNumber(Math.abs(num), 2)}`;
};

export default function WalletTrackerPage() {
  const [inputValue, setInputValue] = useState('');
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [resolvedUsername, setResolvedUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<string>('');
  const [isRealData, setIsRealData] = useState<boolean>(false);

  async function resolveUsername(username: string): Promise<string> {
    try {
      const res = await fetch('/api/chaingpt/resolve-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Failed to resolve username');
      return json.address;
    } catch (e: any) {
      throw new Error(e?.message || 'Failed to resolve username');
    }
  }

  async function analyze(addressOverride?: string) {
    // Reset resolved state
    setResolvedAddress(null);
    setResolvedUsername(null);

    // Use override if provided, otherwise use input state
    const targetInput = addressOverride || inputValue;

    // Validate input
    if (!targetInput || targetInput.trim().length === 0) {
      setError('Please enter a wallet address or username');
      return;
    }

    let addressToAnalyze = targetInput.trim();

    setLoading(true);
    setError(null);
    setStats(null);
    setSummary('');
    setIsRealData(false);

    try {
      // Auto-detect input type
      const isAddress = /^0x[a-fA-F0-9]{40}(-[0-9]+)?$/.test(addressToAnalyze);

      if (!isAddress) {
        // Treat as username
        const trimmedInput = targetInput.trim();
        addressToAnalyze = await resolveUsername(trimmedInput);
        setResolvedAddress(addressToAnalyze);
        setResolvedUsername(trimmedInput.startsWith('@') ? trimmedInput : `@${trimmedInput}`);
      }
      // If it IS an address, we use it directly. 
      // Note: We don't strictly reject invalid addresses here if they don't match 0x... 
      // because the resolveUsername might catch them if they are usernames without @.
      // But if resolveUsername fails, it throws.

      const res = await fetch('/api/chaingpt/wallet-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addressToAnalyze }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      setStats(json.stats);
      setSummary(json.summary);
      setIsRealData(json.isRealData || false);
    } catch (e: any) {
      setError(e?.message || 'Failed to analyze wallet');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-3 leading-tight pb-1">
            Wallet Intelligence
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto whitespace-nowrap">
            Deep insights into prediction market trading patterns, powered by real-time data
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Wallet Address or Username
            <span className="ml-2 text-xs font-normal text-gray-500">(Auto-detects Polymarket username)</span>
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter 0x... address or Polymarket username"
              className="flex-1 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button
              type="button"
              onClick={() => analyze()}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-3 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Analyzing...' : 'Analyze Wallet'}
            </button>
          </div>

          {/* Resolved Address Display */}
          {resolvedAddress && resolvedUsername && (
            <div className="mt-3 text-sm bg-green-50 border border-green-200 rounded-lg p-3">
              <span className="text-green-700">
                ✓ Resolved {resolvedUsername} → <span className="font-mono">{resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}</span>
              </span>
            </div>
          )}

          {/* Username Support Disclaimer */}
          <div className="mt-4 text-sm text-gray-500 flex items-start gap-1.5">
            <span className="text-blue-500 text-sm">ℹ️</span>
            <span>
              <strong>Note:</strong> We recommend using <strong>Wallet Addresses</strong> for best results. Username lookup is currently limited to top traders.
            </span>
          </div>

          {/* Top Traders Recommendations */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              🔥 Trending Top Traders (Last 24h)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'beachboy4', address: '0xc2e7800b5af46e6093872b177b7a5e7f0563be51', profit: '+$10.5M', winRate: 'High' },
                { name: 'YatSen', address: '0x5bffcf561bcae83af680ad600cb99f1184d6ffbe', profit: '+$2.3M', winRate: 'High' },
                { name: 'FeatherLeather', address: '0xd25c72ac0928385610611c8148803dc717334d20', profit: '+$1.7M', winRate: 'High' }
              ].map((trader) => (
                <button
                  key={trader.name}
                  type="button"
                  onClick={() => {
                    setInputValue(trader.address); // Update UI
                    analyze(trader.address); // Trigger analysis immediately with explicit address
                  }}
                  className="group text-left p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 text-sm">@{trader.name}</span>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{trader.profit}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Win Rate: <span className="font-medium text-gray-700">{trader.winRate}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <span className="font-semibold text-amber-900">ℹ️ Note:</span> P&L values shown above are from Polymarket Leaderboard (all-time).
              Our analysis is based on the last 5,000 trades due to API limitations, so calculated P&L may differ for high-volume traders.
            </div>
          </div>
        </div>

        {/* Top Traders Tip */}
        <div className="mb-8">
          <a
            href="https://polymarket.com/leaderboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-700 mb-3 flex items-center gap-2 hover:underline decoration-blue-700 underline-offset-2 transition-all group"
          >
            <span>🏆 Find Top Traders</span>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
          </a>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="text-sm text-gray-700 mb-3">
              <span className="font-semibold">💡 Tip:</span> You can analyze any trader from the{' '}
              <a
                href="https://polymarket.com/leaderboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-semibold"
              >
                Polymarket Leaderboard
              </a>
              . Just copy their username or address and paste it above.
            </div>
            <div className="mt-4 text-xs text-blue-800 bg-blue-50 border border-blue-100 rounded-lg p-3">
              📊 The leaderboard updates every 5 minutes with real-time data. Copy a wallet address from there and paste it above to analyze their trading patterns.
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600 mb-2">Analyzing wallet...</div>
          <div className="text-sm text-gray-500">Fetching data from Polymarket</div>
        </div>
      )}

      {!loading && stats && (
        <div className="container mx-auto px-4 pb-20 max-w-7xl space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {stats.address.slice(0, 6)}...{stats.address.slice(-4)}
                </span>
              </div>
              {isRealData && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                    ✓ Live Data
                  </span>
                  <span className="text-xs text-gray-500">
                    (Last 5000 trades + current positions)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className={`text-sm font-bold px-4 py-2 rounded-full ${stats.totalPnL >= 0
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                {stats.totalPnL >= 0 ? '✓ Profitable' : '⚠ Current Drawdown'}
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-2xl p-8 shadow-xl border-2 ${stats.totalPnL >= 0
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
              : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
              }`}>
              <div className="text-sm font-semibold text-gray-600 mb-2">Total P&L</div>
              <div className={`text-5xl font-bold mb-2 ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.totalPnL >= 0 ? '+' : ''}{formatCurrency(stats.totalPnL, true)}
              </div>
              <div className="text-sm text-gray-600">
                ROI: <span className={`font-bold ${stats.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Realized</div>
                  <div className={`font-bold ${stats.realizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.realizedPnL >= 0 ? '+' : ''}{formatCurrency(stats.realizedPnL, true)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs">Unrealized</div>
                  <div className={`font-bold ${stats.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.unrealizedPnL >= 0 ? '+' : ''}{formatCurrency(stats.unrealizedPnL, true)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-8 shadow-xl border-2 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="text-sm font-semibold text-gray-600 mb-2">Win Rate</div>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {(stats.winRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                {stats.winningPositions}W / {stats.losingPositions}L / {stats.breakEvenPositions}BE
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Total Positions</span>
                  <span className="font-bold text-gray-900">{formatNumber(stats.totalPositions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-1">Markets</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalMarkets)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-1">Trades</div>
              <div className="text-2xl font-bold text-gray-900">{formatNumber(stats.totalTrades)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-1">Invested</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalInvested, true)}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="text-xs font-semibold text-gray-500 mb-1">Avg Position</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(stats.avgPositionSize, true)}</div>
            </div>
          </div>

          {/* Trading Volume */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 shadow-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Trading Volume</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">Buy Volume</div>
                <div className="text-3xl font-bold text-blue-700">{formatCurrency(stats.buyVolume, true)}</div>
                <div className="text-xs text-gray-600 mt-1">{formatNumber(stats.buyVolume, 0)} total</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">Sell Volume</div>
                <div className="text-3xl font-bold text-orange-700">{formatCurrency(stats.sellVolume, true)}</div>
                <div className="text-xs text-gray-600 mt-1">{formatNumber(stats.sellVolume, 0)} total</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4">
                <div className="text-xs font-semibold text-gray-600 mb-2">Total Volume</div>
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.buyVolume + stats.sellVolume, true)}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {formatNumber(stats.buyVolume + stats.sellVolume, 0)} total
                </div>
              </div>
            </div>

            {stats.sellVolume === 0 && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">⚠️</span>
                  <div>
                    <div className="font-bold text-red-800 mb-1">No Exit Strategy Detected</div>
                    <div className="text-sm text-red-700">
                      Zero sell volume indicates this trader never exits positions. This is extremely risky.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Risk Metrics */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-xs font-semibold text-green-700 mb-2">Best Trade</div>
                <div className="text-3xl font-bold text-green-600">
                  +{formatCurrency(stats.largestWin, true)}
                </div>
                <div className="text-xs text-green-600 mt-1">{formatCurrency(stats.largestWin)} exact</div>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="text-xs font-semibold text-red-700 mb-2">Worst Trade</div>
                <div className="text-3xl font-bold text-red-600">
                  {formatCurrency(stats.largestLoss, true)}
                </div>
                <div className="text-xs text-red-600 mt-1">{formatCurrency(stats.largestLoss)} exact</div>
              </div>
            </div>
          </div>

          {/* Categories & Behaviors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Favorite Categories</h3>
              <div className="flex flex-wrap gap-2">
                {stats.favoriteCategories.map((cat: string) => (
                  <span
                    key={cat}
                    className="bg-gradient-to-r from-blue-100 to-orange-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg border border-gray-200"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Trading Patterns</h3>
              <ul className="space-y-2">
                {stats.notableBehaviors.map((behavior: string, idx: number) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">▸</span>
                    {behavior}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg border border-emerald-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl font-bold text-emerald-950">Expert Analysis</div>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                {summary.includes('Demo mode') ? 'PredictorIQ AI' : 'ChainGPT Web3 LLM'}
              </span>
            </div>

            {/* 5000 Trade Limit Disclaimer */}
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start">
                <span className="text-xl mr-3">⚠️</span>
                <div>
                  <div className="font-bold text-yellow-800 mb-1">Analysis Limited to Last 5,000 Trades</div>
                  <div className="text-sm text-yellow-700">
                    Results capture recent activity only. Users with high trading volume (e.g., market makers, bots) may show different P&L compared to their all-time leaderboard stats.
                  </div>
                </div>
              </div>
            </div>

            {summary.includes('Demo mode') ? (
              <div className="space-y-6 text-gray-800">
                {/* Performance Verdict */}
                <div className="bg-white border border-emerald-100 shadow-sm rounded-xl p-5">
                  <div className="font-bold text-lg mb-2 text-gray-900">
                    {stats.totalPnL >= 0 ? '✓ Profitable Trader' : '⚠ Losing Trader'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stats.totalPnL >= 0
                      ? `Currently up ${formatCurrency(stats.totalPnL, true)} with ${stats.roi.toFixed(1)}% ROI`
                      : `Currently down ${formatCurrency(stats.totalPnL, true)} with ${stats.roi.toFixed(1)}% ROI`
                    }
                  </div>
                </div>

                {/* Critical Issues & Strategy Analysis for Losers */}
                {(stats.sellVolume === 0 || stats.winRate < 0.3 || stats.roi < -50) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="font-bold text-lg mb-3 text-red-900">🚨 Critical Issues & Root Cause Analysis</div>

                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="font-semibold mb-2 text-red-800">Primary Problems:</div>
                        <ul className="space-y-2 text-gray-700">
                          {stats.sellVolume === 0 && (
                            <li className="flex items-start">
                              <span className="mr-2 text-red-500">•</span>
                              <div>
                                <strong className="text-red-700">No exit strategy:</strong> Zero sell volume (${formatCurrency(stats.sellVolume, true)}) means never taking profits or cutting losses.
                                <div className="text-xs mt-1 text-gray-500">Impact: Holding all losing positions, letting losses compound to ${formatCurrency(Math.abs(stats.unrealizedPnL), true)}</div>
                              </div>
                            </li>
                          )}
                          {stats.winRate < 0.3 && (
                            <li className="flex items-start">
                              <span className="mr-2 text-red-500">•</span>
                              <div>
                                <strong className="text-red-700">Very low win rate:</strong> Only {(stats.winRate * 100).toFixed(1)}% ({stats.winningPositions}W / {stats.losingPositions}L)
                                <div className="text-xs mt-1 text-gray-500">Root cause: Poor market selection or timing. Losing {stats.losingPositions} out of {stats.totalPositions} positions.</div>
                              </div>
                            </li>
                          )}
                          {stats.roi < -50 && (
                            <li className="flex items-start">
                              <span className="mr-2 text-red-500">•</span>
                              <div>
                                <strong className="text-red-700">Massive drawdown:</strong> Down {Math.abs(stats.roi).toFixed(1)}% (${formatCurrency(Math.abs(stats.totalPnL), true)} loss on ${formatCurrency(stats.totalInvested, true)} invested)
                                <div className="text-xs mt-1 text-gray-500">This requires {((Math.abs(stats.roi) / (100 + Math.abs(stats.roi))) * 100).toFixed(0)}% gain just to break even.</div>
                              </div>
                            </li>
                          )}
                          {Math.abs(stats.largestLoss) > stats.largestWin && (
                            <li className="flex items-start">
                              <span className="mr-2 text-red-500">•</span>
                              <div>
                                <strong className="text-red-700">Poor risk/reward:</strong> Worst loss (${formatCurrency(Math.abs(stats.largestLoss), true)}) exceeds best win (${formatCurrency(stats.largestWin, true)})
                                <div className="text-xs mt-1 text-gray-500">Letting losers run while cutting winners too early - the opposite of what works.</div>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="bg-white border border-red-100 rounded-lg p-4 shadow-sm">
                        <div className="font-semibold mb-2 text-gray-900">🔍 Why This Strategy Fails:</div>
                        <div className="text-xs space-y-1 text-gray-600">
                          <p>1. <strong>No discipline:</strong> {stats.sellVolume === 0 ? 'Never exiting means hoping for recovery instead of managing risk' : 'Inconsistent exit strategy'}</p>
                          <p>2. <strong>Wrong approach:</strong> {stats.winRate < 0.2 ? 'Picking wrong side of most trades' : 'Poor market timing or selection'}</p>
                          <p>3. <strong>Compounding losses:</strong> ${formatCurrency(Math.abs(stats.unrealizedPnL), true)} in unrealized losses that should have been cut</p>
                          {stats.totalMarkets > 100 && stats.winRate < 0.3 && (
                            <p>4. <strong>Over-diversification without edge:</strong> Trading {stats.totalMarkets} markets but losing on most</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {(stats.winRate > 0.5 || stats.roi > 10 || (stats.sellVolume > stats.buyVolume * 0.2)) && (
                  <div className="bg-white border border-emerald-100 shadow-sm rounded-xl p-5">
                    <div className="font-bold mb-2 text-emerald-900">💪 Strengths</div>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {stats.winRate > 0.5 && <li>• Strong win rate ({(stats.winRate * 100).toFixed(1)}%)</li>}
                      {stats.roi > 10 && <li>• Excellent ROI (+{stats.roi.toFixed(1)}%)</li>}
                      {stats.sellVolume > stats.buyVolume * 0.2 && <li>• Active profit-taking strategy</li>}
                    </ul>
                  </div>
                )}

                {/* Actionable Recommendations */}
                <div className="bg-white border border-emerald-100 shadow-sm rounded-xl p-5">
                  <div className="font-bold mb-3 text-emerald-900">💡 Actionable Recommendations</div>
                  <div className="space-y-4 text-sm">
                    {stats.totalPnL < 0 ? (
                      // Recommendations for losing traders
                      <>
                        <div>
                          <div className="font-semibold mb-1 text-gray-800">Immediate Actions (Next 24 hours):</div>
                          <ul className="space-y-1 ml-4 text-xs text-gray-600">
                            {stats.sellVolume === 0 && (
                              <li>1. <strong>Close worst 3 positions immediately</strong> - Stop the bleeding on positions down more than 50%</li>
                            )}
                            <li>{stats.sellVolume === 0 ? '2' : '1'}. <strong>Set stop-loss on all remaining positions</strong> - Max 10% loss per position</li>
                            <li>{stats.sellVolume === 0 ? '3' : '2'}. <strong>Stop new trades for 48 hours</strong> - Review strategy before continuing</li>
                          </ul>
                        </div>
                        <div>
                          <div className="font-semibold mb-1 text-gray-800">Strategy Overhaul (This Week):</div>
                          <ul className="space-y-1 ml-4 text-xs text-gray-600">
                            {stats.winRate < 0.3 && (
                              <li>• <strong>Reduce market count by 80%:</strong> From {stats.totalMarkets} to {Math.max(5, Math.floor(stats.totalMarkets * 0.2))} markets - focus only on your best category</li>
                            )}
                            <li>• <strong>Implement 2:1 risk/reward minimum:</strong> Only enter if potential profit is 2x potential loss</li>
                            <li>• <strong>Paper trade for 2 weeks:</strong> Test new strategy without real money</li>
                            {stats.favoriteCategories.length > 0 && (
                              <li>• <strong>Specialize in {stats.favoriteCategories[0]}:</strong> Study top traders in this category</li>
                            )}
                          </ul>
                        </div>
                        <div className="bg-red-50 text-red-800 rounded-lg p-3 text-xs border border-red-100">
                          <strong>Reality Check:</strong> Current strategy has {Math.abs(stats.roi).toFixed(0)}% loss rate.
                          Without changes, you'll lose everything. Stop trading and learn from profitable traders first.
                        </div>
                      </>
                    ) : (
                      // Recommendations for winning traders
                      <>
                        <div>
                          <div className="font-semibold mb-1 text-gray-800">Maintain Your Edge:</div>
                          <ul className="space-y-1 ml-4 text-xs text-gray-600">
                            <li>• <strong>Document your process:</strong> Write down what's working so you can repeat it</li>
                            <li>• <strong>Don't over-trade:</strong> Stick to your {stats.favoriteCategories.join(' and ')} focus</li>
                            {stats.avgPositionSize < 10000 && (
                              <li>• <strong>Consider scaling up:</strong> Your strategy works - increase position size gradually</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <div className="font-semibold mb-1 text-gray-800">Optimize Further:</div>
                          <ul className="space-y-1 ml-4 text-xs text-gray-600">
                            {stats.winRate < 0.6 && <li>• Improve market selection to push win rate above 60%</li>}
                            {stats.sellVolume < stats.buyVolume * 0.5 && <li>• Take profits more actively - don't let winners turn into losers</li>}
                            <li>• Track which market types give you the best ROI</li>
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {summary}
              </div>
            )}
          </div>

          {/* Info Banner - Moved to Bottom */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
            <div className="flex items-start gap-4">
              <span className="text-2xl pt-1">ℹ️</span>
              <div className="text-sm text-gray-700">
                <div className="font-semibold mb-2 text-gray-900">Data Scope & Limitations</div>
                <div className="space-y-2">
                  <p>This analysis is based on:</p>
                  <ul className="ml-4 space-y-1 list-disc text-gray-600">
                    <li><strong>Current open positions</strong> (all active trades)</li>
                    <li><strong>Last 5,000 trades</strong> (Polymarket API limit)</li>
                  </ul>
                  {stats.totalPnL < 0 && Math.abs(stats.unrealizedPnL) > 1000000 && (
                    <p className="mt-3 pt-3 border-t border-gray-200 text-gray-600">
                      <strong className="text-orange-600">⚠️ Important:</strong> This wallet shows <strong>${formatCurrency(Math.abs(stats.unrealizedPnL), true)}</strong> in unrealized losses on current positions.
                      We cannot see historical closed positions that may have been profitable.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !stats && !error && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-xl text-gray-600 mb-2">Enter a wallet address to begin</div>
          <div className="text-sm text-gray-500">Get deep insights into trading patterns and performance</div>
        </div>
      )}
    </div>
  );
}
