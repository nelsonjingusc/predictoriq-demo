# PredictorIQ - Product Overview

> Intelligence layer for prediction markets designed for serious, long-term participants

PredictorIQ is an intelligent intelligence layer for prediction markets, designed to help traders find asymmetric opportunities where they possess a unique informational edge.

---

## The Problem

Most prediction market platforms emphasize high-volume, "trending" markets. However, the highest returns for individual traders often come from niche markets where they have specific domain expertise that the general public lacks. Additionally, market prices often reflect narrative momentum or thin liquidity rather than defensible probabilistic benchmarks.

---

## The Solution

PredictorIQ provides objective pricing anchors from professional financial markets and synthesizes multiple signals to identify markets with clear trading opportunities or optimal personalization fit.

---

## Core Product Capabilities

```mermaid
graph TB
    subgraph "PredictorIQ"
        A["<b>Option-Anchored<br/>Pricing Analysis</b>"] --> D["<b>Personalized<br/>Top10 Recommendations</b>"]
        B["<b>Cross-Platform<br/>Arbitrage Scanner</b>"] --> D
        C["<b>User Profile<br/>Expertise Matching</b>"] --> D
        
        D --> E["<b>Actionable Insights<br/>with Explicit Rationale</b>"]
        
    end
    
    style A fill:#10B981,stroke:#047857,stroke-width:3px,color:#ffffff
    style B fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#ffffff
    style C fill:#3B82F6,stroke:#1E40AF,stroke-width:3px,color:#ffffff
    style D fill:#8B5CF6,stroke:#6D28D9,stroke-width:4px,color:#ffffff
    style E fill:#EC4899,stroke:#BE185D,stroke-width:3px,color:#ffffff
```

---

## Key Features

### 📊 Option-Anchored Pricing Analysis

Maps prediction markets to equivalent option payoffs and uses implied volatility from real option markets (Deribit, CBOE, etc.) to compute fair probabilities, identifying mispriced markets relative to professional financial benchmarks.

```mermaid
graph LR
    A["<b>Prediction Market</b><br/>'BTC > $60K by Feb 1'<br/>Current: 65%"] --> B["<b>Map to<br/>Option Payoff</b>"]
    C["<b>Option Markets</b><br/>Implied Volatility<br/>Deribit, CBOE"] --> D["<b>Calculate<br/>Fair Probability</b>"]
    B --> D
    
    D --> E["<b>Fair: 68%</b>"]
    E --> F{Compare}
    A --> F
    
    F --> G{Deviation?}
    G -->|Yes| H["<b>Mispricing Detected</b><br/>Undervalued by 3%"]
    G -->|No| I["<b>Fairly Priced</b>"]
    
    style A fill:#DBEAFE,stroke:#3B82F6,stroke-width:3px,color:#1E3A8A
    style B fill:#FEF3C7,stroke:#F59E0B,stroke-width:3px,color:#78350F
    style C fill:#D1FAE5,stroke:#10B981,stroke-width:3px,color:#065F46
    style D fill:#DDD6FE,stroke:#8B5CF6,stroke-width:3px,color:#4C1D95
    style E fill:#FCE7F3,stroke:#EC4899,stroke-width:3px,color:#831843
    style F fill:#E5E7EB,stroke:#6B7280,stroke-width:2px,color:#111827
    style G fill:#E5E7EB,stroke:#6B7280,stroke-width:2px,color:#111827
    style H fill:#FEE2E2,stroke:#EF4444,stroke-width:3px,color:#7F1D1D
    style I fill:#D1FAE5,stroke:#10B981,stroke-width:3px,color:#065F46
```

**Output**: Clear assessment of whether markets are **cheap**, **fair**, or **expensive** relative to option markets.

---

### ⚖️ Cross-Platform Arbitrage Scanner

Real-time identification of price discrepancies for the same event across different platforms (Polymarket, Kalshi, Opinion, Limitless).

