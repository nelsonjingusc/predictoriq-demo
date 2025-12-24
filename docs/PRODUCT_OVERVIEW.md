# PredictorIQ

> AI-Powered Prediction Market Intelligence Layer

**Status**: Public Demo / POC
**Version**: 1.0

---

## Overview

PredictorIQ is an intelligent layer on top of prediction markets that helps traders discover opportunities where they have unique informational edge.

### Core Philosophy

> **"Don't trade what's popular. Trade what you know."**

Traditional prediction market platforms show you the most traded markets. PredictorIQ shows you markets where **you** are most likely to have an advantage based on your expertise, background, and interests.

---

## Key Features

### 🎯 Personalized Recommendations

Match users to markets based on:
- Professional background (finance, tech, law, journalism, etc.)
- Domain expertise (politics, economics, crypto, sports, etc.)
- Geographic location (local information advantage)
- Trading style preferences

### 📊 Multi-Platform Aggregation

- Unified view of 3,600+ markets across Kalshi and Polymarket
- Normalized data schema
- Real-time updates every 5-15 minutes

### 🤖 AI-Powered Ranking

- Machine learning-based market scoring
- LLM-generated rationales
- Personalization boosts based on user profile

### ⚖️ Cross-Platform Arbitrage

- Detects price discrepancies across platforms
- Fuzzy matching for similar events
- Real-time opportunity alerts

### 📈 Greek-Style Risk Metrics

- Directional exposure (Delta proxy)
- Convexity risk (Gamma proxy)
- Liquidity risk
- Event time risk (Theta proxy)

---

## Architecture

```
Client (Next.js)
    ↓
Server (FastAPI + AI)
    ↓
External Prediction Markets
(Kalshi, Polymarket)
```

### Technology Stack

**Frontend**:
- Next.js 14 + TypeScript
- Tailwind CSS
- React Query

**Backend** (Private):
- Python + FastAPI
- LightGBM (ML ranking)
- OpenAI API (LLM rationales)
- PostgreSQL + Redis

For detailed architecture, see [ARCHITECTURE_OVERVIEW.md](./ARCHITECTURE_OVERVIEW.md)

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-public-repo-url>
cd predictoriq-demo

# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Mode

The public demo runs with:
- Mock backend data for demonstration
- Limited to frontend UI showcase
- Full backend requires private server deployment

For full backend setup, contact the development team.

---

## Demo Guide

See [DEMO_GUIDE.md](./DEMO_GUIDE.md) for a complete walkthrough of features and UI.

---

## Use Cases

### For Individual Traders

- **Finance Professional**: Get fed rate decision and inflation markets prioritized
- **Tech Worker**: See AI/tech product launch markets first
- **Lawyer**: Regulatory and legal outcome markets highlighted
- **Crypto Native**: Bitcoin, Ethereum, and DeFi markets surfaced

### For Market Platforms

- White-label intelligence layer
- Improved user retention through personalization
- Cross-platform analytics and insights

### For Institutional Traders

- Systematic opportunity discovery
- Risk management with Greek-style metrics
- Multi-platform arbitrage detection

---

## Documentation

- **README.md** (this file): Project overview
- **DEMO_GUIDE.md**: Step-by-step feature walkthrough
- **ARCHITECTURE_OVERVIEW.md**: System design and data flow

---

## Project Status

**Current Status**: MVP / Public Demo

**Completed Features**:
- ✅ Multi-platform data aggregation (Kalshi + Polymarket)
- ✅ Personalization engine
- ✅ AI-powered ranking
- ✅ Frontend UI (Next.js)

**In Progress**:
- 🔄 Full backend deployment
- 🔄 AI agents (Alpha Scout, Portfolio Guardian, Research Autopilot)
- 🔄 Real-time arbitrage scanner

**Roadmap**:
- 📋 Additional platforms (Metaculus, PredictIt)
- 📋 Mobile app
- 📋 Trading execution integration

---

## Contact

For questions about the public demo or collaboration inquiries:
- GitHub Issues: Please create an issue in the repository
- Email: [nelson.jingusc@gmail.com](mailto:nelson.jingusc@gmail.com)

For access to the full backend system:
- Contact: [nelson.jingusc@gmail.com](mailto:nelson.jingusc@gmail.com)

---

## License

**Public Demo**: MIT License (frontend only)

**Private Backend**: Proprietary - Contact for licensing

---

## Acknowledgments

- Data sources: Kalshi, Polymarket
- Built with: Next.js, FastAPI, LightGBM, OpenAI
- Inspired by: Morningstar, Bloomberg Terminal

---

**Note**: This is a public demonstration repository showcasing the frontend and architecture. The complete backend system with proprietary algorithms is maintained in a private repository.
