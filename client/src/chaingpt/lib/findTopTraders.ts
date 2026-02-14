/**
 * Find top traders based on recent 500 trades analysis
 * This is a curated list based on manual analysis of Polymarket data
 */

export interface TopTrader {
  name: string;
  address: string;
  category: string;
  description: string;
  profitable: boolean;
}

/**
 * Top traders based on recent 500 trades analysis
 * Updated: 2026-02-13
 */
export const TOP_TRADERS: TopTrader[] = [
  // Row 1: Performance Leaders
  {
    name: 'beachboy4',
    address: '0xc2e7800b5af46e6093872b177b7a5e7f0563be51',
    category: 'Highest Win Rate',
    description: '50% win rate with excellent risk management',
    profitable: true,
  },
  {
    name: 'Fredi9999',
    address: '0x1f2dd6d473f3e824cd2f8a89d9c69fb96f6ad0cf',
    category: 'Most Profitable',
    description: 'Consistent profits with focused strategy',
    profitable: true,
  },
  {
    name: 'risk-manager',
    address: '0xa61ef8773ec2e821962306ca87d4b57e39ff0abd',
    category: 'Highest Volume',
    description: 'High-volume trader with active portfolio',
    profitable: true,
  },
  
  // Row 2: Edge Cases & Learning Examples
  {
    name: 'gmanas',
    address: '0xe90bec87d9ef430f27f9dcfe72c34b76967d5da2',
    category: 'High Activity',
    description: 'Very active trader across multiple markets',
    profitable: true,
  },
  {
    name: 'kch123',
    address: '0x6a72f61820b26b1fe4d956e17b6dc2a1ea3033ee',
    category: 'Drawdown Example',
    description: 'Large unrealized losses - risk management case study',
    profitable: false,
  },
  {
    name: 'ImJustKen',
    address: '0x9d84ce0306f8551e02efef1680475fc0f1dc1344',
    category: 'Balanced Trader',
    description: 'Mix of wins and losses with moderate volume',
    profitable: true,
  },
];
