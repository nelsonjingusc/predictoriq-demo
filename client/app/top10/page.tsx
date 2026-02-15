'use client';

import { useState, useEffect } from 'react';
import ChaingptExplanationPanel from '@/components/ChaingptExplanationPanel';
import ChaingptCopilotModal from '@/components/ChaingptCopilotModal';
import CategorySelector from '@/components/CategorySelector';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';
import type { Top10Response } from '@/lib/markets/types';

export default function Top10Page() {
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotSignal, setCopilotSignal] = useState<MarketSignal | null>(null);
  const [copilotTitle, setCopilotTitle] = useState<string>('');
  const [category, setCategory] = useState<string | null>(null);
  const [data, setData] = useState<Top10Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openExplanations, setOpenExplanations] = useState<Record<string, boolean>>({});

  const toggleExplanation = (marketId: string) => {
    setOpenExplanations(prev => ({
      ...prev,
      [marketId]: !prev[marketId]
    }));
  };

  // Fetch data when category changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = category
      ? `/api/markets/top10?category=${encodeURIComponent(category)}`
      : '/api/markets/top10';

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch Top10:', err);
        setError(err.message || 'Failed to load markets');
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading markets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-gray-600">
        No data available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-4 tracking-tight">
            Daily Top10
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
            {category
              ? `Top markets in ${category} by 24h volume`
              : 'The most active prediction markets across all platforms'}
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <CategorySelector
            selectedCategory={category}
            onCategoryChange={setCategory}
          />
        </div>

        {data.items.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-md border border-white/60 rounded-2xl p-12 text-center shadow-lg max-w-lg mx-auto">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-600 text-lg">
              No markets found{category ? ` in category "${category}"` : ''}.
              <br />
              Try selecting a different category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {data.items.map((item: any) => (
              <div
                key={item.market_id}
                className="group relative bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:scale-[1.005] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-5">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-xl text-xl font-bold shadow-sm
                      ${item.rank === 1 ? 'bg-gradient-to-br from-yellow-200 to-yellow-500 text-yellow-900' : ''}
                      ${item.rank === 2 ? 'bg-gradient-to-br from-gray-200 to-gray-400 text-gray-800' : ''}
                      ${item.rank === 3 ? 'bg-gradient-to-br from-orange-200 to-orange-400 text-orange-900' : ''}
                      ${item.rank > 3 ? 'bg-gray-100 text-gray-500' : ''}
                    `}>
                      #{item.rank}
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>

                      {item.ai_summary && (
                        <div className="flex items-center gap-2 mb-3">
                          <button
                            onClick={() => toggleExplanation(item.market_id)}
                            className="relative group/ai cursor-pointer text-left focus:outline-none"
                          >
                            {/* AI Glow Effect - Warm/Terracotta */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur opacity-15 group-hover/ai:opacity-30 transition duration-1000 group-hover/ai:duration-200"></div>

                            <div className="relative flex items-center gap-2.5 px-5 py-2.5 bg-orange-50/95 backdrop-blur-md border border-orange-200/60 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.15)] hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all">
                              <span className="text-lg">✨</span>
                              <span className="text-base font-black bg-gradient-to-r from-orange-700 to-red-800 bg-clip-text text-transparent uppercase tracking-wider">
                                {item.ai_summary}
                              </span>
                            </div>
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                          {item.platform}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-bold rounded-full border border-gray-200">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-extrabold text-gray-900 tracking-tight">
                      {(item.mid_price * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">
                      {item.outcomeLabel || 'Probability'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6 p-5 bg-gray-50/50 rounded-xl border border-gray-100/50">
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Volume (24h)</span>
                    <div className="text-xl font-black text-gray-800 font-mono mt-1">
                      ${item.volume_24h.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Liquidity</span>
                    <div className="text-xl font-black text-gray-800 font-mono mt-1">
                      ${item.liquidity.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs font-medium text-gray-400">
                    Updated {new Date(item.updated_at).toLocaleTimeString()}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const liquidityLevel =
                          item.liquidity >= 300000 ? 'high' : item.liquidity >= 120000 ? 'medium' : 'low';

                        const signal: MarketSignal = {
                          marketId: item.market_id,
                          title: item.title,
                          url: item.url,
                          venue: item.platform,
                          impliedProbMarket: item.mid_price,
                          impliedProbOptions: item.mid_price,
                          mispricing: 0,
                          capitalQualityYes: 'medium',
                          capitalQualityNo: 'medium',
                          anomalyScore: 0.2,
                          liquidityLevel,
                        };

                        setCopilotSignal(signal);
                        setCopilotTitle(item.title);
                        setCopilotOpen(true);
                      }}
                      className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                      Ask AI Agent
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-1"
                    >
                      View Market ↗
                    </a>
                  </div>
                </div>

                <div className="mt-4">
                  <ChaingptExplanationPanel
                    isOpen={openExplanations[item.market_id] || false}
                    onToggle={() => toggleExplanation(item.market_id)}
                    signal={{
                      marketId: item.market_id,
                      title: item.title,
                      url: item.url,
                      venue: item.platform,
                      impliedProbMarket: item.mid_price,
                      impliedProbOptions: item.mid_price,
                      mispricing: 0,
                      capitalQualityYes: 'medium',
                      capitalQualityNo: 'medium',
                      anomalyScore: 0.2,
                      liquidityLevel:
                        item.liquidity >= 300000 ? 'high' : item.liquidity >= 120000 ? 'medium' : 'low',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-sm text-gray-500 text-center bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-white/40">
          <p>
            Generated at {new Date(data.generated_at).toLocaleString()} |
            Analyzed {data.metadata.total_markets_analyzed} markets |
            Cache age: {data.metadata.cache_age_minutes} minutes
          </p>
          <p className="mt-2 text-xs font-medium opacity-70">
            Platforms Covered: {data.metadata.platforms_covered.join(', ')}
          </p>
        </div>
      </div>
      {copilotSignal && (
        <ChaingptCopilotModal
          open={copilotOpen}
          onClose={() => setCopilotOpen(false)}
          signal={copilotSignal}
          title={copilotTitle}
        />
      )}
    </div>
  );
}
