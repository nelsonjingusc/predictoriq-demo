'use client';

import { useMemo, useState } from 'react';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';
import { mockTop10Data } from '@/lib/mock-data';

type Tab = 'wallet' | 'daily-note' | 'digest' | 'anomaly';

function buildSignalFromTop10Item(item: any): MarketSignal {
  const liquidityLevel = item.market.liquidity >= 300000 ? 'high' : item.market.liquidity >= 120000 ? 'medium' : 'low';

  return {
    marketId: item.market.market_id,
    title: item.market.title,
    url: item.market.url,
    venue: item.market.platform,
    impliedProbMarket: item.market.mid_price,
    impliedProbOptions: item.market.mid_price,
    mispricing: 0,
    capitalQualityYes: 'medium',
    capitalQualityNo: 'medium',
    anomalyScore: 0.2,
    liquidityLevel,
  };
}

export default function ChainGptToolsPage() {
  const [tab, setTab] = useState<Tab>('wallet');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    mockTop10Data.items.slice(0, 3).map((i) => i.market.market_id)
  );

  const markets = useMemo(() => {
    const map = new Map<string, any>();
    for (const i of mockTop10Data.items) map.set(i.market.market_id, i);
    return map;
  }, []);

  const selectedSignals = useMemo(() => {
    return selectedIds
      .map((id) => markets.get(id))
      .filter(Boolean)
      .map((item) => buildSignalFromTop10Item(item));
  }, [selectedIds, markets]);

  const [output, setOutput] = useState<string>('');
  const [tweetOutput, setTweetOutput] = useState<string[]>([]);
  const [reason, setReason] = useState('Unusual one-sided activity and early entries from new wallets.');
  
  // Wallet summary state
  const [walletAddress, setWalletAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const [walletStats, setWalletStats] = useState<any>(null);
  const [walletSummary, setWalletSummary] = useState<string>('');

  async function runDailyNote() {
    setLoading(true);
    setError(null);
    setOutput('');
    try {
      const res = await fetch('/api/chaingpt/generate-daily-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markets: selectedSignals }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      setOutput(String(json.note?.markdown || ''));
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function runDigest() {
    setLoading(true);
    setError(null);
    setTweetOutput([]);
    try {
      const res = await fetch('/api/chaingpt/generate-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markets: selectedSignals }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      const tweets = Array.isArray(json.tweets) ? json.tweets.map((t: any) => String(t.text || '')) : [];
      setTweetOutput(tweets);
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function runAnomaly() {
    setLoading(true);
    setError(null);
    setTweetOutput([]);
    try {
      const market = selectedSignals[0];
      if (!market) throw new Error('Select at least one market');
      const res = await fetch('/api/chaingpt/generate-anomaly-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ market, reason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      setTweetOutput([String(json.tweet?.text || '')]);
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  async function runWalletSummary() {
    setLoading(true);
    setError(null);
    setWalletStats(null);
    setWalletSummary('');
    try {
      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        throw new Error('Invalid EVM address format');
      }
      const res = await fetch('/api/chaingpt/wallet-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      setWalletStats(json.stats);
      setWalletSummary(json.summary);
    } catch (e: any) {
      setError(e?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">ChainGPT PoC</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
          Powered by ChainGPT Web3 LLM
        </span>
      </div>
      <p className="text-gray-600 mt-2">
        Wallet summary, content generation, and research tools. Demo mode enabled by default.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium border ${
            tab === 'wallet' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-800 border-gray-200'
          }`}
          onClick={() => setTab('wallet')}
        >
          🎯 Wallet Summary (PoC)
        </button>
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium border ${
            tab === 'daily-note' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-200'
          }`}
          onClick={() => setTab('daily-note')}
        >
          Daily Note (UC6)
        </button>
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium border ${
            tab === 'digest' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-200'
          }`}
          onClick={() => setTab('digest')}
        >
          Digest Tweets (UC3)
        </button>
        <button
          className={`px-3 py-2 rounded-md text-sm font-medium border ${
            tab === 'anomaly' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-800 border-gray-200'
          }`}
          onClick={() => setTab('anomaly')}
        >
          Anomaly Tweet (UC4)
        </button>
      </div>

      <div className="mt-6 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          {tab === 'wallet' ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="text-sm font-semibold text-gray-900">Wallet Address</div>
              <div className="text-xs text-gray-500 mt-1">Enter an EVM address (0x...)</div>
              
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="mt-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="mt-4">
                <button
                  disabled={loading}
                  onClick={runWalletSummary}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? 'Analyzing…' : 'Analyze Wallet'}
                </button>
                <div className="mt-2 text-xs text-gray-500">
                  Powered by ChainGPT Web3 LLM
                </div>
              </div>
            </div>
          ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-sm font-semibold text-gray-900">Markets (from demo Top10)</div>
            <div className="text-xs text-gray-500 mt-1">Select 1–5 markets for generation.</div>

            <div className="mt-4 space-y-2 max-h-[420px] overflow-auto pr-1">
              {mockTop10Data.items.map((i) => {
                const id = i.market.market_id;
                const checked = selectedIds.includes(id);
                return (
                  <label key={id} className="flex items-start gap-3 rounded-lg border border-gray-200 p-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? Array.from(new Set([...selectedIds, id]))
                          : selectedIds.filter((x) => x !== id);
                        setSelectedIds(next.slice(0, 5));
                      }}
                      className="mt-1"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{i.market.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {i.market.platform} · {(i.market.mid_price * 100).toFixed(1)}% · ${i.market.volume_24h.toLocaleString()}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {tab === 'anomaly' && (
              <div className="mt-4">
                <div className="text-sm font-semibold text-gray-900">Reason</div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            )}

            <div className="mt-4">
              <button
                disabled={loading}
                onClick={() => (tab === 'daily-note' ? runDailyNote() : tab === 'digest' ? runDigest() : runAnomaly())}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? 'Running…' : tab === 'daily-note' ? 'Generate Note' : tab === 'digest' ? 'Generate Tweets' : 'Generate Tweet'}
              </button>
              <div className="mt-2 text-xs text-gray-500">
                Tip: if you get 401/402/403, check API key/credits.
              </div>
            </div>
          </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Output</div>
              {output && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(output)}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Copy
                </button>
              )}
            </div>

            {error && (
              <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3">
                {error}
              </div>
            )}

            {tab === 'wallet' ? (
              <div className="mt-3 space-y-4 min-h-[420px]">
                {walletStats ? (
                  <>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-xs font-semibold text-gray-500 mb-3">WALLET STATS (COMPUTED)</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-gray-500">Total Markets</div>
                          <div className="font-semibold text-gray-900">{walletStats.totalMarkets}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Win Rate</div>
                          <div className="font-semibold text-gray-900">{(walletStats.winRate * 100).toFixed(1)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Realized PnL</div>
                          <div className={`font-semibold ${walletStats.realizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${walletStats.realizedPnL.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Avg Position</div>
                          <div className="font-semibold text-gray-900">${walletStats.avgPositionSize.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-gray-500 text-xs mb-1">Favorite Categories</div>
                        <div className="flex flex-wrap gap-1">
                          {walletStats.favoriteCategories.map((cat: string) => (
                            <span key={cat} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-gray-500 text-xs mb-1">Notable Behaviors</div>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {walletStats.notableBehaviors.map((b: string, i: number) => (
                            <li key={i}>• {b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-xs font-semibold text-blue-900">AI SUMMARY</div>
                        <div className="text-xs text-blue-600">Powered by ChainGPT Web3 LLM</div>
                      </div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">{walletSummary}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    Enter a wallet address and click "Analyze Wallet" to see stats and AI-generated summary.
                  </div>
                )}
              </div>
            ) : tab === 'daily-note' ? (
              <pre className="mt-3 whitespace-pre-wrap text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[420px]">
                {output || 'No output yet.'}
              </pre>
            ) : (
              <div className="mt-3 space-y-3 min-h-[420px]">
                {tweetOutput.length === 0 ? (
                  <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    No output yet.
                  </div>
                ) : (
                  tweetOutput.map((t, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-2">Tweet {idx + 1}</div>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">{t}</div>
                      <div className="mt-2 text-xs text-gray-500">Length: {t.length} chars</div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(t)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

