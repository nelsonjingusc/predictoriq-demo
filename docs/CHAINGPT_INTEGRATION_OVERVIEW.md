# ChainGPT Integration Overview

This page explains how ChainGPT is integrated in this branch.

---

## 1. System Architecture

**What this diagram shows:**
- PredictorIQ produces structured market signals.
- ChainGPT Web3 Chat API generates human-readable explanations.
- AgenticOS is a Web3 AI agent framework that can receive signals and post to X/Twitter.

```mermaid
flowchart LR
  classDef data fill:#FEF9C3,stroke:#CA8A04,color:#422006,stroke-width:2px
  classDef server fill:#DCFCE7,stroke:#16A34A,color:#052E16,stroke-width:2px
  classDef llm fill:#FFE4E6,stroke:#E11D48,color:#4C0519,stroke-width:2px
  classDef output fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:2px
  classDef agent fill:#F3E8FF,stroke:#9333EA,color:#3B0764,stroke-width:2px

  A[PredictorIQ Core]:::data
  B[Next.js Server]:::server
  C[Web3 Chat API]:::llm
  D[Browser UI]:::output
  E[AgenticOS]:::agent
  F[X / Twitter]:::output

  A -->|MarketSignal JSON| B
  B -->|Prompt + Context| C
  C -->|Generated Text| B
  B -->|Explanation / Q&A / Help| D
  B -.->|Tweet text| E
  E -.->|Auto post| F
```

**Notes:**
- Solid lines = implemented now
- Dashed lines = planned integration

---

## 2. ChainGPT Products We Use

| Product | What it does | How we use it | Status |
|---------|--------------|---------------|--------|
| **Web3 Chat API** | Text generation from prompts | Generate explanations, Q&A answers, help text, research notes, tweet drafts | Implemented |
| **AgenticOS** | Open-source AI agent framework for X/Twitter | Receive our tweet text via webhook, auto-post to X | Planned |

### About AgenticOS

AgenticOS is not just a Twitter bot. It is a **Web3 AI agent framework** that can:
- Receive signals via **scheduled cron jobs** or **real-time webhooks**
- Access **on-chain data** from BNB Chain and other networks
- Subscribe to **ChainGPT Web3 news feeds** by category
- Generate content using **ChainGPT Web3 Chat API**
- Post autonomously to **X/Twitter** with OAuth 2.0 security

Typical use cases: DAO treasury bots, crypto marketing automation, DePIN community updates, real-time market alerts.

---

## 3. Feature Flow

**What this diagram shows:**
- UC1 to UC6 are the six features we built.
- Each connects to a server endpoint and produces a specific output.

```mermaid
flowchart LR
  classDef feature fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:2px
  classDef api fill:#DCFCE7,stroke:#16A34A,color:#052E16,stroke-width:2px
  classDef result fill:#FFE4E6,stroke:#E11D48,color:#4C0519,stroke-width:2px

  UC1[UC1]:::feature --> E1[explain-market]:::api --> O1[Explanation]:::result
  UC2[UC2]:::feature --> E2[research-copilot]:::api --> O2[Q&A Answer]:::result
  UC3[UC3]:::feature --> E3[generate-digest]:::api --> O3[Digest Tweet]:::result
  UC4[UC4]:::feature --> E4[generate-anomaly-tweet]:::api --> O4[Alert Tweet]:::result
  UC5[UC5]:::feature --> E5[help]:::api --> O5[Help Answer]:::result
  UC6[UC6]:::feature --> E6[generate-daily-note]:::api --> O6[Research Note]:::result
```

**UC1 to UC6 explained:**

| UC | Name | What it does | Where in UI |
|----|------|--------------|-------------|
| UC1 | Market Explanation | Short summary of why a market looks cheap or expensive | Top10 page, each card |
| UC2 | Research Q&A | User asks follow-up questions about a market | Top10 page, modal |
| UC3 | Daily Digest Tweet | Generates tweet text for daily market highlights | /chaingpt preview |
| UC4 | Anomaly Alert Tweet | Generates alert tweet when unusual activity detected | /chaingpt preview |
| UC5 | Product Help | Explains PredictorIQ metrics and concepts | Floating help widget |
| UC6 | Daily Research Note | Generates Markdown summary of top markets | /chaingpt preview |

---

## 4. Demo Mode

When running without a ChainGPT API key:
- Server returns pre-written example responses.
- All UI features work, but responses are static.
- No API credits consumed.

---

## 5. What This Integration Does NOT Do

- No trading execution
- No wallet or private key handling
- No on-chain transactions
- No replacing deterministic pricing with model-generated numbers
