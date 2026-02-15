'use client';

import { useState } from 'react';

type Message = { role: 'user' | 'assistant'; text: string };

export default function BeginnerGuidePage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const learningCards = [
    {
      icon: '🌱',
      title: 'What are prediction markets?',
      description: 'Learn the basics',
      gradient: 'from-emerald-50 to-green-50',
      border: 'border-emerald-200',
      hover: 'hover:shadow-emerald-200/50',
    },
    {
      icon: '💰',
      title: 'How do I make my first trade?',
      description: 'Get started trading',
      gradient: 'from-amber-50 to-yellow-50',
      border: 'border-amber-200',
      hover: 'hover:shadow-amber-200/50',
    },
    {
      icon: '🎯',
      title: 'What strategies work best?',
      description: 'Smart trading tips',
      gradient: 'from-orange-50 to-amber-50',
      border: 'border-orange-200',
      hover: 'hover:shadow-orange-200/50',
    },
    {
      icon: '📊',
      title: 'How do odds work?',
      description: 'Understand probabilities',
      gradient: 'from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      hover: 'hover:shadow-emerald-200/50',
    },
    {
      icon: '⚠️',
      title: 'What are the main risks?',
      description: 'Stay safe & informed',
      gradient: 'from-rose-50 to-orange-50',
      border: 'border-rose-200',
      hover: 'hover:shadow-rose-200/50',
    },
    {
      icon: '🚀',
      title: 'Advanced strategies',
      description: 'Level up your skills',
      gradient: 'from-violet-50 to-purple-50',
      border: 'border-violet-200',
      hover: 'hover:shadow-violet-200/50',
    },
  ];

  const quickQuestions = [
    { text: 'What are prediction markets?', icon: '🌱' },
    { text: 'How do I get started?', icon: '💰' },
    { text: 'What strategies work for beginners?', icon: '🎯' },
    { text: 'How do odds work?', icon: '📊' },
    { text: 'What are the main risks?', icon: '⚠️' },
  ];

  async function send(q?: string) {
    const questionText = q || question.trim();
    if (!questionText || loading) return;

    setShowWelcome(false);
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

  function clearHistory() {
    setMessages([]);
    setQuestion('');
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-4xl shadow-lg">
                🦉
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">
                  Welcome to Your Journey! 🌱
                </h1>
                <p className="text-lg text-stone-600 mt-1">
                  I'm Sage, your friendly guide to prediction markets
                </p>
              </div>
            </div>
            <p className="text-sm text-stone-500 max-w-2xl mx-auto">
              Powered by ChainGPT Web3 LLM — Let's learn together!
            </p>
          </div>

          {/* Welcome Cards or Chat */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {showWelcome ? (
              <div className="p-8">
                <h2 className="text-2xl font-semibold text-stone-800 mb-6 text-center">
                  What would you like to learn today?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {learningCards.map((card) => (
                    <button
                      key={card.title}
                      onClick={() => send(card.title)}
                      className={`group bg-gradient-to-br ${card.gradient} border-2 ${card.border} rounded-2xl p-6 hover:shadow-xl ${card.hover} hover:-translate-y-1 transition-all duration-300 text-left`}
                    >
                      <div className="text-4xl mb-3">{card.icon}</div>
                      <h3 className="font-semibold text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-stone-600">{card.description}</p>
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm text-stone-500 mb-4">Or ask your own question below 👇</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-[600px]">
                {/* Chat Header with Back Button */}
                <div className="px-6 py-4 border-b border-stone-100 bg-white/50 backdrop-blur-sm flex justify-between items-center z-10">
                  <button
                    onClick={() => setShowWelcome(true)}
                    className="text-sm font-medium text-stone-500 hover:text-emerald-600 flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50"
                  >
                    <span>←</span> Back to Topics
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={clearHistory}
                      className="text-xs font-medium text-stone-400 hover:text-rose-500 transition-colors px-2 py-1 rounded hover:bg-rose-50"
                    >
                      Clear History
                    </button>
                    <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Chat with Sage 🦉
                    </div>
                  </div>
                </div>

                {/* Scrollable Chat Area */}
                <div className="flex-1 overflow-auto p-6 space-y-4">
                  {messages.map((m, idx) => (
                    <div key={idx} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                      {m.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-lg mr-2 flex-shrink-0 shadow-md">
                          🦉
                        </div>
                      )}
                      <div
                        className={[
                          'max-w-[85%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap shadow-md',
                          m.role === 'user'
                            ? 'bg-gradient-to-br from-amber-100 to-yellow-100 text-stone-800 border-2 border-amber-200'
                            : 'bg-gradient-to-br from-emerald-50 to-green-50 text-stone-800 border-2 border-emerald-200',
                        ].join(' ')}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-lg mr-2 flex-shrink-0 shadow-md animate-pulse">
                        🦉
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-3xl px-5 py-3.5 text-sm text-stone-600 shadow-md">
                        Thinking...
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="px-6 py-3 bg-rose-50 border-t-2 border-rose-200 text-sm text-rose-700">
                {error}
              </div>
            )}

            {/* Input Area */}
            <div className="border-t-2 border-stone-100 p-6 bg-gradient-to-br from-stone-50 to-amber-50/30">
              <div className="flex gap-3 mb-4">
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
                  className="flex-1 rounded-2xl border-2 border-emerald-200 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 bg-white/80 backdrop-blur-sm shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={loading}
                  className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3 text-sm font-semibold text-white hover:from-emerald-600 hover:to-green-700 disabled:opacity-60 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {loading ? 'Sending...' : 'Send ✨'}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q) => (
                  <button
                    key={q.text}
                    type="button"
                    onClick={() => send(q.text)}
                    disabled={loading}
                    className="text-xs bg-white/80 backdrop-blur-sm border-2 border-stone-200 text-stone-700 px-4 py-2 rounded-full hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-60 transition-all hover:scale-105 shadow-sm"
                  >
                    {q.icon} {q.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-stone-500 bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-stone-200">
            <span className="inline-flex items-center gap-2">
              <span className="text-lg">🦉</span>
              <span>Sage uses ChainGPT Web3 LLM to answer your questions with expertise and care</span>
            </span>
          </div>
        </div>
      </div>
    </div >
  );
}
