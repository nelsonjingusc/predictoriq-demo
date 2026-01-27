# ChainGPT Integration v1 (Requirements + Tech Spec)

This document defines the first integration of ChainGPT into PredictorIQ. It is written for engineers working in this repo and is intended to be implementation-ready.

---

## Status (Read this first)

**This doc contains both**:
- **Requirements** (what we intend to build), and
- **Implementation status** (what is already done in this branch + what is next).

**Last updated**: January 2026

Jump links:
- **Current progress + next steps**: see **Current Implementation Status (in this repo)**
- **How to run / test locally**: see **Local Testing**

---

## Table of contents

- Scope
- External Dependencies (ChainGPT)
- Environment Variables
- Use Cases (locked)
- Data Contracts (v1)
- API Surface (Next.js)
- Internal Preview UI
- Implementation Notes
- Current Implementation Status (in this repo)
- Local Testing

## Scope

### Goal

Integrate ChainGPT’s Web3 chat/model API and AgenticOS as:
- An explanation layer inside the app (UC1 + UC2)
- A Twitter/X-facing agent (UC3 + UC4)
- A support + internal tooling layer (UC5 + UC6)

### Non-goals

- No real trading execution or order placement in this phase.
- No complex RBAC/permission system in this phase.
- ChainGPT is not used as a data source/indexer. Market/on-chain data remains the responsibility of PredictorIQ.

## External Dependencies (ChainGPT)

### REST API (preferred for this repo)

ChainGPT uses a single endpoint for both blob and streaming responses:
- `POST https://api.chaingpt.org/chat/stream`

Auth:
- `Authorization: Bearer <CHAINGPT_API_KEY>`
- `Content-Type: application/json`

Core request fields (per ChainGPT quickstart):
- `model`: string (e.g. `general_assistant`)
- `question`: string
- `chatHistory`: `"on"` | `"off"`
- `sdkUniqueId?`: string (session id when `chatHistory: "on"`)
- `useCustomContext?`: boolean
- `contextInjection?`: object

Error codes (quick reference):
- `401`: missing/bad API key
- `402/403`: out of credits

Source: ChainGPT JS/REST quickstart guide (`https://docs.chaingpt.org/dev-docs-b2b-saas-api-and-sdk/web3-ai-chatbot-and-llm-api-and-sdk/javascript/quickstart-guide`).

### AgenticOS (Twitter/X)

We integrate with ChainGPT’s AgenticOS framework (TypeScript + Bun) as an external component.

Source: AgenticOS overview (`https://docs.chaingpt.org/dev-docs-b2b-saas-api-and-sdk/agenticos-framework-web3-ai-agent-on-x-open-source`).

## Environment Variables

These must be server-side only (never exposed to the browser):
- `CHAINGPT_API_KEY` (required for live ChainGPT calls)

Optional:
- `CHAINGPT_MODEL` (default: `general_assistant`)

Notes:
- In Next.js App Router, `process.env.*` referenced from `app/api/**/route.ts` runs server-side.
- Do not use `NEXT_PUBLIC_*` for secrets.

## Use Cases (locked)

### A) In-app explanation layer

#### UC1 — Market Explanation Panel

User story:
As a serious user, I want a concise explanation of why a market looks cheap/fair/expensive so I can decide quickly.

Input (server):
- `MarketSignal` (structured signal object; produced by PredictorIQ)

Output:
- `MarketExplanation`:
  - `stance`: `"long_yes" | "long_no" | "neutral" | "avoid"`
  - `summary`: 2–4 sentences, plain English

Behavior:
- One model call per market.
- `chatHistory: "off"` (single-shot).
- Failure fallback: show numeric signals; explanation shows “temporarily unavailable”.

#### UC2 — In-app Research Copilot (Q&A)

User story:
As a user exploring a market, I want to ask free-form questions and get answers grounded in PredictorIQ numbers plus general Web3 context.

Input:
- `question: string`
- `MarketSignal`
- optional session id (`sdkUniqueId`)

Output:
- Plain-English answer string.

Behavior:
- Multi-turn: `chatHistory: "on"` with a stable `sdkUniqueId` per browser session.

### B) Twitter/X agent (AgenticOS)

