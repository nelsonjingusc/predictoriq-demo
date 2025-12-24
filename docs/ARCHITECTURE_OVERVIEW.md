# PredictorIQ - Architecture Overview

**Audience**: External reviewers and potential collaborators
**Version**: 1.0 (Public)

**Note**: This document describes the full system architecture. The public demo repository only includes the Presentation Layer (frontend). The Intelligence Layer (backend) is in a private repository.

---

## System Overview

PredictorIQ is a three-layer architecture:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (Next.js Frontend)              │
│  ┌────────┐ ┌────────┐ ┌────────┐     │
│  │  Top10 │ │Arbitrage│ │Portfolio│    │
│  └────────┘ └────────┘ └────────┘     │
└─────────────────────────────────────────┘
                   │
            REST API (JSON)
                   │
┌─────────────────────────────────────────┐
│        Intelligence Layer               │
│    (Python Backend - Private)           │
│  ┌──────────────────────────────────┐  │
│  │   Data Aggregation & Ranking     │  │
│  │   Personalization Engine         │  │
│  │   AI Agents                      │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
                   │
          External APIs
                   │
┌─────────────────────────────────────────┐
│        Data Sources                     │
│  ┌─────────┐  ┌──────────┐            │
│  │ Kalshi  │  │Polymarket│            │
│  │  API    │  │   API    │            │
│  └─────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

---

## Layer 1: Presentation (Public) ✅ Included in Demo

**Status**: Fully implemented in this repository

### Technology

- **Framework**: Next.js 14 (React + TypeScript)
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Deployment**: Vercel (or any Next.js host)

### Key Components

1. **Dashboard**
   - Displays Top10 personalized market recommendations
   - Shows AI scores and match reasons
   - Responsive design for desktop and mobile

2. **Market Explorer**
   - Browse all markets with filters
   - Search by keyword, platform, category
   - Detailed market views

3. **Onboarding Flow**
   - 4-step user profile creation
   - Captures domain interests, professional background
   - Enables personalization

4. **Arbitrage Scanner**
   - Cross-platform opportunity viewer
   - Real-time alerts
   - Filter by spread and confidence

---

## Layer 2: Intelligence (Private) ⚠️ Not Included in Demo

**Status**: Implemented in private repository, not included in this public demo

**Note**: This layer is proprietary and not included in the public repository. The frontend in this demo is designed to work with this backend, but API calls will fail without the backend server running.

### High-Level Components

1. **Data Aggregation Module**
   - Fetches data from external prediction market APIs
   - Normalizes different data formats into unified schema
   - Updates every 5-15 minutes

2. **Ranking Engine**
   - Applies machine learning models to score markets
   - Generates AI-powered rationales
   - Personalizes rankings based on user profiles

3. **Personalization Engine**
   - Matches users to markets based on:
     - Professional background
     - Domain expertise
     - Geographic location
     - Trading style preferences
   - Calculates personalization boosts

4. **Analytics Modules**
   - Cross-platform arbitrage detection
   - Greek-style risk metrics
   - Market trend analysis

5. **AI Agents**
   - Alpha Scout: Discovers opportunities
   - Portfolio Guardian: Monitors risk
   - Research Autopilot: Generates reports

### Data Flow

```
External APIs
    ↓
Data Ingestion
    ↓
Normalization & Storage
    ↓
Feature Engineering
    ↓
ML Ranking + Personalization
    ↓
API Endpoints
    ↓
Frontend
```

---

## Layer 3: Data Sources

### Kalshi

- **Type**: Regulated prediction market (CFTC-regulated)
- **Markets**: ~1,600 active markets
- **Coverage**: Politics, economics, sports, entertainment
- **API**: RESTful, public endpoints available
- **Data Quality**: High (real trading data)

### Polymarket

- **Type**: Crypto-based prediction market
- **Markets**: ~2,000+ active markets
- **Coverage**: Politics, crypto, tech, sports
- **API**: Public Gamma API
- **Data Quality**: High (high volume, good liquidity)

### Future Sources

- Limitless Exchange
- Metaculus
- PredictIt

---

## Key Design Principles

### 1. Platform Agnostic

