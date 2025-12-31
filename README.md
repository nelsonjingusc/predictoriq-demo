# PredictorIQ Demo

>**⚠️ Frontend Demonstration - Mock Data Enabled**
> 
> This is a **frontend UI showcase** with realistic sample data enabled by default. You can explore the complete product interface without needing a backend server.

This repository contains the public demo dashboard and docs for **PredictorIQ**, a prediction market intelligence and agent infrastructure project.

## What's in This Repo

- **Frontend UI** (`client/`): Complete Next.js dashboard showcasing the product interface
- **TypeScript SDK** (`client/packages/sdk/`): Client library for API integration
- **Documentation** (`docs/`): Product overview, architecture, and demo guide
- **Mock Data**: Realistic sample data for all features

## Quick Start

```bash
# One-click start (recommended)
./start-demo.sh
```

Or manually:
```bash
cd client && npm install && npm run dev
```

### ✅ What You'll See

With **demo mode enabled** (default), you'll see:
- ✅ **Complete UI** with all pages and navigation working
- ✅ **Realistic mock data** showing AI-ranked markets, arbitrage opportunities, trading strategies, and more
- ✅ **Full interactivity** - browse, filter, and explore all features
- ✅ **Fast loading** - no backend required

### Demo Mode

**Demo mode is enabled by default.** The app uses realistic sample data to showcase the product interface.

To switch to live mode (requires backend API):
```bash
# In client/.env.local
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_API_URL=http://localhost:8000  # Your API URL
```

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

**Note**: In demo mode, the frontend uses realistic mock data instead of live API calls.

## For Reviewers

This repository demonstrates:
- ✅ Product vision and UI/UX design
- ✅ Frontend architecture and code quality
- ✅ SDK design and API patterns
- ✅ Technical documentation
- ✅ **Complete UI with realistic sample data (demo mode)**

**Getting Started**: Simply run `./start-demo.sh` in the root directory. The app will automatically handle environment setup, dependency installation, and start the server with mock data enabled.

To understand the full system (including backend), see the architecture docs or contact the team for access to the private repository.

### 📧 Form Email Notifications

To receive actual emails when someone joins the waitlist:
1. Create a free account at [Formspree](https://formspree.io/).
2. Create a new form and get your **Form ID** (e.g., `xbjebpoy`).
3. Add it to `client/.env.local`:
   ```bash
   NEXT_PUBLIC_FORMSPREE_ID=your_id_here
   ```
4. Restart the dev server.

---

**For detailed demo instructions, see [docs/DEMO_GUIDE.md](docs/DEMO_GUIDE.md)**
