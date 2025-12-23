'use client';

import { useEffect, useState } from 'react';
import { PredictorIQClient, StrategyListResponse } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

export default function StrategiesPage() {
  const [data, setData] = useState<StrategyListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getStrategies()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">🎯 Trading Strategies</h1>
      <p className="text-gray-600 mb-8">Proven strategy templates for prediction markets</p>

      <div className="grid gap-6">
        {data.strategies.map((strategy) => (
          <div key={strategy.strategy_id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{strategy.name}</h3>
                <p className="text-gray-600">{strategy.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  strategy.risk_level === 'low' ? 'bg-green-100 text-green-700' :
                  strategy.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {strategy.risk_level.toUpperCase()} RISK
                </span>
                <span className="text-sm text-gray-500">{strategy.time_horizon}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Entry Signals</h4>
                <ul className="space-y-1">
                  {strategy.entry_signals.map((signal, idx) => (
                    <li key={idx} className="text-sm text-gray-700">✓ {signal}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-50 rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Exit Signals</h4>
                <ul className="space-y-1">
                  {strategy.exit_signals.map((signal, idx) => (
                    <li key={idx} className="text-sm text-gray-700">✗ {signal}</li>
                  ))}
                </ul>
              </div>
            </div>

            {strategy.expected_edge && (
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <span className="text-sm font-semibold text-green-900">Expected Edge: </span>
                <span className="text-sm text-green-700">{strategy.expected_edge}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
