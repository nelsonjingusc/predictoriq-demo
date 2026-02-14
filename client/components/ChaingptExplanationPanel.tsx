'use client';

import { useMemo, useState } from 'react';
import type { MarketExplanation, MarketSignal } from '@/src/chaingpt/domain/markets/types';

type Props = {
  signal: MarketSignal;
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

export default function ChaingptExplanationPanel({ signal }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MarketExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
        aria-expanded={open}
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
        <div className="text-sm text-gray-500">{open ? 'Hide' : 'Show'}</div>
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-gray-500">
              History: off (single-shot)
            </div>
            <button
              type="button"
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? 'Generating…' : result ? 'Regenerate' : 'Generate'}
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold text-gray-700">
                  Stance
                </div>
                <div className="text-xs font-semibold text-gray-900">
                  {stanceLabel(result.stance)}
                </div>
              </div>
              <div className="text-sm text-gray-800 leading-relaxed">
                {result.summary}
              </div>
            </div>
          )}

          {!error && !result && (
            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3">
              Click “Generate” to request an explanation.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

