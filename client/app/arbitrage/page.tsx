'use client';

import { useEffect, useState } from 'react';
import { PredictorIQClient, ArbitrageAlertsResponse } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
});

export default function ArbitragePage() {
  const [data, setData] = useState<ArbitrageAlertsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.getArbitrageAlerts()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">⚡ Arbitrage Scanner</h1>
      <p className="text-gray-600 mb-8">Real-time cross-platform price spreads</p>

      {data.alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">No arbitrage opportunities detected at this time.</p>
          <p className="text-sm text-gray-400 mt-2">Threshold: 3% | Scanning all platforms</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.alerts.map((alert, idx) => {
            const buyLeg = alert.legs.find(l => l.action === 'buy');
            const sellLeg = alert.legs.find(l => l.action === 'sell');

            return (
              <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{alert.event_title}</h3>
                  <span className="text-2xl font-bold text-green-600">
                    {alert.spread_percent.toFixed(2)}%
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {buyLeg && (
                    <div className="bg-green-50 rounded p-4">
                      <div className="text-sm text-gray-600 mb-1">BUY (cheaper)</div>
                      <div className="font-semibold text-gray-900">{buyLeg.platform}</div>
                      <div className="text-lg font-bold text-green-700">
                        {(buyLeg.price * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Liquidity: ${buyLeg.liquidity.toLocaleString()}
                      </div>
                    </div>
                  )}
                  {sellLeg && (
                    <div className="bg-red-50 rounded p-4">
                      <div className="text-sm text-gray-600 mb-1">SELL (expensive)</div>
                      <div className="font-semibold text-gray-900">{sellLeg.platform}</div>
                      <div className="text-lg font-bold text-red-700">
                        {(sellLeg.price * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Liquidity: ${sellLeg.liquidity.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Confidence: {(alert.mapping_confidence * 100).toFixed(0)}%</span>
                  <span>Detected {new Date(alert.detected_at).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
