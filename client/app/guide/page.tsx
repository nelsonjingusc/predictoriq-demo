'use client';

import { useState } from 'react';

type Message = { role: 'user' | 'assistant'; text: string };

export default function BeginnerGuidePage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Welcome to Prediction Markets! I\'m here to help you get started. Ask me anything:\n\n• What are prediction markets?\n• How do I make my first trade?\n• What strategies work best for beginners?\n• How do odds and probabilities work?\n• What are the risks I should know about?\n\nOr just ask your own question!',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickQuestions = [
    'What are prediction markets?',
    'How do I get started?',
    'What strategies work for beginners?',
    'How do odds work?',
    'What are the main risks?',
  ];

  async function send(q?: string) {
    const questionText = q || question.trim();
    if (!questionText || loading) return;

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, { role: 'user', text: questionText }]);
    setQuestion('');

    try {
      const res = await fetch('/api/chaingpt/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: questionText }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`);
      setMessages((prev) => [...prev, { role: 'assistant', text: String(json.answer || '') }]);
    } catch (e: any) {
      setError(e?.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Prediction Market Beginner Guide
            </h1>
            <p className="text-lg text-gray-600">
              Powered by ChainGPT Web3 LLM — Your AI guide to prediction markets
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-[500px] overflow-auto p-6 space-y-4">
              {messages.map((m, idx) => (
                <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={[
                      'inline-block max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
                      m.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900 border border-gray-200',
                    ].join(' ')}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-left">
                  <div className="inline-block bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-500">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="px-6 py-3 bg-red-50 border-t border-red-100 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex gap-2 mb-3">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask anything about prediction markets..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={loading}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    disabled={loading}
                    className="text-xs bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 disabled:opacity-60"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            This guide uses ChainGPT Web3 LLM to answer your questions about prediction markets.
          </div>
        </div>
      </div>
    </div>
  );
}
