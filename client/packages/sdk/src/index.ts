/**
 * PredictorIQ TypeScript SDK
 *
 * Easy access to prediction market intelligence APIs.
 */

import axios, { AxiosInstance } from 'axios';

export * from './types';
import type {
  Top10Response,
  ArbitrageAlertsResponse,
  StrategyListResponse,
  MarketIdeasResponse,
  PortfolioSubmitRequest,
  PortfolioAlertsResponse,
  ResearchRequest,
  ResearchReport,
  AgentFeedResponse,
  WaitlistSubmission,
  WaitlistResponse,
  UserProfile
} from './types';

export interface PredictorIQConfig {
  apiUrl: string;
  apiKey?: string;
  timeout?: number;
}

export class PredictorIQClient {
  private client: AxiosInstance;

  constructor(config: PredictorIQConfig) {
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` })
      }
    });
  }

  /**
   * Get daily Top10 market recommendations.
   */
  async getDailyTop10(userProfile?: UserProfile): Promise<Top10Response> {
    const { data } = await this.client.get<Top10Response>('/v1/daily-top10', {
      params: userProfile ? { user_profile: JSON.stringify(userProfile) } : {}
    });
    return data;
  }

  /**
   * Get current arbitrage opportunities.
   */
  async getArbitrageAlerts(): Promise<ArbitrageAlertsResponse> {
    const { data } = await this.client.get<ArbitrageAlertsResponse>('/v1/arbitrage/alerts');
    return data;
  }

  /**
   * Get personalized trading strategies.
   */
  async getStrategies(userProfile?: UserProfile): Promise<StrategyListResponse> {
    const { data } = await this.client.get<StrategyListResponse>('/v1/strategies', {
      params: userProfile ? { user_profile: JSON.stringify(userProfile) } : {}
    });
    return data;
  }

  /**
   * Get market creation ideas.
   */
  async getMarketIdeas(userProfile?: UserProfile): Promise<MarketIdeasResponse> {
    const { data } = await this.client.get<MarketIdeasResponse>('/v1/ideas', {
      params: userProfile ? { user_profile: JSON.stringify(userProfile) } : {}
    });
    return data;
  }

  /**
   * Submit or update portfolio positions.
   */
  async submitPortfolio(request: PortfolioSubmitRequest): Promise<{ success: boolean; message: string }> {
    const { data } = await this.client.post('/v1/portfolio', request);
    return data;
  }

  /**
   * Get portfolio alerts and recommendations.
   */
  async getPortfolioAlerts(userId?: string): Promise<PortfolioAlertsResponse> {
    const { data } = await this.client.get<PortfolioAlertsResponse>('/v1/portfolio/alerts', {
      params: userId ? { user_id: userId } : {}
    });
    return data;
  }

  /**
   * Run research autopilot on a query.
   */
  async runResearch(request: ResearchRequest): Promise<ResearchReport> {
    const { data } = await this.client.post<ResearchReport>('/v1/research/run', request);
    return data;
  }

  /**
   * Get AI agent message feed.
   */
  async getAgentFeed(agentFilter?: string, limit: number = 20): Promise<AgentFeedResponse> {
    const { data } = await this.client.get<AgentFeedResponse>('/v1/agents/feed', {
      params: { agent_filter: agentFilter, limit }
    });
    return data;
  }

  /**
   * Submit waitlist signup.
   */
  async submitWaitlist(submission: WaitlistSubmission): Promise<WaitlistResponse> {
    const { data } = await this.client.post<WaitlistResponse>('/v1/waitlist', submission);
    return data;
  }
}

// Export default instance creator
export function createClient(config: PredictorIQConfig): PredictorIQClient {
  return new PredictorIQClient(config);
}
