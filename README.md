# PredictorIQ Demo

This repository contains the public demo dashboard and docs for **PredictorIQ**, a prediction market intelligence and agent infrastructure project.

## What's in This Repo

- **Frontend UI** (`client/`): Complete Next.js dashboard showcasing the product interface
- **TypeScript SDK** (`client/packages/sdk/`): Client library for API integration
- **Documentation** (`docs/`): Product overview, architecture, and demo guide

## Quick Start

```bash
# Install and run the demo
cd client
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

**Note**: This is a frontend-only demo. The UI will attempt to call backend APIs (which are not included in this public repo). API calls will fail, but you can still explore the complete UI and see how the product is designed.

## Documentation

**Getting Started:**
- **[Quick Start](docs/QUICK_START.md)**: 5-minute guide to get the demo running

**Detailed Documentation:**
- **[Demo Guide](docs/DEMO_GUIDE.md)**: Step-by-step walkthrough of the UI
- **[Product Overview](docs/PRODUCT_OVERVIEW.md)**: High-level product vision and features
- **[Architecture Overview](docs/ARCHITECTURE_OVERVIEW.md)**: System design and technical architecture

## Project Structure

```
predictoriq-demo/
├── client/                 # Next.js frontend application
│   ├── app/               # Next.js app router pages
│   │   ├── top10/         # Top10 recommendations page
│   │   ├── arbitrage/     # Arbitrage scanner
│   │   ├── strategies/    # Trading strategies
│   │   ├── ideas/         # Market creation ideas
│   │   ├── agents/        # AI agents feed
│   │   └── ...
│   ├── packages/sdk/      # TypeScript SDK
│   └── components/        # React components
└── docs/                  # Documentation
```

## POC Implementation

This demo showcases:

1. **Frontend Architecture**: Modern Next.js 14 app with TypeScript
2. **UI/UX Design**: Complete dashboard with all planned features
3. **SDK Design**: TypeScript SDK showing API integration patterns
4. **Component Structure**: Reusable React components

**What's NOT included** (in private repo):
- Backend API server
- Data ingestion from Kalshi/Polymarket
- ML ranking models
- AI agents implementation
- Real-time data processing

The frontend is designed to work with a backend API at `http://localhost:8000`, but for this demo, you can explore the UI structure and design without the backend.

## For Reviewers

This repository demonstrates:
- ✅ Product vision and UI/UX design
- ✅ Frontend architecture and code quality
- ✅ SDK design and API patterns
- ✅ Technical documentation

To understand the full system (including backend), see the architecture docs or contact the team for access to the private repository.

---

**For detailed demo instructions, see [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md)**
