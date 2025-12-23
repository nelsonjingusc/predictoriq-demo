# PredictorIQ Client (Open Source)

**The Morningstar for Prediction Markets** - AI-powered analytics dashboard for Kalshi, Polymarket, and Limitless.

## Features

- **📊 Top10 Daily Recommendations**: AI-ranked market opportunities
- **⚡ Cross-Platform Arbitrage Scanner**: Real-time price spread detection
- **🎯 Trading Strategies**: Personalized strategy templates
- **💡 Market Creation Ideas**: Data-driven suggestions for new markets
- **🤖 Three AI Agents**:
  - Alpha Scout: Opportunity discovery
  - Portfolio Guardian: Risk monitoring
  - Research Autopilot: Automated research reports
- **📈 Greek-Style Risk Metrics**: Binary event analytics
- **🔌 Developer API**: Easy integration with your apps

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- PredictorIQ server running (or use public API)

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API endpoint
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
predictoriq-client/
├── app/                    # Next.js app directory
│   ├── top10/             # Top10 page
│   ├── arbitrage/         # Arbitrage scanner
│   ├── strategies/        # Trading strategies
│   ├── ideas/             # Market ideas
│   ├── agents/            # AI agents feed
│   ├── pricing/           # Pricing tiers
│   ├── api/               # API documentation
│   └── waitlist/          # Early access signup
├── components/            # React components
├── packages/sdk/          # PredictorIQ SDK
└── public/               # Static assets
```

## SDK Usage

```typescript
import { PredictorIQClient } from '@predictoriq/sdk';

const client = new PredictorIQClient({
  apiUrl: 'http://localhost:8000'
});

// Get Top10 recommendations
const top10 = await client.getDailyTop10();

// Get arbitrage alerts
const arb = await client.getArbitrageAlerts();

// Run research
const report = await client.runResearch({
  query: 'Will Bitcoin ETF get approved?'
});
```

## Demo Pages

- `/` - Homepage with overview
- `/top10` - Daily Top10 recommendations
- `/arbitrage` - Arbitrage opportunities
- `/strategies` - Trading strategy templates
- `/ideas` - Market creation ideas
- `/agents` - AI agent message feed
- `/pricing` - Subscription plans
- `/api` - API documentation & examples
- `/waitlist` - Early access signup

## Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Contributing

We welcome contributions! This is the open-source dashboard for PredictorIQ.

## License

MIT License - feel free to use in your projects!

## Links

- [Website](https://nelsonjingusc.github.io/predictoriq-site/)
- [API Docs](http://localhost:3000/api)
- [Discord Community](#)
