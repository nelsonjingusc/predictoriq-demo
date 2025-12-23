'use client';

import { useEffect, useState } from 'react';
import { PredictorIQClient, MarketIdeasResponse } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

export default function IdeasPage() {
  const [data, setData] = useState<MarketIdeasResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getMarketIdeas()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">💡 Market Creation Ideas</h1>
      <p className="text-gray-600 mb-8">Data-driven suggestions for new prediction markets</p>

      <div className="grid gap-6">
        {data.ideas.map((idea) => (
          <div key={idea.idea_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded font-medium">
                {idea.category}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{idea.description}</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
              <p className="text-sm text-gray-700">
                <strong className="text-yellow-900">Rationale:</strong> {idea.rationale}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded p-3">
                <span className="text-gray-600">Potential Liquidity:</span>
                <span className={`ml-2 font-semibold ${
                  idea.potential_liquidity === 'high' ? 'text-green-600' :
                  idea.potential_liquidity === 'medium' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {idea.potential_liquidity.toUpperCase()}
                </span>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <span className="text-gray-600">Time Sensitivity:</span>
                <span className={`ml-2 font-semibold ${
                  idea.time_sensitivity === 'high' ? 'text-red-600' :
                  idea.time_sensitivity === 'medium' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {idea.time_sensitivity.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
