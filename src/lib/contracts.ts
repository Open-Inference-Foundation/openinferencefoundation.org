export const CONTRACTS = {
  INFER: '0xD31f5765F92D7D3fF0463eeaa14C157d423aF9E1' as const,
  AGENT: '0xee68973c3320266486F2Fcf31a0196A7FB680418' as const,
  STAKING: '0x5c550E2ad896c324342Def3F45606232d06AD563' as const,
  AGENT_PURCHASE: '0x26cC0e078147B3D7785076b104506cF0670B1D56' as const,
  AGENT_PAYMENT: '0x47716c6122a8f2CC25eC2804719863ac01577dA9' as const,
  SURPLUS: '0xE99732CdC8e6Cf9661252cbB257016CC58d7Ee47' as const,
  SAFE: '0x7D0C7734b568384Ee6B0A0FAd39259c2DBb8cbc0' as const,
} as const;

export const ARBISCAN_BASE = 'https://arbiscan.io';

// Stablecoins on Arbitrum One
export const STABLECOINS = {
  USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as const,
  USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as const,
} as const;

// Community sale date: May 23, 2026 at 10:00 AM ET
export const COMMUNITY_SALE_DATE = new Date('2026-05-23T14:00:00Z'); // 10 AM ET = 14:00 UTC

// Minimal ERC20 ABI for balance/approve reads
export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// InferStaking ABI — view + write functions
export const STAKING_ABI = [
  // View functions
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getPosition',
    outputs: [
      { name: '', type: 'uint256' }, // amount
      { name: '', type: 'uint256' }, // stakedAt
      { name: '', type: 'uint256' }, // lockEnd
      { name: '', type: 'uint8' },   // tier
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getTier',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getDiscount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getGovernanceWeight',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getStakedAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getLockEnd',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'isLockExpired',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStaked',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Constants
  {
    inputs: [],
    name: 'MEMBER_THRESHOLD',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PRO_THRESHOLD',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FOUNDER_THRESHOLD',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'targetTier', type: 'uint8' },
    ],
    name: 'stake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'addStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'unstake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unstakeAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// AgentPurchase ABI — buy AGENT with USDC/USDT
export const AGENT_PURCHASE_ABI = [
  {
    inputs: [
      { name: 'buyer', type: 'address' },
      { name: 'stableAmount', type: 'uint256' },
    ],
    name: 'previewPurchase',
    outputs: [
      { name: '', type: 'uint256' }, // agentAmount
      { name: '', type: 'uint256' }, // discountBps
      { name: '', type: 'uint256' }, // effectivePrice
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'stablecoin', type: 'address' },
      { name: 'stableAmount', type: 'uint256' },
    ],
    name: 'purchase',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'basePricePerAgent',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Tier enum matching Solidity
export const TIER = {
  BASE: 0,
  MEMBER: 1,
  PRO: 2,
  FOUNDER: 3,
} as const;

export const TIER_NAMES: Record<number, string> = {
  0: 'Base',
  1: 'Member',
  2: 'Pro',
  3: 'Founder',
};

export const TIER_INFO = [
  { tier: 0, name: 'Base',    infer: 0,       lock: '—',       discount: '0%',  weight: '—'  },
  { tier: 1, name: 'Member',  infer: 1_000,   lock: '3 months', discount: '15%', weight: '1x' },
  { tier: 2, name: 'Pro',     infer: 10_000,  lock: '6 months', discount: '30%', weight: '2x' },
  { tier: 3, name: 'Founder', infer: 100_000, lock: '12 months', discount: '50%', weight: '5x' },
];