#### UC3 — Daily Mispricing Digest Bot

Behavior:
- A daily scheduled job (e.g. UTC 16:00) pulls top markets from PredictorIQ.
- The job constructs a prompt + context and asks ChainGPT for 1–3 tweet texts.
- Tweet publishing is handled by AgenticOS.

#### UC4 — Anomaly Alert Bot

Behavior:
- When `anomalyScore >= threshold` (e.g. 0.8), publish an alert tweet with a short explanation.
- Rate-limit (e.g. max 3 per hour).
- Tweet publishing via AgenticOS.

### C) Support / Docs / Internal Tools

#### UC5 — PredictorIQ Help / Onboarding Chatbot

Behavior:
- A Help chat UI in the demo explains metrics and how to use the product.
- Implementation options:
  - Embed ChainGPT’s chatbot widget (if available), or
  - Provide a simple server endpoint that answers with a fixed PredictorIQ context prompt.

#### UC6 — Internal Research Note Generator (Daily)

Behavior:
- Generate a daily Markdown note from `MarketSignal[]`.
- Output sections: Overview, Key Markets, Notable Anomalies, Cross-Venue Observations.
- Non-streaming (blob).

## Data Contracts (v1)

These types live in `client/src/chaingpt/domain/markets/types.ts`.

```ts
export type CapitalQuality = "high" | "medium" | "low";
export type LiquidityLevel = "low" | "medium" | "high";

export interface MarketSignal {
  marketId: string;
  title: string;
  url: string;
  venue: string;

  // Pricing anchor
  impliedProbMarket: number;   // 0..1
  impliedProbOptions: number;  // 0..1
  mispricing: number;          // (market - options), 0..1 (e.g. +0.12 means +12pp)

  // Participation signals
  capitalQualityYes: CapitalQuality;
  capitalQualityNo: CapitalQuality;
  anomalyScore: number;        // 0..1

  // Execution constraints
  liquidityLevel: LiquidityLevel;
}

export type MarketStance = "long_yes" | "long_no" | "neutral" | "avoid";

export interface MarketExplanation {
  stance: MarketStance;
  summary: string; // 2–4 sentences
}

export interface ResearchNote {
  generatedAt: string; // ISO
  markdown: string;
}
```

## API Surface (Next.js)

These routes are implemented under `client/app/api/chaingpt/*`.

- `POST /api/chaingpt/explain-market` (UC1)
  - body: `{ signal: MarketSignal }`
  - response: `{ explanation: MarketExplanation }`

- `POST /api/chaingpt/research-copilot` (UC2)
  - body: `{ question: string, signal: MarketSignal, sessionId?: string }`
  - response: `{ answer: string }`

- `POST /api/chaingpt/help` (UC5)
  - body: `{ question: string, sessionId?: string }`
  - response: `{ answer: string }`

- `POST /api/chaingpt/generate-daily-note` (UC6)
  - body: `{ date?: string, markets: MarketSignal[] }`
  - response: `{ note: ResearchNote }`

- `POST /api/chaingpt/generate-digest` (UC3, text-only)
  - body: `{ date?: string, markets: MarketSignal[] }`
  - response: `{ date: string, tweets: { text: string }[] }`

- `POST /api/chaingpt/generate-anomaly-tweet` (UC4, text-only)
  - body: `{ market: MarketSignal, reason?: string }`
  - response: `{ tweet: { text: string } }`

## Internal Preview UI

This repo includes an internal page to preview UC3/UC4/UC6 outputs locally:

- `GET /chaingpt`

This page does not post to X. It only generates text so you can validate prompts and outputs before wiring into AgenticOS.

## Implementation Notes

### Key handling

- ChainGPT calls must only happen server-side.
- If `CHAINGPT_API_KEY` is not set, endpoints should return a helpful 501-style error or a deterministic fallback for demo mode.

### AgenticOS integration notes (for Cursor)

We will use AgenticOS mostly as-is and only customize:

1) Daily digest (UC3)
- Add a scheduled entry that calls our text generator endpoint:
  - `POST https://<predictoriq-domain>/api/chaingpt/generate-digest`
- AgenticOS posts the returned tweet text(s).

