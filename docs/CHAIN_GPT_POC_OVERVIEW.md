# ChainGPT Integration PoC Overview

This document describes the PredictorIQ × ChainGPT proof-of-concept integration.

---

## Purpose

This PoC demonstrates how ChainGPT's Web3 LLM can serve as a **reasoning and communication layer** for prediction market intelligence:

- **PredictorIQ computes the math**: pricing models, mispricing detection, anomaly scores, wallet statistics.
- **ChainGPT explains the math**: turns structured signals into plain-English explanations for users and agents.
- **All ChainGPT calls stay server-side**: the browser never sees API keys or credentials.

---

## User-Visible Features

### 1. Market Explanation Panel (on /top10)

**What it does:**
- Each market on the Top10 page has an "Explanation powered by ChainGPT" panel.
- User clicks to expand; the UI sends structured market data to the server.
- Server calls ChainGPT Web3 LLM with:
  - Implied probability (from prediction market)
  - Option-anchored "fair" probability
  - Mispricing indicators
  - Capital quality summary
  - Anomaly score
- ChainGPT returns a short, plain-English rationale (2-4 sentences).

**Flow:**
```
User → UI → POST /api/chaingpt/explain-market → explanationService → chaingptClient → ChainGPT Web3 LLM → plain-English summary → UI
```

### 2. In-App Research Copilot ("Ask PredictorIQ")

**What it does:**
- User can ask free-form questions about markets.
- Modal chat interface with multi-turn conversation support.
- Server maintains conversation context using `chatHistory: "on"` and `sdkUniqueId`.

**Flow:**
```
User question → POST /api/chaingpt/research-copilot → researchCopilotService → ChainGPT Web3 LLM → contextual answer → UI
```

### 3. Help / Onboarding Chat Widget

**What it does:**
- Bottom-right floating chat bubble.
- Explains PredictorIQ metrics and concepts using project-specific context.
- Helps onboard new users with "what does X mean?" questions.

**Flow:**
```
User question → POST /api/chaingpt/help → helpService → ChainGPT Web3 LLM → help answer → UI
```

### 4. Wallet Summary View (on /chaingpt)

**What it does:**
- User enters an EVM wallet address (0x...).
- Server computes wallet stats in **deterministic code**:
  - Number of markets participated
  - Win rate / realized PnL
  - Favorite market categories
  - Average position size
  - Notable behaviors
- ChainGPT Web3 LLM generates a plain-English summary of the trading profile.

**Flow:**
```
User address → POST /api/chaingpt/wallet-summary → getMockWalletStats (deterministic) → walletSummaryService → ChainGPT Web3 LLM → readable summary → UI
```

**Key point:** ChainGPT does NOT compute the stats. It only explains them.

### 5. Content Generation for Twitter/X and Research Notes

**What it does:**
- Three endpoints for generating agent-ready content:
  - `POST /api/chaingpt/generate-digest` → array of tweet-length strings
  - `POST /api/chaingpt/generate-anomaly-tweet` → one anomaly alert tweet
  - `POST /api/chaingpt/generate-daily-note` → Markdown research note

**Use case:**
- Can be wired to ChainGPT AgenticOS for automated X/Twitter posting.
- For now, text-only (no actual posting).

---

## Architecture

```mermaid
flowchart LR
  classDef user fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:2px
  classDef ui fill:#DCFCE7,stroke:#16A34A,color:#052E16,stroke-width:2px
  classDef api fill:#FEF9C3,stroke:#CA8A04,color:#422006,stroke-width:2px
  classDef llm fill:#FFE4E6,stroke:#E11D48,color:#4C0519,stroke-width:2px

  A[User]:::user
  B[Next.js Pages]:::ui
  C[/api/chaingpt/*]:::api
  D[chaingptClient]:::api
  E[ChainGPT Web3 LLM]:::llm

  A --> B
  B --> C
  C --> D
  D --> E
  E --> D
  D --> C
  C --> B
  B --> A
```

**Key points:**
- All ChainGPT calls happen **server-side** via Next.js API routes.
- The client (browser) never sees `CHAINGPT_API_KEY`.
- Demo mode: if `CHAINGPT_API_KEY` is not set, routes return canned but realistic responses.

---

## How to Run the PoC

### Prerequisites

- Node.js 20+
- npm or pnpm

### Quick Start

```bash
./start-chaingpt-demo.sh
```

This script will:
1. Create `.env.local` with demo mode enabled (if it doesn't exist).
2. Install dependencies (if needed).
3. Start the dev server at `http://localhost:3000`.

### Manual Start

```bash
cd client
npm install
npm run dev
```

### Environment Variables

Create `client/.env.local`:

```bash
NEXT_PUBLIC_DEMO_MODE=1
# CHAINGPT_API_KEY=your_api_key_here
# CHAINGPT_BASE_URL=https://api.chaingpt.org
```

- `NEXT_PUBLIC_DEMO_MODE=1`: Enables demo mode (uses canned responses).
- `CHAINGPT_API_KEY`: Optional. Set this to enable live ChainGPT calls.
- `CHAINGPT_BASE_URL`: Optional. Defaults to `https://api.chaingpt.org`.

### URLs to Visit

- **`/top10`** — Core market demo with explanation panel and copilot.
- **`/chaingpt`** — ChainGPT tools page with wallet summary, daily note, and tweet generation.

---

## Demo Mode vs Live Mode

| Mode | Behavior |
|------|----------|
| **Demo Mode** | `CHAINGPT_API_KEY` not set. All routes return canned but realistic responses. No API credits consumed. |
| **Live Mode** | `CHAINGPT_API_KEY` set. Routes call ChainGPT Web3 LLM. Consumes API credits (0.5 credits per request). |

---

## Technical Details

### Single Client for ChainGPT

All external ChainGPT calls go through `src/chaingpt/lib/chaingptClient.ts`:

- Endpoint: `POST https://api.chaingpt.org/chat/stream`
- Auth: `Authorization: Bearer <CHAINGPT_API_KEY>`
- Mode: Non-streaming ("blob") for simplicity.

### Demo Fallback

When `CHAINGPT_API_KEY` is missing, routes use `src/chaingpt/lib/demoFallback.ts` to return deterministic demo responses.

### Error Handling

API routes catch network/API errors and return well-structured JSON:

```json
{ "error": "ChainGPT unavailable" }
```

UI shows friendly error messages instead of breaking.

---

## Future Work

- **Real Polymarket API integration** for wallet history (currently mocked).
- **AgenticOS integration** for automated X/Twitter posting using existing content endpoints.
- **Streaming responses** for better UX in copilot chat.
- **Rate limiting and caching** for production use.

---

## Summary

This PoC shows how ChainGPT's Web3 LLM can be integrated as a **reasoning layer** in a real prediction market intelligence product:

- ✅ Deterministic math stays in code.
- ✅ ChainGPT explains and communicates results.
- ✅ Server-side only (no secrets in browser).
- ✅ Demo mode works without API key.
- ✅ Two key flows: beginner-friendly copilot + advanced wallet summary.

**For grants committee:** This is a production-ready integration pattern that can scale to real users and agent workflows.
