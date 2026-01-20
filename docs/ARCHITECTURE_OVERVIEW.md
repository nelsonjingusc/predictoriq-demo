# PredictorIQ - Architecture Overview

PredictorIQ follows a modern, three-layer architectural pattern designed for high throughput and low-latency intelligence.

---

## System Architecture

```mermaid
graph TD
    User((<b>User</b>)) -->|HTTPS| Presentation["<b>Presentation Layer</b><br/>Next.js"]
    Presentation -->|SDK| SDK["<b>PredictorIQ TypeScript SDK</b>"]
    SDK -->|REST API| Intelligence["<b>Intelligence Layer</b><br/>FastAPI/Python"]
    Intelligence -->|Aggregation| Sources["<b>Data Sources</b><br/>Kalshi, Polymarket, etc."]
    
    subgraph "This Repository (Frontend Demo)"
        Presentation
        SDK
        DemoMode["<b>Demo Mode</b><br/>/ Mock Data"]
    end
    
    style User fill:#64748B,stroke:#475569,stroke-width:3px,color:#FFFFFF
    style Presentation fill:#3B82F6,stroke:#1E40AF,stroke-width:3px,color:#FFFFFF
    style SDK fill:#8B5CF6,stroke:#6D28D9,stroke-width:3px,color:#FFFFFF
    style Intelligence fill:#10B981,stroke:#047857,stroke-width:4px,color:#FFFFFF
    style Sources fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#FFFFFF
    style DemoMode fill:#EC4899,stroke:#BE185D,stroke-width:3px,color:#FFFFFF
```

---

## 1. Presentation Layer (Public Repo)

The user interface is built using **Next.js 14** with the App Router, offering a professional, responsive dashboard.

### Core Stack
- **Framework**: React 18 / Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query / Context API

### Demo Mode Architecture
To facilitate immediate evaluation, the frontend includes a **Demo Mode (Mock Data)** sub-module. This allows the UI to render realistic, high-fidelity sample data without a backend connection.

---

## 2. Intelligence Layer (Private)

The backend is a high-performance Python ecosystem designed for real-time market analysis.

### High-Level Service Modules

#### 2.1 Data Ingestion Engine
Continuously polls prediction exchanges for new markets and price updates across Polymarket, Kalshi, Opinion, and Limitless.

#### 2.2 Normalization Layer
Converts platform-specific formats (e.g., Kalshi's cents vs. Polymarket's decimals) into a unified schema.

#### 2.3 Analysis Engines (v0.2)

```mermaid
graph LR
    A["<b>Market Data</b>"] --> B["<b>Option Pricing Engine</b>"]
    A --> C["<b>Arbitrage Scanner</b>"]
    
    B --> D["<b>Mispricing Signals</b>"]
    C --> E["<b>Arbitrage Opportunities</b>"]
    
    D --> F["<b>Signal Synthesis</b>"]
    E --> F
    G["<b>User Profile</b>"] --> F
    
    F --> H["<b>Top10 Recommendations</b>"]
    
    style A fill:#64748B,stroke:#475569,stroke-width:3px,color:#FFFFFF
    style B fill:#10B981,stroke:#047857,stroke-width:3px,color:#FFFFFF
    style C fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#FFFFFF
    style D fill:#34D399,stroke:#059669,stroke-width:3px,color:#065F46
    style E fill:#FCD34D,stroke:#F59E0B,stroke-width:3px,color:#78350F
    style F fill:#8B5CF6,stroke:#6D28D9,stroke-width:4px,color:#FFFFFF
    style G fill:#3B82F6,stroke:#1E40AF,stroke-width:3px,color:#FFFFFF
    style H fill:#EC4899,stroke:#BE185D,stroke-width:4px,color:#FFFFFF
```

**Option Pricing Engine (v0.2)**:
- Maps prediction markets to equivalent option payoffs (digital/barrier options)
- Uses implied volatility from real option markets (Deribit, CBOE, etc.)
- Computes risk-neutral fair probabilities
- Identifies markets that are cheap, fair, or expensive relative to option markets

**Arbitrage Scanner (v0.2)**:
- Normalizes event definitions across platforms
- Compares implied probabilities to detect price discrepancies
- Calculates spread percentages and identifies executable arbitrage opportunities
- Provides execution instructions (buy on Platform A, sell on Platform B)

