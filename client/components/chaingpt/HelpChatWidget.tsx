'use client';

import { useMemo, useState } from 'react';
import { getOrCreateChatSessionId } from '@/components/chaingpt/session';

type Message = { role: 'user' | 'assistant'; text: string };

export default function HelpChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hi! New to prediction markets? Ask me anything — how they work, how to get started, what strategies work best, or any questions about trading.' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sessionId = useMemo(() => getOrCreateChatSessionId('chaingpt_help_session'), []);

  async function send() {
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setQuestion('');

    try {
      const res = await fetch('/api/chaingpt/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, sessionId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      setMessages((prev) => [...prev, { role: 'assistant', text: String(json.answer || '') }]);
    } catch (e: any) {
      setError(e?.message || 'Help is temporarily unavailable');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[min(360px,calc(100vw-2.5rem))] rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
            <div>
              <div className="text-sm font-semibold text-white">Prediction Market Guide</div>
              <div className="text-xs text-blue-300">powered by ChainGPT Web3 LLM</div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-gray-200 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="p-3">
            <div className="h-56 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
              <div className="space-y-2">
                {messages.map((m, idx) => (
                  <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                    <div
                      className={[
                        'inline-block max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed',
                        m.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800',
                      ].join(' ')}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="text-left">
                    <div className="inline-block bg-white border border-gray-200 text-gray-500 rounded-lg px-4 py-3 text-sm leading-relaxed shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="font-medium text-xs tracking-wide">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md p-2">
                {error}
              </div>
            )}

            <div className="mt-3 flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
                placeholder="Ask a question…"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={send}
                disabled={loading}
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? '…' : 'Send'}
              </button>
            </div>

            <div className="mt-2 text-[11px] text-gray-500">
              Session: {sessionId}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-full bg-gray-900 text-white px-4 py-3 shadow-lg hover:bg-gray-800 text-sm font-semibold"
      >
        {open ? 'Close Guide' : 'Need Help?'}
      </button>
    </div>
  );
}

