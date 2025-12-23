'use client';

import { useEffect, useState } from 'react';
import { PredictorIQClient, Top10Response } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

export default function Top10Page() {
  const [data, setData] = useState<Top10Response | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await client.getDailyTop10();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch Top10');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-16 text-center text-red-600">Error: {error}</div>;
  if (!data) return <div className="container mx-auto px-4 py-16 text-center">No data</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Daily Top10</h1>
      <p className="text-gray-600 mb-8">AI-ranked market opportunities across all platforms</p>

      <div className="space-y-4">
        {data.items.map((item) => (
          <div key={item.rank} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-blue-600">#{item.rank}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.market.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {item.market.platform}
                    </span>
                    <span className="text-sm text-gray-500">{item.market.category}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{item.ai_score.toFixed(1)}</div>
                <div className="text-sm text-gray-500">AI Score</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div>
                <span className="text-gray-500">Price:</span>
                <span className="ml-2 font-semibold">{(item.market.mid_price * 100).toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-gray-500">Volume 24h:</span>
                <span className="ml-2 font-semibold">${item.market.volume_24h.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Liquidity:</span>
                <span className="ml-2 font-semibold">${item.market.liquidity.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded p-3 mb-3">
              <p className="text-sm text-gray-700">💡 <strong>Edge:</strong> {item.edge_rationale}</p>
            </div>

            {item.recommended_action && (
              <div className="text-sm text-gray-600">
                <strong>Recommended:</strong> {item.recommended_action}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Confidence: {(item.confidence * 100).toFixed(0)}%
              </div>
              <a
                href={item.market.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Market →
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm text-gray-500 text-center">
        Generated at {new Date(data.generated_at).toLocaleString()} |
        Analyzed {data.metadata.total_markets_analyzed} markets
      </div>
    </div>
  );
}
