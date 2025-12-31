/**
 * Mock data for PredictorIQ demo mode
 * 
 * This file contains realistic sample data for all major features.
 * Used when NEXT_PUBLIC_DEMO_MODE=true
 */

import type {
  Top10Response,
  ArbitrageAlertsResponse,
  StrategyListResponse,
  MarketIdeasResponse,
  AgentFeedResponse,
} from '@predictoriq/sdk';

// Mock Top10 Data
export const mockTop10Data: Top10Response = {
  generated_at: new Date().toISOString(),
  items: [
    {
      rank: 1,
      market: {
        platform: 'POLYMARKET',
        market_id: 'pm_fed_rate_jan_2024',
        event_id: 'fed_rate_decision',
        title: 'Will the Fed cut interest rates by 0.25% or more in January 2024?',
        mid_price: 0.72,
        volume_24h: 145000,
        liquidity: 420000,
        status: 'active',
        url: 'https://polymarket.com/event/fed-rate-jan',
        category: 'Economics',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 9.2,
      edge_rationale: 'Strong consensus from economic indicators and Fed statements suggesting a rate cut is likely. Market pricing shows 72% confidence, but technical analysis of Fed communication patterns suggests actual probability closer to 85%.',
      confidence: 0.87,
      recommended_action: 'BUY YES at current 72% if you believe Fed will cut rates',
    },
    {
      rank: 2,
      market: {
        platform: 'KALSHI',
        market_id: 'kalshi_btc_60k',
        event_id: 'btc_price',
        title: 'Bitcoin to reach $60,000 before Feb 1, 2024?',
        mid_price: 0.45,
        volume_24h: 89000,
        liquidity: 250000,
        status: 'active',
        url: 'https://kalshi.com/events/btc-60k',
        category: 'Crypto',
        created_at: '2023-12-15T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 8.8,
      edge_rationale: 'Current BTC momentum and institutional buying patterns suggest underpriced probability. Historical volatility analysis indicates 58% actual probability vs 45% market price.',
      confidence: 0.82,
      recommended_action: 'BUY YES - favorable risk/reward ratio',
    },
    {
      rank: 3,
      market: {
        platform: 'POLYMARKET',
        market_id: 'pm_nfl_superbowl',
        event_id: 'superbowl_2024',
        title: 'Kansas City Chiefs to win Super Bowl 2024?',
        mid_price: 0.28,
        volume_24h: 210000,
        liquidity: 580000,
        status: 'active',
        url: 'https://polymarket.com/event/superbowl-2024',
        category: 'Sports',
        created_at: '2023-09-01T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 8.5,
      edge_rationale: 'Team performance metrics and playoff seeding analysis suggest higher win probability than market price. Chiefs offensive stats and coaching edge factor not fully priced in.',
      confidence: 0.79,
      recommended_action: 'CONSIDER BUY - moderate edge identified',
    },
    {
      rank: 4,
      market: {
        platform: 'KALSHI',
        market_id: 'kalshi_ai_regulation',
        event_id: 'ai_bill',
        title: 'Will Congress pass major AI regulation bill in Q1 2024?',
        mid_price: 0.38,
        volume_24h: 45000,
        liquidity: 120000,
        status: 'active',
        url: 'https://kalshi.com/events/ai-regulation',
        category: 'Politics',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 8.3,
      edge_rationale: 'Legislative calendar analysis and committee hearing frequency suggest higher probability of passage than current market price. Bipartisan support indicators strong.',
      confidence: 0.76,
      recommended_action: 'BUY YES - undervalued political momentum',
    },
    {
      rank: 5,
      market: {
        platform: 'POLYMARKET',
        market_id: 'pm_tesla_delivery',
        event_id: 'tsla_q1',
        title: 'Tesla Q1 2024 deliveries exceed 500k vehicles?',
        mid_price: 0.61,
        volume_24h: 67000,
        liquidity: 190000,
        status: 'active',
        url: 'https://polymarket.com/event/tesla-q1',
        category: 'Business',
        created_at: '2023-12-20T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 8.1,
      edge_rationale: 'Production ramp data from Shanghai and Berlin factories indicates delivery numbers tracking above consensus. Supply chain improvements not yet reflected in market pricing.',
      confidence: 0.74,
      recommended_action: 'HOLD or slight BUY - fair value around 65%',
    },
    {
      rank: 6,
      market: {
        platform: 'KALSHI',
        market_id: 'kalshi_unemployment',
        event_id: 'unemployment_jan',
        title: 'US Unemployment rate below 4.0% in January 2024?',
        mid_price: 0.68,
        volume_24h: 52000,
        liquidity: 160000,
        status: 'active',
        url: 'https://kalshi.com/events/unemployment-jan',
        category: 'Economics',
        created_at: '2023-12-28T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 7.9,
      edge_rationale: 'Labor market data trends and seasonal adjustment patterns suggest probability slightly higher than market. Initial jobless claims trending lower than expected.',
      confidence: 0.71,
      recommended_action: 'SLIGHT BUY - small edge identified',
    },
    {
      rank: 7,
      market: {
        platform: 'POLYMARKET',
        market_id: 'pm_openai_gpt5',
        event_id: 'gpt5_release',
        title: 'OpenAI to release GPT-5 before June 2024?',
        mid_price: 0.42,
        volume_24h: 98000,
        liquidity: 280000,
        status: 'active',
        url: 'https://polymarket.com/event/gpt5-release',
        category: 'Technology',
        created_at: '2023-11-15T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 7.7,
      edge_rationale: 'Analysis of OpenAI hiring patterns and compute resource allocation suggests development timeline may be faster than market expects. Previous release patterns support earlier launch.',
      confidence: 0.68,
      recommended_action: 'MONITOR - edge exists but lower confidence',
    },
    {
      rank: 8,
      market: {
        platform: 'KALSHI',
        market_id: 'kalshi_weather_feb',
        event_id: 'nyc_snow',
        title: 'NYC to get 10+ inches of snow in February 2024?',
        mid_price: 0.35,
        volume_24h: 34000,
        liquidity: 95000,
        status: 'active',
        url: 'https://kalshi.com/events/nyc-snow-feb',
        category: 'Weather',
        created_at: '2024-01-10T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 7.5,
      edge_rationale: 'Long-range weather models and El Niño patterns indicate higher probability of major snowfall event. Historical data supports 40-45% probability vs 35% market price.',
      confidence: 0.65,
      recommended_action: 'SMALL BUY - weather edge identified',
    },
    {
      rank: 9,
      market: {
        platform: 'POLYMARKET',
        market_id: 'pm_oscars_oppenheimer',
        event_id: 'oscars_2024',
        title: 'Oppenheimer to win Best Picture at 2024 Oscars?',
        mid_price: 0.71,
        volume_24h: 125000,
        liquidity: 340000,
        status: 'active',
        url: 'https://polymarket.com/event/oscars-2024',
        category: 'Entertainment',
        created_at: '2023-10-01T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 7.3,
      edge_rationale: 'Awards season momentum and guild award patterns suggest Oppenheimer probability around 75-78%. Current market price slightly undervalues based on historical Oscar voting patterns.',
      confidence: 0.63,
      recommended_action: 'FAIR VALUE - small edge, high liquidity',
    },
    {
      rank: 10,
      market: {
        platform: 'KALSHI',
        market_id: 'kalshi_spacex_starship',
        event_id: 'starship_orbit',
        title: 'SpaceX Starship completes orbital test flight in Q1 2024?',
        mid_price: 0.48,
        volume_24h: 56000,
        liquidity: 145000,
        status: 'active',
        url: 'https://kalshi.com/events/starship-orbit',
        category: 'Technology',
        created_at: '2023-11-20T00:00:00Z',
        updated_at: new Date().toISOString(),
      },
      ai_score: 7.1,
      edge_rationale: 'FAA approval timeline analysis and SpaceX testing cadence suggest 52-55% probability. Recent hardware improvements and successful ground tests support slightly higher odds.',
      confidence: 0.61,
      recommended_action: 'HOLD - roughly fair value',
    },
  ],
  metadata: {
    total_markets_analyzed: 847,
    platforms_covered: ['KALSHI', 'POLYMARKET', 'LIMITLESS'],
    ranking_model_version: 'v2.3.1',
    data_freshness_minutes: 5,
  },
};

// Mock Arbitrage Data
export const mockArbitrageData: ArbitrageAlertsResponse = {
  alerts: [
    {
      canonical_event_key: 'btc_price_60k_feb2024',
      event_title: 'Bitcoin to reach $60,000 before February 1, 2024',
      spread_percent: 4.8,
      legs: [
        {
          platform: 'KALSHI',
          market_id: 'kalshi_btc_60k',
          action: 'buy',
          price: 0.42,
          liquidity: 85000,
        },
        {
          platform: 'POLYMARKET',
          market_id: 'pm_btc_60k',
          action: 'sell',
          price: 0.47,
          liquidity: 120000,
        },
      ],
      mapping_confidence: 0.95,
      estimated_profit: 480,
      liquidity_score: 0.88,
      detected_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    },
    {
      canonical_event_key: 'fed_rate_jan2024',
      event_title: 'Fed to cut rates by 0.25% or more in January 2024',
      spread_percent: 3.2,
      legs: [
        {
          platform: 'POLYMARKET',
          market_id: 'pm_fed_rate_jan',
          action: 'buy',
          price: 0.71,
          liquidity: 250000,
        },
        {
          platform: 'KALSHI',
          market_id: 'kalshi_fed_jan',
          action: 'sell',
          price: 0.74,
          liquidity: 180000,
        },
      ],
      mapping_confidence: 0.98,
      estimated_profit: 320,
      liquidity_score: 0.92,
      detected_at: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    },
    {
      canonical_event_key: 'unemployment_jan2024',
      event_title: 'US Unemployment rate below 4.0% in January 2024',
      spread_percent: 2.9,
      legs: [
        {
          platform: 'KALSHI',
          market_id: 'kalshi_unemployment_jan',
          action: 'buy',
          price: 0.66,
          liquidity: 95000,
        },
        {
          platform: 'POLYMARKET',
          market_id: 'pm_unemployment_jan',
          action: 'sell',
          price: 0.69,
          liquidity: 140000,
        },
      ],
      mapping_confidence: 0.93,
      estimated_profit: 290,
      liquidity_score: 0.79,
      detected_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
  ],
  generated_at: new Date().toISOString(),
  total_count: 3,
};

// Mock Strategies Data
export const mockStrategiesData: StrategyListResponse = {
  strategies: [
    {
      strategy_id: 'momentum_tech_1',
      name: 'Tech Momentum Rider',
      description: 'Capitalize on sustained trends in technology prediction markets by identifying markets with strong directional momentum and favorable risk-reward profiles.',
      strategy_type: 'momentum',
      markets: [],
      expected_edge: '+8-12% annual return with disciplined entry/exit',
      risk_level: 'medium',
      time_horizon: '2-6 weeks per position',
      entry_signals: [
        'Market shows 3+ consecutive days of price movement in same direction',
        'Volume increasing by 20%+ during the trend',
        'News sentiment score above 0.6',
        'Technical indicators (RSI, MACD) confirm momentum',
      ],
      exit_signals: [
        'Price reaches predetermined profit target (typically 15-20%)',
        'Momentum indicators show divergence',
        'Volume drops below 50% of entry volume',
        'Negative news catalyst emerges',
      ],
      personalization_score: 0.85,
    },
    {
      strategy_id: 'arbitrage_cross_platform',
      name: 'Cross-Platform Arbitrage',
      description: 'Exploit price discrepancies for the same event across different prediction market platforms to generate low-risk, consistent returns.',
      strategy_type: 'arbitrage',
      markets: [],
      expected_edge: '+4-6% per successful trade, 15-25 trades/month',
      risk_level: 'low',
      time_horizon: 'Minutes to hours',
      entry_signals: [
        'Price spread ≥3% between platforms for same event',
        'Event matching confidence score ≥90%',
        'Sufficient liquidity on both sides (≥$50k each)',
        'No breaking news affecting the market',
      ],
      exit_signals: [
        'Spread narrows below 1%',
        'Liquidity drops below comfort level',
        'Positions filled on both platforms',
        'Event resolution approaching (within 24h)',
      ],
      personalization_score: 0.92,
    },
    {
      strategy_id: 'mean_reversion_overreaction',
      name: 'News Overreaction Fader',
      description: 'Identify markets that have overreacted to news events and position for mean reversion as market participants reassess probabilities.',
      strategy_type: 'mean_reversion',
      markets: [],
      expected_edge: '+10-15% return on successful reversals',
      risk_level: 'medium',
      time_horizon: '1-3 weeks',
      entry_signals: [
        'Sudden price movement >15% in single day',
        'Move triggered by news that may be overinterpreted',
        'Historical volatility suggests reversion likely',
        'Contrarian indicator signals overbought/oversold',
      ],
      exit_signals: [
        'Price reverts 60%+ of initial move',
        'New information validates the initial move',
        'Position held for 3 weeks without reversion',
        'Stop loss at 30% beyond entry',
      ],
      personalization_score: 0.78,
    },
    {
      strategy_id: 'event_driven_earnings',
      name: 'Corporate Event Predictor',
      description: 'Trade prediction markets related to corporate events (earnings, product launches) using fundamental analysis and historical patterns.',
      strategy_type: 'event_driven',
      markets: [],
      expected_edge: '+12-18% per earnings season',
      risk_level: 'high',
      time_horizon: '1-4 weeks leading up to event',
      entry_signals: [
        'Earnings date announced, 2-4 weeks out',
        'Market probability differs from model estimate by ≥10%',
        'Analyst consensus shows clear trend',
        'Historical accuracy of similar predictions',
      ],
      exit_signals: [
        'Event occurs (earnings announced)',
        'New guidance changes probability assessment',
        'Position reaches 2x expected edge',
        'Within 2 days of event (reduce event risk)',
      ],
      personalization_score: 0.81,
    },
    {
      strategy_id: 'portfolio_hedge',
      name: 'Portfolio Downside Hedge',
      description: 'Use prediction markets to hedge portfolio risk by taking positions on macro events that could impact your holdings.',
      strategy_type: 'custom',
      markets: [],
      expected_edge: 'Risk reduction rather than returns',
      risk_level: 'low',
      time_horizon: 'Ongoing, rebalance monthly',
      entry_signals: [
        'Portfolio exposure to specific risk increases',
        'Prediction market pricing attractive for hedge',
        'Correlation analysis confirms hedge effectiveness',
        'Cost of hedge <2% of portfolio value',
      ],
      exit_signals: [
        'Portfolio risk exposure reduced',
        'Hedge becomes too expensive (>3% cost)',
        'Correlation breaks down',
        'Better hedging instrument available',
      ],
      personalization_score: 0.74,
    },
  ],
  generated_at: new Date().toISOString(),
};

// Mock Ideas Data
export const mockIdeasData: MarketIdeasResponse = {
  ideas: [
    {
      idea_id: 'idea_ai_compute',
      title: 'Will any AI model surpass GPT-4 on major benchmarks before March 2024?',
      description: 'Create a market tracking whether Anthropic, Google, or other competitors will release an AI model that outperforms GPT-4 on standard benchmarks like MMLU, HumanEval, or GSM8K.',
      category: 'Technology',
      rationale: 'High interest in AI development with significant capital at stake. Recent announcements from Anthropic (Claude) and Google (Gemini) suggest imminent releases. Would attract both tech enthusiasts and AI researchers.',
      potential_liquidity: 'high',
      time_sensitivity: 'high',
      similar_markets: [],
      personalization_score: 0.88,
    },
    {
      idea_id: 'idea_climate_co2',
      title: 'Will global CO2 levels exceed 430 ppm in 2024?',
      description: 'Market on whether atmospheric CO2 concentration will surpass 430 parts per million at any point during 2024, based on NOAA Mauna Loa Observatory data.',
      category: 'Climate',
      rationale: 'Growing interest in climate metrics with clear, objective resolution criteria. Current levels trending near 425 ppm. Appeals to climate-aware traders and hedgers.',
      potential_liquidity: 'medium',
      time_sensitivity: 'medium',
      similar_markets: [],
      personalization_score: 0.72,
    },
    {
      idea_id: 'idea_gaming_gta6',
      title: 'Will GTA 6 release before December 2024?',
      description: 'Prediction market on whether Rockstar Games will release Grand Theft Auto 6 before the end of 2024, following recent trailer release.',
      category: 'Entertainment',
      rationale: 'Massive gaming community interest. GTA V generated $1B in 3 days. Recent trailer sparked huge speculation. Clear resolution date and binary outcome.',
      potential_liquidity: 'high',
      time_sensitivity: 'high',
      similar_markets: [],
      personalization_score: 0.85,
    },
    {
      idea_id: 'idea_space_artemis',
      title: 'NASA Artemis 3 Moon landing to occur in 2025?',
      description: 'Market on whether NASA\'s Artemis 3 mission will successfully land astronauts on the Moon during 2025 as currently scheduled.',
      category: 'Space',
      rationale: 'High-profile space mission with significant delays historically. Technical challenges and budget constraints create uncertainty. Appeals to space enthusiasts and tech traders.',
      potential_liquidity: 'medium',
      time_sensitivity: 'low',
      similar_markets: [],
      personalization_score: 0.68,
    },
    {
      idea_id: 'idea_pharma_obesity',
      title: 'Will FDA approve new obesity drug more effective than Ozempic in 2024?',
      description: 'Market tracking whether the FDA will approve any obesity treatment demonstrating superior weight loss results to semaglutide (Ozempic/Wegovy) during 2024.',
      category: 'Healthcare',
      rationale: 'Massive market opportunity ($100B+ obesity drug market). Multiple drugs in pipeline. Clear clinical endpoints. Both healthcare professionals and investors would participate.',
      potential_liquidity: 'high',
      time_sensitivity: 'medium',
      similar_markets: [],
      personalization_score: 0.79,
    },
    {
      idea_id: 'idea_sports_olympics',
      title: 'Will USA win most gold medals at 2024 Paris Olympics?',
      description: 'Prediction market on whether the United States will win more gold medals than any other country at the 2024 Summer Olympics in Paris.',
      category: 'Sports',
      rationale: 'Olympics generate massive global interest. Clear resolution criteria. Historical data available for analysis. Would attract international traders and sports fans.',
      potential_liquidity: 'high',
      time_sensitivity: 'medium',
      similar_markets: [],
      personalization_score: 0.82,
    },
  ],
  generated_at: new Date().toISOString(),
};

// Mock Agents Feed Data
export const mockAgentsFeedData: AgentFeedResponse = {
  messages: [
    {
      agent: 'alpha_scout',
      timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      message_type: 'opportunity',
      title: 'High-Confidence Opportunity Detected: Fed Rate Decision',
      content: `I've identified a high-confidence trading opportunity on the Fed rate decision market.

**Market**: Fed to cut rates by 0.25%+ in January 2024
**Platform**: Polymarket
**Current Price**: 72% YES
**AI Model Estimate**: 85% probability
**Edge**: +13 percentage points

**Rationale**:
- Recent Fed communications show dovish shift
- Inflation data trending below target faster than expected
- Employment data suggests cooling without recession
- Historical pattern recognition shows similar setups resolved YES 87% of time

**Recommendation**: BUY YES at current levels. Position size: 2-3% of portfolio.

**Risk Factors**: Unexpected inflation spike, geopolitical crisis, stronger employment data.`,
      priority: 'high',
      data: {
        market_id: 'pm_fed_rate_jan_2024',
        confidence: 0.87,
        expected_edge: 0.13,
      },
    },
    {
      agent: 'portfolio_guardian',
      timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      message_type: 'alert',
      title: 'Portfolio Risk Alert: Concentration Risk Detected',
      content: `Your portfolio has elevated concentration risk in Technology category markets.

**Current Allocation**:
- Technology: 42% (⚠️ High)
- Politics: 23%
- Economics: 18%
- Sports: 12%
- Other: 5%

**Recommendation**: Consider reducing Technology exposure to 25-30% and diversifying into Economics or Politics markets.

**Suggested Actions**:
1. Take partial profits on GPT-5 release market (+15% unrealized)
2. Reduce position size in Bitcoin $60k market
3. Consider adding Fed rate decision or unemployment markets

This would improve your Sharpe ratio and reduce tail risk.`,
      priority: 'medium',
      data: {
        concentration_score: 0.42,
        recommended_rebalance: true,
      },
    },
    {
      agent: 'research_autopilot',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      message_type: 'report',
      title: 'Research Complete: Bitcoin $60k Market Analysis',
      content: `Completed deep research on "Bitcoin to reach $60,000 before Feb 1, 2024" market.

**Thesis**: LIKELY (58% probability vs 45% market price)

**Supporting Evidence**:
1. **Technical Analysis**: BTC broke above 200-day MA with high volume
2. **On-chain Data**: Whale accumulation increased 23% in past 2 weeks
3. **Institutional Flow**: ETF inflows hit $340M last week
4. **Correlation Analysis**: Historical Jan-Feb performance shows +12% average

**Risk Factors**:
- Regulatory uncertainty (SEC meetings scheduled)
- Macro headwinds if Fed stays hawkish
- Mt. Gox distribution overhang

**Conclusion**: Market underpricing probability by ~13%. Recommended position: BUY YES, 3-5% portfolio allocation.

**Confidence**: 82%`,
      priority: 'medium',
      data: {
        market_id: 'kalshi_btc_60k',
        thesis_confidence: 0.82,
        recommended_probability: 0.58,
      },
    },
    {
      agent: 'alpha_scout',
      timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000).toISOString(),
      message_type: 'insight',
      title: 'Pattern Recognition: Oscars Market Mispricing',
      content: `Historical pattern analysis suggests Oscars markets are currently mispriced.

**Finding**: "Oppenheimer to win Best Picture" at 71% is undervalued.

**Pattern**: When a film wins both Directors Guild + Producers Guild awards (which Oppenheimer did), it wins Best Picture 89% of the time historically (31 out of 35 cases since 1989).

**Additional Factors**:
- SAG ensemble win: +5% probability
- BAFTA Best Picture: +4% probability  
- Critics' awards sweep: +3% probability

**Model Estimate**: 78-82% probability
**Market Price**: 71%
**Edge**: +7-11 percentage points

This is a lower-priority opportunity (lower edge than Fed rate market) but worth consideration for entertainment category exposure.`,
      priority: 'low',
      data: {
        market_id: 'pm_oscars_oppenheimer',
        historical_accuracy: 0.89,
      },
    },
    {
      agent: 'portfolio_guardian',
      timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      message_type: 'alert',
      title: 'Profit Target Reached: Tesla Deliveries Market',
      content: `Your position in "Tesla Q1 deliveries exceed 500k" has reached your predefined profit target.

**Position Details**:
- Entry Price: 56% YES
- Current Price: 61% YES
- Unrealized P&L: +8.9% (+$445)
- Time Held: 12 days

**Recommendation**: Consider taking profits. Market has moved in your favor and is approaching fair value based on latest production data.

**Options**:
1. **Take Full Profits**: Lock in +8.9% return
2. **Take Partial Profits**: Sell 50-70%, let rest ride
3. **Hold**: Wait for Q1 production report (2 weeks away)

Given your portfolio's current profit levels and upcoming data catalysts, I recommend Option 2: Take 60% profits, hold 40% with tighter stop loss.`,
      priority: 'high',
      data: {
        position_id: 'pos_tesla_q1',
        unrealized_pnl: 445,
        profit_target_reached: true,
      },
    },
    {
      agent: 'research_autopilot',
      timestamp: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
      message_type: 'insight',
      title: 'Correlation Discovery: Tech Markets Moving Together',
      content: `Discovered significant correlation between AI-related prediction markets.

**Finding**: Markets for GPT-5 release, Anthropic funding, and NVIDIA earnings are showing 0.78 correlation over past 30 days - higher than typical.

**Implication**: If you hold multiple positions in these markets, your risk is higher than it appears. A single negative AI news event could impact all positions simultaneously.

**Current Exposure**:
- GPT-5 release market: 8% of portfolio
- AI regulation market: 5% of portfolio
- NVIDIA market: 6% of portfolio
- **Total correlated exposure**: 19% ⚠️

**Recommendation**: Consider this cluster as a single 19% position for risk management purposes. May want to reduce to 12-15% total.`,
      priority: 'medium',
      data: {
        correlation_coefficient: 0.78,
        affected_positions: 3,
      },
    },
    {
      agent: 'alpha_scout',
      timestamp: new Date(Date.now() - 5.2 * 60 * 60 * 1000).toISOString(),
      message_type: 'opportunity',
      title: 'Arbitrage Opportunity: Bitcoin Market Spread',
      content: `Cross-platform arbitrage opportunity detected!

**Event**: Bitcoin to reach $60,000 before Feb 1, 2024

**Spread**: 4.8%
- **BUY on Kalshi**: 42% ($0.42)
- **SELL on Polymarket**: 47% ($0.47)
- **Profit**: $0.05 per $1 position = 5% risk-free return

**Liquidity**:
- Kalshi: $85k available
- Polymarket: $120k available
- **Max Position**: ~$40k per side (maintaining safety margin)

**Expected Profit**: $2,000 on $40k position (5% return)

**Time Decay**: Spread has been stable for 15 minutes. Typically these opportunities close within 30-60 minutes.

**Action Required**: This is time-sensitive. Execute within next 10-15 minutes for best results.`,
      priority: 'high',
      data: {
        spread_percent: 4.8,
        estimated_profit: 2000,
        time_sensitive: true,
      },
    },
    {
      agent: 'portfolio_guardian',
      timestamp: new Date(Date.now() - 6.5 * 60 * 60 * 1000).toISOString(),
      message_type: 'insight',
      title: 'Portfolio Performance Update: Above Benchmark',
      content: `Weekly portfolio performance summary:

**7-Day Performance**:
- Your Portfolio: +5.2%
- S&P 500: +1.8%
- Prediction Market Index: +2.9%
- **Alpha vs PM Index**: +2.3% ✅

**Best Performers**:
1. Fed Rate Decision: +12% (unrealized)
2. Unemployment Market: +8%
3. Tesla Deliveries: +9%

**Underperformers**:
1. SpaceX Starship: -4% (within acceptable range)
2. NYC Weather: -2% (small position)

**Risk Metrics**:
- Sharpe Ratio: 2.1 (excellent)
- Max Drawdown: -3.2% (well-controlled)
- Win Rate: 68% (7 wins, 3 losses over 30 days)

**Overall**: Portfolio performing well. Risk-adjusted returns strong. Continue current strategy with minor rebalancing as suggested earlier.`,
      priority: 'low',
      data: {
        seven_day_return: 0.052,
        sharpe_ratio: 2.1,
        win_rate: 0.68,
      },
    },
  ],
  generated_at: new Date().toISOString(),
};