- Unified data schema across all platforms
- Easy to add new prediction market sources
- No vendor lock-in

### 2. Personalization First

- Every recommendation is tailored to the user
- Not just "what's popular" but "what you know"
- Expertise-based matching

### 3. Real-Time Intelligence

- Fresh data (5-15 minute updates)
- Live arbitrage scanning
- Dynamic ranking

### 4. Transparency

- AI scores explained
- Risk metrics clearly displayed
- Open about data sources and methodology

---

## API Design (Public Interface)

**Note**: These endpoints are implemented in the private backend. The frontend SDK in this demo is designed to call these endpoints, but they will not be available when running the demo locally.

### Core Endpoints

**GET /v1/daily-top10**
- Returns personalized Top10 market recommendations
- Input: User profile (optional)
- Output: Ranked markets with AI scores and rationales

**GET /v1/markets**
- Lists all markets with filters
- Input: Platform, category, status, pagination
- Output: Array of normalized markets

**GET /v1/arbitrage/alerts**
- Returns cross-platform arbitrage opportunities
- Input: Min spread threshold
- Output: Array of arbitrage alerts

**GET /v1/markets/{id}**
- Returns detailed market information
- Input: Market ID
- Output: Market data + risk metrics

### Data Format

All responses use this structure:
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2024-12-23T12:00:00Z",
    "version": "1.0"
  },
  "error": null
}
```

---

## Scalability & Performance

### Caching Strategy

- **Redis**: 5-15 minute TTL for market data
- **Browser Cache**: Static assets
- **CDN**: Frontend assets via Vercel

### Database

- **Development**: SQLite
- **Production**: PostgreSQL
- **Indexes**: On market_id, platform, status, updated_at

### Rate Limiting

- Per-user: 100 requests/minute
- Per-IP: 300 requests/minute

---

## Security

### Public Repository (Frontend)

- No sensitive data in source code
- Environment variables for API endpoints
- HTTPS only in production

### Private Repository (Backend)

- API keys stored in secure environment variables
- Database credentials encrypted
- User data anonymized

---

## Deployment

### Frontend (Public)

**Platform**: Vercel
**URL**: `https://predictoriq.vercel.app`
**CI/CD**: Auto-deploy from main branch

### Backend (Private)

**Platform**: Railway / Fly.io / AWS
**Database**: Supabase / AWS RDS
**Cache**: Upstash Redis
**CI/CD**: GitHub Actions

---

## Future Architecture Enhancements

### Phase 2: Agent Layer

- Alpha Scout: Continuous market scanning
- Portfolio Guardian: Real-time risk monitoring
- Research Autopilot: On-demand report generation

### Phase 3: ML Improvements

- User behavior tracking
- Collaborative filtering
- Dynamic personalization weights

### Phase 4: Mobile

- Native iOS/Android apps
- Push notifications for opportunities
- Offline mode with cached data

---

## Technical Challenges & Solutions

### Challenge 1: Multi-Platform Data Normalization

**Problem**: Different platforms use different formats
- Kalshi: Cents (0-100)
- Polymarket: Decimal (0-1)

**Solution**: Unified `MarketNormalized` schema
```typescript
interface MarketNormalized {
  platform: "KALSHI" | "POLYMARKET";
  mid_price: number; // Always 0-1
  // ... other normalized fields
}
```

### Challenge 2: Real-Time Updates

**Problem**: 3,600+ markets need frequent updates

**Solution**:
- Incremental updates (only changed markets)
- Tiered update frequency (high-volume = 5min, low-volume = 1hr)
- Background jobs + caching

### Challenge 3: Personalization Cold Start

**Problem**: New users have no history

**Solution**:
- Onboarding flow captures explicit preferences
- Professional background gives immediate signal
- Geographic location adds local advantage

---

## Contact & Collaboration

For questions about architecture or collaboration:
- **GitHub**: Create an issue in the public repository
- **Email**: [Contact information]

For backend access or licensing:
- Contact: [nelson.jingusc@gmail.com](mailto:nelson.jingusc@gmail.com)

---

**Document Version**: 1.0
**Last Updated**: 2024-12-23
**Scope**: Public overview (does not include proprietary algorithms)
