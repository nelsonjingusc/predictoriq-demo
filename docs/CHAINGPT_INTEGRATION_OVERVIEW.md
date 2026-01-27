# ChainGPT Integration Overview

This page describes how ChainGPT is integrated in this branch, and what the integration does and does not do.

## 1. High-level Architecture

- PredictorIQ core logic — pricing, scoring, anomaly detection, cross-market comparison — runs as deterministic code.
- ChainGPT sits above that layer to interpret structured outputs and produce human/agent-friendly text.
- All ChainGPT calls are made server-side via Next.js API routes. The client never accesses model credentials.
- The model consumes structured JSON signals, not raw market feeds.

```mermaid
flowchart TB
  classDef client fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:2px
  classDef api fill:#DCFCE7,stroke:#16A34A,color:#052E16,stroke-width:2px
  classDef core fill:#FEF9C3,stroke:#CA8A04,color:#422006,stroke-width:2px
  classDef model fill:#FFE4E6,stroke:#E11D48,color:#4C0519,stroke-width:2px
  classDef util fill:#EDE9FE,stroke:#7C3AED,color:#1E1B4B,stroke-width:2px

  subgraph C[Client]
    UI1[Top10 UI — UC1 + UC2]:::client
    UI2[Help widget — UC5]:::client
    UI3[ChainGPT preview — UC3/UC4/UC6]:::client
  end

  subgraph A[Server API routes]
    R1[explain-market]:::api
    R2[research-copilot]:::api
    R3[help]:::api
    R4[generate-daily-note]:::api
    R5[generate-digest]:::api
    R6[generate-anomaly-tweet]:::api
  end

  subgraph P[PredictorIQ signals]
    S1[MarketSignal JSON]:::core
  end

  subgraph L[ChainGPT]
    M1[ChainGPT API]:::model
  end

  subgraph D[Demo fallback]
    F1[Deterministic demo responses]:::util
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

  R1 -.-> F1
  R2 -.-> F1
  R3 -.-> F1
  R4 -.-> F1
  R5 -.-> F1
  R6 -.-> F1
```

## 2. Role of ChainGPT in the System

- ChainGPT does not perform numerical pricing or financial calculations.
- Its role is to interpret existing signals, resolve conflicting indicators, and produce clear explanations for humans and agents.
- Typical outputs include market summaries, rationale for participate/avoid assessments, and contextual answers to user questions.

## 3. Core Integrated Functionalities

- **Market Explanation Panel — UC1**: structured signals to short explanation.
- **Research Copilot — UC2**: follow-up Q&A grounded in the same structured context.
- **Help / Onboarding Chat — UC5**: product concepts and metric explanations with project-specific context.
- **Agent-facing Content Generation — UC3/UC4/UC6**: daily note + digest + anomaly text generation; text-only, no execution.

```mermaid
flowchart LR
  classDef ui fill:#E0F2FE,stroke:#0284C7,color:#0F172A,stroke-width:2px
  classDef route fill:#DCFCE7,stroke:#16A34A,color:#052E16,stroke-width:2px
  classDef svc fill:#FEF9C3,stroke:#CA8A04,color:#422006,stroke-width:2px
  classDef out fill:#FFE4E6,stroke:#E11D48,color:#4C0519,stroke-width:2px

  subgraph UI[UI surface]
    U1[UC1 Explanation panel]:::ui
    U2[UC2 Research copilot]:::ui
    U3[UC5 Help widget]:::ui
    U4[UC6 Daily note]:::ui
    U5[UC3 Digest text]:::ui
    U6[UC4 Anomaly alert]:::ui
  end

  subgraph Routes[API routes]
    A1[explain-market]:::route
    A2[research-copilot]:::route
    A3[help]:::route
    A4[generate-daily-note]:::route
    A5[generate-digest]:::route
    A6[generate-anomaly-tweet]:::route
  end

  subgraph Services[Domain services]
    S1[explanationService]:::svc
    S2[researchCopilotService]:::svc
    S3[helpService]:::svc
    S4[researchNoteService]:::svc
    S5[tweetService]:::svc
  end

  subgraph Outputs[Outputs]
    O1[Explanation JSON]:::out
    O2[Answer text]:::out
    O3[Help answer]:::out
    O4[Daily note MD]:::out
    O5[Digest tweets]:::out
    O6[Anomaly tweet]:::out
  end

  U1 --> A1 --> S1 --> O1
  U2 --> A2 --> S2 --> O2
  U3 --> A3 --> S3 --> O3
  U4 --> A4 --> S4 --> O4
  U5 --> A5 --> S5 --> O5
  U6 --> A6 --> S5 --> O6
```

## 4. Execution and Safety Model

- No private keys, wallets, or trading execution are handled by ChainGPT or this integration.
- Any future execution logic is intentionally separated and platform-dependent.
- This keeps reasoning, execution, and settlement loosely coupled.

## 5. Intended Usage

- Designed for long-running workflows, not one-off demos.
- Works inside the PredictorIQ app and can serve as a base for external research/alert agents via AgenticOS, while keeping execution external and optional.