#### 2.4 Ranking & Scoring System

```mermaid
graph TD
    A["<b>Option Pricing</b><br/>Deviation Signal"] --> D["<b>Recommendation Engine</b>"]
    B["<b>Arbitrage</b><br/>Opportunity Score"] --> D
    C["<b>User Profile</b><br/>Personalization Match"] --> D
    
    D --> E{Opportunity Type}
    E -->|Arbitrage| F["<b>High Priority</b><br/>Risk-Free Profit"]
    E -->|Mispricing| G["<b>Medium Priority</b><br/>Trading Edge"]
    E -->|Best Fit| H["<b>Lower Priority</b><br/>Quality Match"]
    
    F --> I["<b>Top10 Ranking</b>"]
    G --> I
    H --> I
    
    style A fill:#10B981,stroke:#047857,stroke-width:3px,color:#FFFFFF
    style B fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#FFFFFF
    style C fill:#3B82F6,stroke:#1E40AF,stroke-width:3px,color:#FFFFFF
    style D fill:#8B5CF6,stroke:#6D28D9,stroke-width:4px,color:#FFFFFF
    style E fill:#E5E7EB,stroke:#6B7280,stroke-width:2px,color:#111827
    style F fill:#EF4444,stroke:#DC2626,stroke-width:3px,color:#FFFFFF
    style G fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#FFFFFF
    style H fill:#6366F1,stroke:#4338CA,stroke-width:3px,color:#FFFFFF
    style I fill:#FCD34D,stroke:#F59E0B,stroke-width:4px,color:#78350F
```

**How Top10 Ranking Works**:
1. **Primary Signal Detection**: Identifies markets with arbitrage opportunities OR pricing deviations from option markets
2. **Signal Strength**: Quantifies the magnitude (e.g., 7% arbitrage spread, 5% pricing deviation)
3. **Personalization Matching**: Matches user expertise and preferences to market categories
4. **Liquidity Check**: Ensures sufficient liquidity for execution
5. **Final Ranking**: Combines opportunity score + personalization fit to produce Top10

**Output**: Ranked list of markets with:
- **Primary Signal**: What triggered the recommendation (arbitrage, mispricing, or best fit)
- **Explicit Rationale**: Why this market is recommended
- **Actionability**: Specific recommendation (buy/sell/avoid)

---

## 3. PredictorIQ SDK

The SDK provides a type-safe interface for any frontend or automated trading system to interact with the PredictorIQ intelligence layer.

**Key Features:**
- Fully typed using TypeScript interfaces
- Lightweight, axios-based client
- Built-in support for environment-based configuration

**Core Endpoints:**
- `getDailyTop10(userProfile?)`: Get personalized Top10 recommendations (v0.1 + v0.2)
- `getArbitrageAlerts()`: Real-time arbitrage opportunities (v0.2)
- `getOptionPricingAnalysis(marketId)`: Option-anchored pricing analysis (v0.2)

---

## 4. Data Flow: Top10 Generation

```mermaid
sequenceDiagram
    participant U as <b>User</b>
    participant F as <b>Frontend</b>
    participant A as <b>API</b>
    participant O as <b>Option Engine</b>
    participant AR as <b>Arbitrage Scanner</b>
    participant R as <b>Ranking Engine</b>
    
    U->>F: Request Top10
    F->>A: GET /v1/daily-top10
    A->>O: Get Option Pricing Analysis
    O-->>A: Mispricing Signals
    A->>AR: Get Arbitrage Opportunities
    AR-->>A: Arbitrage Alerts
    A->>R: Synthesize Signals + User Profile
    R-->>A: Top10 Rankings
    A-->>F: Top10Response
    F-->>U: Display Recommendations
```

---

## 5. Scalability & Performance

- **Data Refresh**: Market data is typically updated every 5-15 minutes depending on volume
- **Latency**: The system is optimized for fast discovery rather than high-frequency execution
- **Option Pricing**: Calculated on-demand, cached for frequently accessed markets
- **Arbitrage Scanning**: Continuous monitoring with alerts generated within 30 seconds of detection
- **Security**: The architecture supports secure lead capture via Formspree and API-key-based authentication in live mode

---

**Last Updated**: January 2026  
**Version**: 0.2  
**Contact**: nelson.jingusc@gmail.com
