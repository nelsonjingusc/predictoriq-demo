import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          PredictorIQ
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          The Morningstar for Prediction Markets
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          AI-powered intelligence across Kalshi, Polymarket, and Limitless.
          Get ranked recommendations, arbitrage alerts, and automated research.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/top10"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            View Top10
          </Link>
          <Link
            href="/waitlist"
            className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Join Waitlist
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <FeatureCard
          icon="📊"
          title="AI-Ranked Top10"
          description="LightGBM + LLM powered daily recommendations"
          link="/top10"
        />
        <FeatureCard
          icon="⚡"
          title="Arbitrage Scanner"
          description="Real-time cross-platform price spreads"
          link="/arbitrage"
        />
        <FeatureCard
          icon="🎯"
          title="Trading Strategies"
          description="Personalized strategy templates"
          link="/strategies"
        />
        <FeatureCard
          icon="💡"
          title="Market Ideas"
          description="Data-driven creation suggestions"
          link="/ideas"
        />
        <FeatureCard
          icon="🤖"
          title="AI Agents"
          description="Alpha Scout, Portfolio Guardian, Research Autopilot"
          link="/agents"
        />
        <FeatureCard
          icon="📈"
          title="Greek-Style Risk"
          description="Binary event analytics"
          link="/api#greeks"
        />
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-600 mb-6">
          Join early access for Pro features and API access
        </p>
        <Link
          href="/waitlist"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Request Access
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: {
  icon: string;
  title: string;
  description: string;
  link: string;
}) {
  return (
    <Link href={link} className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