```mermaid
graph TB
    subgraph "Platforms"
        A["<b>Polymarket</b><br/>Event: 65%"]
        B["<b>Kalshi</b><br/>Event: 72%"]
        C["<b>Limitless</b><br/>Event: 58%"]
        D["<b>Opinion</b><br/>Event: 64%"]
    end
    
    A --> E["<b>Event<br/>Normalization</b>"]
    B --> E
    C --> E
    D --> E
    
    E --> F["<b>Price<br/>Comparison</b>"]
    F --> G{Spread > 3%?}
    
    G -->|Yes| H["<b>Arbitrage Alert</b><br/>7% Spread Detected<br/>BUY @ 65%, SELL @ 72%"]
    G -->|No| I["<b>No Opportunity</b>"]
    
    style A fill:#3B82F6,stroke:#1E40AF,stroke-width:3px,color:#FFFFFF
    style B fill:#EC4899,stroke:#BE185D,stroke-width:3px,color:#FFFFFF
    style C fill:#8B5CF6,stroke:#6D28D9,stroke-width:3px,color:#FFFFFF
    style D fill:#10B981,stroke:#047857,stroke-width:3px,color:#FFFFFF
    style E fill:#6366F1,stroke:#4338CA,stroke-width:3px,color:#FFFFFF
    style F fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#FFFFFF
    style G fill:#E5E7EB,stroke:#6B7280,stroke-width:2px,color:#111827
    style H fill:#FCD34D,stroke:#F59E0B,stroke-width:4px,color:#78350F
    style I fill:#E5E7EB,stroke:#9CA3AF,stroke-width:2px,color:#6B7280
```

**Output**: Actionable arbitrage opportunities with spread calculations and execution instructions across platforms.

---

### 🎯 Personalized Top10 Recommendations

Synthesizes signals from option pricing analysis, arbitrage opportunities, and user expertise matching to recommend markets with clear trading opportunities or optimal personalization fit.

```mermaid
graph TD
    A["<b>Option Pricing</b><br/>Mispricing Signal"] --> E["<b>Signal Synthesis</b><br/>& Ranking Engine"]
    B["<b>Arbitrage</b><br/>Opportunities"] --> E
    C["<b>User Profile</b><br/>Expertise Domains<br/>Geographic Location<br/>Risk Preferences"] --> E
    
    E --> F{Market Scoring}
    F --> G["<b>Arbitrage</b><br/>Opportunities<br/>Priority: High"]
    F --> H["<b>Mispricing</b><br/>Signals<br/>Priority: Medium"]
    F --> I["<b>Best Personalization</b><br/>Match<br/>Priority: Lower"]
    
    G --> J["<b>Top10 Ranking</b>"]
    H --> J
    I --> J
    
    J --> K["<b>Actionable Recommendations</b><br/>with Explicit Rationale"]
    
    style A fill:#10B981,stroke:#047857,stroke-width:3px,color:#FFFFFF
    style B fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#FFFFFF
    style C fill:#3B82F6,stroke:#1E40AF,stroke-width:3px,color:#FFFFFF
    style E fill:#8B5CF6,stroke:#6D28D9,stroke-width:4px,color:#FFFFFF
    style F fill:#E5E7EB,stroke:#6B7280,stroke-width:2px,color:#111827
    style G fill:#EF4444,stroke:#DC2626,stroke-width:3px,color:#FFFFFF
    style H fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#FFFFFF
    style I fill:#6366F1,stroke:#4338CA,stroke-width:3px,color:#FFFFFF
    style J fill:#FCD34D,stroke:#F59E0B,stroke-width:4px,color:#78350F
    style K fill:#EC4899,stroke:#BE185D,stroke-width:3px,color:#FFFFFF
```

**How Top10 Works**:
1. **Primary Signal Detection**: Identifies markets with arbitrage opportunities OR pricing deviations from option markets
2. **Personalization Matching**: Matches user expertise and preferences (similar to Match Score from v0.1)
3. **Liquidity Check**: Ensures sufficient liquidity and volume for execution
4. **Ranking Algorithm**: Combines opportunity score + personalization fit to produce Top10

**Each Top10 Recommendation Includes**:
- **Rank**: Overall opportunity score (0-10)
- **Primary Signal**: Arbitrage opportunity OR pricing deviation OR best personalization fit
- **Rationale**: Explicit explanation of why this market is recommended
- **Actionability**: Specific recommendation (e.g., "BUY YES - 3% undervalued vs option markets" or "Arbitrage opportunity: 7% spread detected")
- **Market Data**: Price, 24h volume, and liquidity across platforms

---

## Target Audience

- **Individual Traders**: Seeking an edge through domain-specific knowledge and objective pricing anchors
- **Institutional Firms**: Looking for systematic discovery of prediction market opportunities with professional-grade analytics
- **Arbitrageurs**: Cross-platform opportunity identification and execution
- **Market Operators**: Interested in an intelligence layer to improve user engagement and retention

---

## Demo Version Capabilities

This public repository contains the **Frontend Dashboard** and **TypeScript SDK**. To provide a complete experience without a backend, it includes a robust **Demo Mode** with:
- **Realistic Mock Data**: Samples for Top10, Arbitrage, and Option Pricing analysis
- **Interactive UI**: All navigation, filtering, and components are fully functional
- **SDK Documentation**: Clear examples of how to integrate with the PredictorIQ API

---

**Last Updated**: January 2026  
**Contact**: nelson.jingusc@gmail.com
