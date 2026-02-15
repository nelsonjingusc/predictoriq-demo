'use client';

import { useMemo, useState } from 'react';
import type { MarketExplanation, MarketSignal } from '@/src/chaingpt/domain/markets/types';

type Props = {
  signal: MarketSignal;
  isOpen?: boolean;
  onToggle?: () => void;
};

function stanceLabel(stance: MarketExplanation['stance']): string {
  switch (stance) {
    case 'long_yes':
      return 'Lean YES';
    case 'long_no':
      return 'Lean NO';
    case 'avoid':
      return 'Avoid';
    case 'neutral':
    default:
      return 'Neutral';
  }
}

export default function ChaingptExplanationPanel({ signal, isOpen, onToggle }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPanelOpen = isOpen !== undefined ? isOpen : internalOpen;
  const togglePanel = onToggle || (() => setInternalOpen((v) => !v));

  const payload = useMemo(() => ({ signal }), [signal]);

  async function generate() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/chaingpt/explain-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      setResult(json.explanation as MarketExplanation);
    } catch (e: any) {
      setResult(null);
      setError(e?.message || 'Explanation temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 border border-gray-200 rounded-lg bg-white">
      <button
        type="button"
        onClick={togglePanel}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={isPanelOpen}
      >
        <div>
          <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <span>Explanation</span>
            <span className="text-xs font-normal text-blue-600">powered by ChainGPT Web3 LLM</span>
          </div>
          <div className="text-xs text-gray-500">
            Plain-English summary based on structured signals.
          </div>
        </div>
        <div className="text-sm text-gray-500">{isPanelOpen ? 'Hide' : 'Show'}</div>
      </button>

      {isPanelOpen && (
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              History: off (single-shot)
            </div>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-gray-800 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? 'Generating…' : result ? 'Regenerate Analysis' : 'Generate Analysis'}
            </button>
          </div>

          {error && (
            <div className="text-base text-red-700 bg-red-50 border border-red-100 rounded-lg p-4">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Verdict Header */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Algo Verdict
                </div>
                <div
                  className={`text-lg font-black px-4 py-1.5 rounded-lg shadow-sm uppercase tracking-wide
                  ${result.stance === 'long_yes'
                      ? 'bg-green-100 text-green-900 border border-green-200'
                      : result.stance === 'long_no'
                        ? 'bg-red-100 text-red-900 border border-red-200'
                        : result.stance === 'avoid'
                          ? 'bg-orange-100 text-orange-900 border border-orange-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                >
                  {result.details?.verdict || stanceLabel(result.stance)}
                </div>
              </div>

              {/* Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Valuation */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <div className="text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <span className="text-lg">📊</span> Valuation
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed font-medium">
                    {result.details?.valuation || 'Analysis unavailable.'}
                  </div>
                </div>

                {/* Smart Money */}
                <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                  <div className="text-xs font-bold text-purple-800 mb-2 uppercase tracking-wide flex items-center gap-2">
                    <span className="text-lg">🏦</span> Smart Money
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed font-medium">
                    {result.details?.smart_money || 'Flow data unavailable.'}
                  </div>
                </div>
              </div>

              {/* Deep Dive Analysis */}
              {result.details?.detailed_analysis && (
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-4">
                  <div className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-2">
                    <span className="text-lg">🧐</span> Analyst Deep Dive
                  </div>
                  <div className="text-sm text-gray-800 leading-relaxed font-medium whitespace-pre-wrap">
                    {result.details.detailed_analysis}
                  </div>
                </div>
              )}

              {/* Legacy/Fallback Summary (if no details) */}
              {!result.details && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                  <div className="text-lg text-gray-900 leading-relaxed font-medium">
                    {result.summary}
                  </div>
                </div>
              )}
            </div>
          )}

          {!error && !result && (
            <div className="text-base text-gray-600 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="mb-2 text-lg font-semibold text-gray-800">Ready to Analyze</p>
              <p>Click <span className="font-bold text-gray-900">"Generate Analysis"</span> to get a real-time, AI-powered predictive model assessment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

