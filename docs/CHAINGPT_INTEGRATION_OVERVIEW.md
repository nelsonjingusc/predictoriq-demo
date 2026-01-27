# ChainGPT Integration Overview (Architecture + Functionality)

This page describes how ChainGPT is integrated in this branch, and what the integration does and does not do.

## 1) High-level Architecture

- PredictorIQ core logic (pricing, scoring, anomaly detection, cross-market comparison) runs as deterministic code.
- ChainGPT sits above that layer to interpret structured outputs and produce human/agent-friendly text.
- All ChainGPT calls are made server-side via Next.js API routes. The client never accesses model credentials.
- The model consumes structured JSON signals, not raw market feeds.

```mermaid
%%{init: {'theme':'base','themeVariables': {
  'fontSize': '16px',
  'fontFamily': 'Inter, ui-sans-serif, system-ui',
  'primaryTextColor': '#0F172A',
  'lineColor': '#334155'
}}}%%
flowchart TB
  %% Colors chosen for high contrast and readability.
  classDef client fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:2px;
  classDef api fill:#DCFCE7,stroke:#16A34A,color:#052E16,stroke-width:2px;
  classDef core fill:#FEF9C3,stroke:#CA8A04,color:#422006,stroke-width:2px;
  classDef model fill:#FFE4E6,stroke:#E11D48,color:#4C0519,stroke-width:2px;
  classDef util fill:#EDE9FE,stroke:#7C3AED,color:#1E1B4B,stroke-width:2px;

  subgraph C[Client (Next.js / React)]
    UI1[Top10 UI\n- Explanation panel (UC1)\n- Research copilot (UC2)]:::client
    UI2[Help widget (UC5)]:::client
    UI3[ChainGPT preview page\n(UC3/UC4/UC6)]:::client
  end

  subgraph A[Server (Next.js API routes)]
    R1[/POST /api/chaingpt/explain-market/]:::api
    R2[/POST /api/chaingpt/research-copilot/]:::api
    R3[/POST /api/chaingpt/help/]:::api
    R4[/POST /api/chaingpt/generate-daily-note/]:::api
    R5[/POST /api/chaingpt/generate-digest/]:::api
    R6[/POST /api/chaingpt/generate-anomaly-tweet/]:::api
  end

  subgraph P[PredictorIQ signals (deterministic)]
    S1[Structured MarketSignal JSON\n(mispricing, anomalyScore,\nliquidity, etc.)]:::core
  end

  subgraph L[ChainGPT]
    M1[ChainGPT model API\n(HTTPS)]:::model
  end

  subgraph D[Demo fallback (optional)]
    F1[Deterministic demo responses\nwhen demo mode is on\nand no API key is set]:::util
  end

  UI1 --> R1
  UI1 --> R2
  UI2 --> R3
  UI3 --> R4
  UI3 --> R5
  UI3 --> R6

  S1 --> R1
  S1 --> R2
  S1 --> R4
  S1 --> R5
  S1 --> R6

  R1 --> M1
  R2 --> M1
  R3 --> M1
  R4 --> M1
  R5 --> M1
  R6 --> M1

  R1 -. demo mode .-> F1
  R2 -. demo mode .-> F1
  R3 -. demo mode .-> F1
  R4 -. demo mode .-> F1
  R5 -. demo mode .-> F1
  R6 -. demo mode .-> F1
```

## 2) Role of ChainGPT in the System

- ChainGPT does not perform numerical pricing or financial calculations.
- Its role is to interpret existing signals, resolve conflicting indicators, and produce clear explanations for humans and agents.
- Typical outputs include market summaries, rationale for “participate / avoid” assessments, and contextual answers to user questions.

## 3) Core Integrated Functionalities

- Market Explanation Panel (UC1): structured signals → short explanation.
- Research Copilot (UC2): follow-up Q&A grounded in the same structured context.
- Help / Onboarding Chat (UC5): product concepts and metric explanations with project-specific context.
- Agent-facing Content Generation (UC3/UC4/UC6): daily note + digest + anomaly text generation (text-only; no execution).

```mermaid
%%{init: {'theme':'base','themeVariables': {
  'fontSize': '16px',
  'fontFamily': 'Inter, ui-sans-serif, system-ui',
  'primaryTextColor': '#0F172A',
  'lineColor': '#334155'
}}}%%
flowchart LR
  classDef ui fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:2px;
  classDef route fill:#DCFCE7,stroke:#16A34A,color:#052E16,stroke-width:2px;
  classDef svc fill:#FEF9C3,stroke:#CA8A04,color:#422006,stroke-width:2px;
  classDef out fill:#FFE4E6,stroke:#E11D48,color:#4C0519,stroke-width:2px;

  subgraph UI[UI Surface]
    U1[UC1: Explanation panel\n(on Top10 cards)]:::ui
    U2[UC2: Research copilot\n(modal chat)]:::ui
    U3[UC5: Help widget\n(floating chat)]:::ui
    U4[UC6: Daily note generator\n(/chaingpt)]:::ui
    U5[UC3: Daily digest text\n(/chaingpt)]:::ui
    U6[UC4: Anomaly alert text\n(/chaingpt)]:::ui
  end

  subgraph Routes[Next.js API Routes]
    A1[/explain-market/]:::route
    A2[/research-copilot/]:::route
    A3[/help/]:::route
    A4[/generate-daily-note/]:::route
    A5[/generate-digest/]:::route
    A6[/generate-anomaly-tweet/]:::route
  end

  subgraph Services[Domain Services (server-side)]
    S1[markets/explanationService]:::svc
    S2[markets/researchCopilotService]:::svc
    S3[help/helpService]:::svc
    S4[markets/researchNoteService]:::svc
    S5[tweets/tweetService]:::svc
  end

  subgraph Outputs[Outputs]
    O1[Explanation JSON\n(stance + summary)]:::out
    O2[Answer text\n(chat)]:::out
    O3[Help answer text]:::out
    O4[Daily research note\n(Markdown)]:::out
    O5[Digest tweets\n(text)]:::out
    O6[Anomaly alert tweet\n(text)]:::out
  end

  U1 --> A1 --> S1 --> O1
  U2 --> A2 --> S2 --> O2
  U3 --> A3 --> S3 --> O3
  U4 --> A4 --> S4 --> O4
  U5 --> A5 --> S5 --> O5
  U6 --> A6 --> S5 --> O6
```

## 4) Execution and Safety Model

- No private keys, wallets, or trading execution are handled by ChainGPT or this integration.
- Any future execution logic is intentionally separated and platform-dependent.
- This keeps reasoning, execution, and settlement loosely coupled.

## 5) Intended Usage

- Designed for long-running workflows (not one-off demos).
- Works inside the PredictorIQ app and can serve as a base for external research/alert agents (for example via AgenticOS), while keeping execution external and optional.

