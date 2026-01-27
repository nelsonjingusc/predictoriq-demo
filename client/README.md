# PredictorIQ Client

This is the Next.js client for the PredictorIQ demo, built to run in **demo mode** (mock data) by default.

This branch also includes a **server-side ChainGPT integration** (via Next.js API routes) used to turn structured signals into clear explanations and agent-ready text. The client never receives model credentials.

## What’s Included (Client)

- **Top10 page** with explanation + Q&A entry points
- **Help widget** for onboarding and metric explanations
- **ChainGPT preview page** to generate daily notes and social text (text-only; no posting)

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install

# Run development server (demo mode recommended)
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Environment

Client-side:
- `NEXT_PUBLIC_DEMO_MODE=true` (recommended)
- `NEXT_PUBLIC_API_URL` (only needed for live backend mode)

Server-side (optional, for live ChainGPT calls):
- `CHAINGPT_API_KEY`
- `CHAINGPT_MODEL` (default: `general_assistant`)

## Project Structure

```
predictoriq-client/
├── app/                    # Next.js app directory
│   ├── top10/             # Top10 page
│   ├── arbitrage/         # Arbitrage scanner
│   ├── strategies/        # Trading strategies
│   ├── ideas/             # Market ideas
│   ├── agents/            # AI agents feed
│   ├── chaingpt/          # ChainGPT preview page
│   ├── pricing/           # Pricing tiers
│   ├── api/               # API documentation
│   └── waitlist/          # Early access signup
├── components/            # React components
├── packages/sdk/          # PredictorIQ SDK
└── src/chaingpt/           # ChainGPT domain + server wrapper
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
- `/chaingpt` - ChainGPT preview (text generation + daily note)
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
