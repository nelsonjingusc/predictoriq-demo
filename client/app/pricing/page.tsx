import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Get started with basic prediction market intelligence',
      features: [
        'Daily Top10 recommendations',
        'Basic arbitrage scanner',
        '10 API calls per day',
        'Community support',
        'Market data (1 hour delay)'
      ],
      cta: 'Get Started',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$49',
      period: 'per month',
      description: 'For serious traders who need real-time insights',
      features: [
        'Real-time Top10 updates',
        'Full arbitrage scanner',
        '1,000 API calls per day',
        'Trading strategy templates',
        'Priority support',
        'Real-time market data',
        'Greek-style risk metrics',
        'Email alerts'
      ],
      cta: 'Start Pro Trial',
      highlighted: true
    },
    {
      name: 'Agent',
      price: '$199',
      period: 'per month',
      description: 'Unlock AI agents for automated intelligence',
      features: [
        'Everything in Pro',
        '10,000 API calls per day',
        'Alpha Scout agent',
        'Portfolio Guardian agent',
        'Research Autopilot agent',
        'Custom alerts (Email/Telegram/Discord)',
        'Advanced portfolio analytics',
        'Dedicated support'
      ],
      cta: 'Start Agent Trial',
      highlighted: false
    },
    {
      name: 'Institutional',
      price: 'Custom',
      period: 'contact us',
      description: 'For funds and institutions requiring enterprise features',
      features: [
        'Everything in Agent',
        'Unlimited API calls',
        'White-label dashboard',
        'Custom AI models',
        'Dedicated infrastructure',
        'SLA guarantees',
        'Custom integrations',
        'On-premise deployment option'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">Choose the plan that fits your trading style</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg p-8 ${
              plan.highlighted
                ? 'bg-blue-600 text-white shadow-xl scale-105'
                : 'bg-white shadow-sm border border-gray-200'
            }`}
          >
            <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
              {plan.name}
            </h3>
            <div className="mb-4">
              <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                {plan.price}
              </span>
              <span className={`text-sm ml-2 ${plan.highlighted ? 'text-blue-100' : 'text-gray-500'}`}>
                {plan.period}
              </span>
            </div>
            <p className={`mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600'}`}>
              {plan.description}
            </p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className={plan.highlighted ? 'text-blue-200' : 'text-green-600'}>✓</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white' : 'text-gray-700'}`}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/waitlist"
              className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                plan.highlighted
                  ? 'bg-white text-blue-600 hover:bg-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Can I switch plans anytime?</h3>
            <p className="text-gray-600">Yes! Upgrade or downgrade anytime. Changes take effect immediately.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">We accept all major credit cards, PayPal, and crypto (USDC/USDT).</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
            <p className="text-gray-600">Yes! Pro and Agent plans come with a 14-day free trial. No credit card required.</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">How does the API quota work?</h3>
            <p className="text-gray-600">API calls reset daily at midnight UTC. Unused calls don't roll over.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
