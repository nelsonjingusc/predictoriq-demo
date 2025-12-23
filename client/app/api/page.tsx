export default function APIPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">🔌 API Documentation</h1>
      <p className="text-gray-600 mb-8">Developer-friendly REST API for prediction market intelligence</p>

      {/* Quick Start */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Start</h2>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">1. Install SDK</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>npm install @predictoriq/sdk</code>
          </pre>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">2. Initialize Client</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`import { PredictorIQClient } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: 'https://api.predictoriq.com',
  apiKey: 'your-api-key'
});`}</code>
          </pre>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">3. Make Requests</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
            <code>{`// Get daily Top10
const top10 = await client.getDailyTop10();

// Get arbitrage alerts
const arb = await client.getArbitrageAlerts();

// Run research
const report = await client.runResearch({
  query: 'Bitcoin ETF approval odds'
});`}</code>
          </pre>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">API Endpoints</h2>

        <EndpointCard
          method="GET"
          path="/v1/daily-top10"
          description="Get AI-ranked daily Top10 market recommendations"
          example={`const top10 = await client.getDailyTop10();`}
        />

        <EndpointCard
          method="GET"
          path="/v1/arbitrage/alerts"
          description="Get current cross-platform arbitrage opportunities"
          example={`const alerts = await client.getArbitrageAlerts();`}
        />

        <EndpointCard
          method="GET"
          path="/v1/strategies"
          description="Get personalized trading strategy templates"
          example={`const strategies = await client.getStrategies();`}
        />

        <EndpointCard
          method="GET"
          path="/v1/ideas"
          description="Get market creation ideas"
          example={`const ideas = await client.getMarketIdeas();`}
        />

        <EndpointCard
          method="POST"
          path="/v1/research/run"
          description="Run research autopilot on a query"
          example={`const report = await client.runResearch({
  query: 'Will Bitcoin ETF get approved?',
  max_duration_seconds: 60
});`}
        />

        <EndpointCard
          method="GET"
          path="/v1/agents/feed"
          description="Get AI agent message feed"
          example={`const feed = await client.getAgentFeed('alpha_scout');`}
        />
      </div>

      {/* Interactive Docs */}
      <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive API Documentation</h2>
        <p className="text-gray-600 mb-6">
          Explore the full API with Swagger UI
        </p>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Open Swagger Docs →
        </a>
      </div>
    </div>
  );
}

function EndpointCard({ method, path, description, example }: {
  method: string;
  path: string;
  description: string;
  example: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        <span className={`px-3 py-1 rounded font-mono text-sm font-semibold ${
          method === 'GET' ? 'bg-green-100 text-green-700' :
          method === 'POST' ? 'bg-blue-100 text-blue-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {method}
        </span>
        <code className="text-lg font-mono text-gray-900">{path}</code>
      </div>

      <p className="text-gray-600 mb-4">{description}</p>

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Example</h4>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
          <code>{example}</code>
        </pre>
      </div>
    </div>
  );
}
