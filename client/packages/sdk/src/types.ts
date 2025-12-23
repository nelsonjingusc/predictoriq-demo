/**
 * TypeScript types for PredictorIQ API.
 */

export type PlatformType = 'KALSHI' | 'POLYMARKET' | 'LIMITLESS';
export type MarketStatus = 'active' | 'closed' | 'settled' | 'pending';

export interface MarketNormalized {
  platform: PlatformType;
  market_id: string;
  event_id: string;
  title: string;
  yes_price?: number;
  no_price?: number;
  mid_price: number;
  volume_24h: number;
  liquidity: number;
  expiry_ts?: string;
  status: MarketStatus;
  url: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  user_id?: string;
  preferred_categories?: string[];
  risk_tolerance?: number;
  preferred_platforms?: PlatformType[];
  min_liquidity?: number;
}

export interface Top10Item {
  rank: number;
  market: MarketNormalized;
  ai_score: number;
  edge_rationale: string;
  confidence: number;
  recommended_action?: string;
}

export interface Top10Response {
  generated_at: string;
  user_profile?: UserProfile;
  items: Top10Item[];
  metadata: Record<string, any>;
}

export interface ArbitrageLeg {
  platform: PlatformType;
  market_id: string;
  action: 'buy' | 'sell';
  price: number;
  liquidity: number;
}

export interface ArbitrageAlert {
  canonical_event_key: string;
  event_title: string;
  spread_percent: number;
  legs: ArbitrageLeg[];
  mapping_confidence: number;
  estimated_profit?: number;
  liquidity_score: number;
  detected_at: string;
  expires_at?: string;
}

export interface ArbitrageAlertsResponse {
  alerts: ArbitrageAlert[];
  generated_at: string;
  total_count: number;
}

export type StrategyType = 'arbitrage' | 'momentum' | 'mean_reversion' | 'event_driven' | 'custom';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface StrategyCard {
  strategy_id: string;
  name: string;
  description: string;
  strategy_type: StrategyType;
  markets: MarketNormalized[];
  expected_edge?: string;
  risk_level: RiskLevel;
  time_horizon: string;
  entry_signals: string[];
  exit_signals: string[];
  personalization_score: number;
}

export interface StrategyListResponse {
  strategies: StrategyCard[];
  generated_at: string;
  user_profile?: UserProfile;
}

export type PotentialLevel = 'low' | 'medium' | 'high';

export interface MarketIdeaCard {
  idea_id: string;
  title: string;
  description: string;
  category: string;
  rationale: string;
  potential_liquidity: PotentialLevel;
  time_sensitivity: PotentialLevel;
  similar_markets: MarketNormalized[];
  personalization_score: number;
}

export interface MarketIdeasResponse {
  ideas: MarketIdeaCard[];
  generated_at: string;
  user_profile?: UserProfile;
}

export interface Position {
  position_id?: string;
  platform: PlatformType;
  market_id: string;
  market_title: string;
  side: 'yes' | 'no';
  quantity: number;
  entry_price: number;
  current_price?: number;
  unrealized_pnl?: number;
  entered_at: string;
}

export interface PortfolioSubmitRequest {
  user_id?: string;
  positions: Position[];
}

export type AlertType = 'risk_increase' | 'hedge_opportunity' | 'exit_signal' | 'rebalance';
export type Severity = 'low' | 'medium' | 'high';

export interface PortfolioAlert {
  position_id: string;
  alert_type: AlertType;
  severity: Severity;
  message: string;
  recommended_action?: string;
  related_markets: MarketNormalized[];
  generated_at: string;
}

export interface PortfolioAlertsResponse {
  alerts: PortfolioAlert[];
  generated_at: string;
  user_id?: string;
}

export interface ResearchRequest {
  query: string;
  market_ids?: string[];
  platforms?: PlatformType[];
  max_duration_seconds?: number;
}

export interface ResearchEvidence {
  source: string;
  data_point: string;
  confidence: number;
}

export interface ResearchReport {
  query: string;
  thesis: string;
  evidence: ResearchEvidence[];
  risk_factors: string[];
  failure_scenarios: string[];
  suggested_watchlist: MarketNormalized[];
  confidence_score: number;
  generated_at: string;
  execution_time_seconds: number;
}

export type AgentType = 'alpha_scout' | 'portfolio_guardian' | 'research_autopilot';
export type MessageType = 'opportunity' | 'alert' | 'insight' | 'report';
export type Priority = 'low' | 'medium' | 'high';

export interface AgentMessage {
  agent: AgentType;
  timestamp: string;
  message_type: MessageType;
  title: string;
  content: string;
  data?: Record<string, any>;
  priority: Priority;
}

export interface AgentFeedResponse {
  messages: AgentMessage[];
  agent_filter?: AgentType;
  generated_at: string;
}

export type PlanTier = 'free' | 'pro' | 'agent' | 'institutional';

export interface WaitlistSubmission {
  email: string;
  name?: string;
  plan_interest?: PlanTier;
  use_case?: string;
  referral_source?: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
  position?: number;
}
