'use client';

import { useEffect, useState } from 'react';
import { PredictorIQClient, AgentFeedResponse } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

export default function AgentsPage() {
  const [data, setData] = useState<AgentFeedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');

  useEffect(() => {
    const filter = selectedAgent === 'all' ? undefined : selectedAgent;
    client.getAgentFeed(filter)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedAgent]);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!data) return null;

  const agentIcons = {
    alpha_scout: '🎯',
    portfolio_guardian: '🛡️',
    research_autopilot: '📊'
  };

  const agentNames = {
    alpha_scout: 'Alpha Scout',
    portfolio_guardian: 'Portfolio Guardian',
    research_autopilot: 'Research Autopilot'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 AI Agents Feed</h1>
      <p className="text-gray-600 mb-6">Real-time insights from your AI trading assistants</p>

      {/* Agent Filter */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setSelectedAgent('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedAgent === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Agents
        </button>
        <button
          onClick={() => setSelectedAgent('alpha_scout')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedAgent === 'alpha_scout'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎯 Alpha Scout
        </button>
        <button
          onClick={() => setSelectedAgent('portfolio_guardian')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedAgent === 'portfolio_guardian'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🛡️ Portfolio Guardian
        </button>
        <button
          onClick={() => setSelectedAgent('research_autopilot')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedAgent === 'research_autopilot'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 Research Autopilot
        </button>
      </div>

      {/* Messages Feed */}
      <div className="space-y-4">
        {data.messages.map((message, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-lg shadow-sm p-5 border-l-4 ${
              message.priority === 'high' ? 'border-red-500' :
              message.priority === 'medium' ? 'border-yellow-500' :
              'border-blue-500'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{agentIcons[message.agent]}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{message.title}</h3>
                  <p className="text-sm text-gray-500">
                    {agentNames[message.agent]} · {new Date(message.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                message.priority === 'high' ? 'bg-red-100 text-red-700' :
                message.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {message.priority.toUpperCase()}
              </span>
            </div>

            <div className="prose prose-sm max-w-none">
              <div className="text-gray-700 whitespace-pre-line">{message.content}</div>
            </div>

            {message.message_type === 'opportunity' && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View Details →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {data.messages.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">No messages from agents yet.</p>
          <p className="text-sm text-gray-400 mt-2">Messages will appear as agents discover opportunities and insights.</p>
        </div>
      )}
    </div>
  );
}
