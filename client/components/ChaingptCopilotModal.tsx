'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MarketSignal } from '@/src/chaingpt/domain/markets/types';
import { getOrCreateChatSessionId } from '@/components/chaingpt/session';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  signal: MarketSignal;
  title: string;
};

export default function ChaingptCopilotModal({ open, onClose, signal, title }: Props) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = useMemo(() => getOrCreateChatSessionId('chaingpt_copilot_session'), []);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setQuestion('');
    setMessages([]);
  }, [open]);

  async function submit() {
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');

    try {
      const res = await fetch('/api/chaingpt/research-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, signal, sessionId }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || `Request failed (${res.status})`);
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: String(json.answer || '') }]);
    } catch (e: any) {
      setError(e?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute left-1/2 top-1/2 w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-start justify-between p-5 border-b border-gray-200">
          <div>
            <div className="text-sm font-semibold text-gray-900">Ask PredictorIQ</div>
            <div className="text-xs text-gray-500">
              Market: <span className="font-medium text-gray-700">{title}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="p-5">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 h-64 overflow-auto">
            {messages.length === 0 ? (
              <div className="text-sm text-gray-600">
                Ask a question about pricing, arbitrage, liquidity, or what looks unusual.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div
                      className={[
                        'inline-block max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                        m.role === 'user'
                          ? 'bg-gray-900 text-white'
                          : 'bg-white border border-gray-200 text-gray-800',
                      ].join(' ')}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
              }}
              placeholder="Type your question…"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            Session: {sessionId} · Chat history: on
          </div>
        </div>
      </div>
    </div>
  );
}