2) Anomaly alerts (UC4)
- Option A (push): PredictorIQ triggers a request to a small AgenticOS endpoint with market + prompt.
- Option B (pull): AgenticOS polls PredictorIQ periodically for anomaly candidates.

Start with UC3 (daily schedule) + UC4 (push).

---

## Current Implementation Status (in this repo)

This section is a living snapshot of what has been implemented in this branch and what remains.

### Implemented

#### In-app (UC1 / UC2 / UC5)

- **UC1 (Explanation Panel)**: UI is integrated on `/top10` cards.
  - UI: `client/components/ChaingptExplanationPanel.tsx`
  - API: `POST /api/chaingpt/explain-market`
- **UC2 (Research Copilot Q&A)**: “Ask PredictorIQ” modal integrated on `/top10`.
  - UI: `client/components/ChaingptCopilotModal.tsx`
  - API: `POST /api/chaingpt/research-copilot`
  - Session handling: `client/components/chaingpt/session.ts` (sessionStorage `sdkUniqueId`)
- **UC5 (Help Chatbot)**: Floating Help widget on all pages.
  - UI: `client/components/HelpChatWidget.tsx` (mounted in `client/app/layout.tsx`)
  - API: `POST /api/chaingpt/help`

#### Internal tooling / preview (UC6 / UC3 / UC4)

- **UC6 (Daily Note)**: API implemented and preview UI added.
  - API: `POST /api/chaingpt/generate-daily-note`
- **UC3 (Daily Digest Tweet Text)**: Text generation API implemented.
  - API: `POST /api/chaingpt/generate-digest`
- **UC4 (Anomaly Alert Tweet Text)**: Text generation API implemented.
  - API: `POST /api/chaingpt/generate-anomaly-tweet`
- **Preview UI page**: `GET /chaingpt` (select demo markets, generate note/tweets, copy outputs)
  - Page: `client/app/chaingpt/page.tsx`

### ChainGPT API usage (what we actually call)

All ChainGPT calls are made server-side through a small wrapper:
- Wrapper: `client/src/chaingpt/lib/chaingptClient.ts`
- REST endpoint: `POST https://api.chaingpt.org/chat/stream`
- Auth header: `Authorization: Bearer <CHAINGPT_API_KEY>`
- Request fields used in this repo:
  - `model` (default `general_assistant`, overridable via `CHAINGPT_MODEL`)
  - `question`
  - `chatHistory` (`off` for single-shot, `on` for multi-turn)
  - `sdkUniqueId` (for multi-turn sessions)

We currently use the **blob (non-streaming)** response mode for simplicity and reliability.

### Demo fallback behavior (no key required)

To keep demo mode usable even without a live ChainGPT key:
- If `NEXT_PUBLIC_DEMO_MODE=true` AND `CHAINGPT_API_KEY` is missing, the API routes return deterministic demo outputs.
- Demo fallback helpers: `client/src/chaingpt/lib/demoFallback.ts`

This makes it possible to demo all UI flows without consuming credits.

### Not yet implemented (remaining work)

- **AgenticOS posting (UC3/UC4)**: We generate tweet text, but do not post to X from this repo yet.
  - Next step: fork or vend AgenticOS and wire schedule/webhook to our endpoints.
- **Real market signal wiring**: Current UI builds `MarketSignal` from demo Top10 fields and uses placeholder values for some fields (e.g., `mispricing`, `anomalyScore`, capital quality).
  - Next step: introduce a real `MarketSignal` payload from backend or a richer demo dataset.
- **Rate limiting / abuse controls**: basic rate limits and caching are not implemented yet.

---

## Local Testing

### 1) Run the demo

```bash
./start-demo.sh
```

### 2) Demo-only (no ChainGPT key)

Ensure demo mode is enabled:
- `NEXT_PUBLIC_DEMO_MODE=true` (created by `start-demo.sh` if missing)

Then visit:
- `/top10` (UC1/UC2 UI + Help widget)
- `/chaingpt` (UC3/UC4/UC6 preview)

### 3) Live ChainGPT calls

Run the Next.js server with:
- `CHAINGPT_API_KEY=...` (server env)
- optional `CHAINGPT_MODEL=general_assistant`

Then repeat the same UI flows; the backend routes will call ChainGPT instead of using demo fallback.

