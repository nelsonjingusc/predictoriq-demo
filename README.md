# PredictorIQ × ChainGPT PoC 🦉

**🧱 Full-Stack AI PoC - Hybrid Model**
 
This is a **full-stack demonstration** of a hybrid intelligence model:
- **PredictorIQ Core**: Beginner Guide, Wallet Tracker, Top 10 Markets.
- **ChainGPT Integration**: Server-side AI reasoning layer (Interpreting and communicating signals).

## ⚡ Quick Start (ChainGPT PoC)

```bash
# One-click start for ChainGPT PoC (recommended)
./start-chaingpt-demo.sh
```

**This script will:**
1. **Environment**: Create `.env.local` with demo mode enabled (if it doesn't already exist—existing keys are **preserved**).
2. **Dependencies**: Install required packages if `node_modules` is missing.
3. **Launch**: Start the dev server at [http://localhost:3000](http://localhost:3000).

**Pages to visit:**
- `/top10` — Market explanation + copilot
- `/chaingpt` — Wallet summary + content generation

Or manually:
```bash
cd client && npm install && npm run dev
```

### ✅ What You'll See

With **demo mode enabled** (default), you'll see:
- ✅ **Complete UI** with all pages and navigation working.
- ✅ **Realistic mock data** showing Top1Rank recommendations, arbitrage opportunities, and profile analysis.
- ✅ **Full interactivity** - browse, filter, and explore all features.
- ✅ **Fast loading** - no backend required for evaluation.

---

## ChainGPT Integration (This Branch)

This branch integrates **ChainGPT** as a reasoning and communication layer on top of PredictorIQ’s existing, deterministic market analysis.

- PredictorIQ’s core pricing/scoring/anomaly logic remains **code-based and deterministic**.
- ChainGPT is used to **interpret structured signals** and produce plain-English explanations for users and agent workflows.
- All ChainGPT calls are made **server-side** via Next.js API routes. The client never sees model credentials.

### What’s Added

- **Server-side ChainGPT integration** via API routes (no secrets exposed to the browser)
- **Market explanation panel** that turns structured signals into short rationales
- **In-app Q&A / research copilot** for follow-up questions grounded in the same structured context
- **Help / onboarding chat** for metrics and system concepts using project-specific context
- **Agent-facing text generation endpoints** (Daily Digest, Anomaly Alerts, Research Notes)

### What This Branch Does NOT Do

- No trading execution, no wallets, no private keys
- No replacing deterministic calculations with model-generated math
- No autonomous trading system

---

## 📚 Documentation

**PoC Guide & Vision:**
- **[POC Overview & Guide](docs/chaingpt-poc/ChainGPT_POC_Overview.md)**: **← Start here for features, architecture, and running instructions.**
- **[Architecture Overview](docs/predictoriq-roadmap/ARCHITECTURE_OVERVIEW.md)**: Deep dive into the Dual-Layer System (Communication vs. Execution).
- **[Integration History](docs/predictoriq-roadmap/chaingpt-integration-v1-current-status-and-work-plan.md)**: Roadmap history.

**Future Roadmap:**
- **[Long-term Product Vision](docs/predictoriq-roadmap/PRODUCT_OVERVIEW.md)**: The original high-level product documentation.

---

## Project Structure

```
predictoriq-demo/
├── client/                 # Next.js frontend application
│   ├── app/               # Next.js app router pages & API routes
│   │   ├── api/chaingpt/  # AI integration endpoints
│   │   ├── top10/         # Top10 recommendations page
│   │   ├── wallet-tracker/# Smart money profiling
│   │   ├── chaingpt/      # ChainGPT preview page
│   │   └── ...
│   ├── packages/sdk/      # TypeScript SDK
│   └── components/        # React components (consolidated under chaingpt/)
└── docs/                  # Documentation (POC vs. Roadmap)
```

## Reviewer Notes

This repository demonstrates:
- ✅ **Product Vision**: Professional UI/UX design with institutional-grade aesthetics.
- ✅ **Technical Architecture**: Clean separation between quantitative execution and AI reasoning.
- ✅ **Code Quality**: Modern Next.js patterns, TypeScript-first development, and secure API integration.
- ✅ **Scalability**: Agent-facing endpoints ready for autonomous workflow integration.

**Contact**: [nelson.jingusc@gmail.com](mailto:nelson.jingusc@gmail.com)
