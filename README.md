# Open Inference Foundation

**The inference co-op.** Wholesale AI compute through collective membership.

[openinferencefoundation.org](https://openinferencefoundation.org) | [Try Casino](https://casino.flowstack.fun) | [Arbiscan](https://arbiscan.io/address/0xD31f5765F92D7D3fF0463eeaa14C157d423aF9E1)

---

## What is this?

A nonprofit co-op that aggregates demand for AI inference, negotiates wholesale rates with LLM providers, and passes the savings to members. The more people join, the cheaper compute gets for everyone.

The marginal cost of a tax accountant, a lawyer, a financial advisor, and a data scientist working for you is approaching zero. The question is who gets access. Platforms will capture the margin. The co-op returns it to members.

**Read the full thesis:** [openinferencefoundation.org/thesis](https://openinferencefoundation.org/thesis)

---

## Two Tokens

| Token | Purpose | Supply | Contract |
|-------|---------|--------|----------|
| **INFER** | Membership, staking, governance | 1B fixed | [`0xD31f...`](https://arbiscan.io/address/0xD31f5765F92D7D3fF0463eeaa14C157d423aF9E1) |
| **AGENT** | Pay for queries, builder earnings | Governed mint | [`0xee68...`](https://arbiscan.io/address/0xee68973c3320266486F2Fcf31a0196A7FB680418) |

INFER is staked, never spent. It appreciates as supply tightens. AGENT is the operational token - buy it with USDC/USDT, spend it on queries, builders earn it.

**Staking tiers:**

| Tier | INFER | Lock | AGENT Discount | Governance |
|------|-------|------|----------------|------------|
| Member | 1,000 | 3 months | 15% | 1x |
| Pro | 10,000 | 6 months | 30% | 2x |
| Founder | 100,000 | 12 months | 50% | 5x |

---

## The Agent Network

Every site built on [Casino](https://casino.flowstack.fun) comes with its own agent. That agent is a node in the network, owned by the builder. Users interact with your node, you earn 60% of every query. Users can build their own nodes. The network grows from the edges.

```
Casino (builder platform)
    |
    v
[Fitness App] [Tax Advisor] [Legal Review]   <-- builder nodes
    |               |              |
    v               v              v
[Meal Planner] [Self-Employed] [NDA Review]   <-- edge nodes
    |               |              |
   ...             ...            ...          <-- and so on
```

**Revenue split:** 60% node owner, 30% foundation, 10% infrastructure.

---

## Your Data, Your Infrastructure

Every user gets two isolated storage layers. Both are yours. Builders cannot access either.

```
You (user)
├── MongoDB Database (u_{your_id_hash})
│   ├── tax_app__filings          ← data from Tax Prep site
│   ├── tax_app__deductions       ← data from Tax Prep site
│   ├── fitness__workouts         ← data from Fitness Tracker site
│   └── legal__contracts          ← data from Legal Review site
│
└── S3 Workspace ({tenant}/{you}/{workspace}/)
    ├── datasets/                 ← CSVs, parquet files you uploaded
    ├── visualizations/           ← charts and dashboards agents generated
    ├── reports/                  ← analysis reports
    ├── scripts/                  ← code the agents wrote
    ├── models/                   ← ML models trained on your data
    └── conversations/            ← chat history
```

**MongoDB** — every user gets their own isolated database for app data. When you use a tax prep site, your tax data goes into YOUR database, not the builder's. The builder has no credentials for it. Each site's collections are prefixed with the site ID so data from different apps never collides.

**S3 Workspaces** — every user gets isolated S3 paths for everything else. Datasets you upload, visualizations agents generate, reports, scripts, models — all scoped to your tenant, your user ID, your workspace. No other user can access your paths.

Apps are a view into your data, not a container for it. You carry your data across every site in the network.

## Privacy

PII is masked by [Microsoft Presidio](https://microsoft.github.io/presidio/) before any external LLM call. SSNs, credit cards, bank numbers - always redacted. The LLM never sees your raw data.

Wallet-first auth. No email required. Your identity is a wallet address.

**Full details:** [openinferencefoundation.org/privacy](https://openinferencefoundation.org/privacy)

---

## Community Sale

**May 23, 2026 at 10:00 AM ET**

400,000,000 INFER (40% of total supply) available for purchase.

---

## This Repo

This is the foundation's website, built on the [Flowstack SDK](https://github.com/KeonCummings/flowstack-sdk).

### Tech Stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- wagmi + viem (Arbitrum One)
- Flowstack SDK (`@flowstack/sdk`)

### Run Locally

```bash
git clone https://github.com/Open-Inference-Foundation/openinferencefoundation.org.git
cd openinferencefoundation.org
npm install --legacy-peer-deps
npm run dev
```

The site runs at `http://localhost:3001`. Wallet features require MetaMask or WalletConnect connected to Arbitrum One.

### Deploy

```bash
npm run build              # Vite production build
bash scripts/deploy-aws.sh # S3 + CloudFront deploy
```

### Environment Variables

Copy `.env.local` and configure:

```bash
VITE_FLOWSTACK_MODE=production
VITE_FLOWSTACK_JWT_SECRET=your-secret
VITE_FLOWSTACK_PASSWORD_SECRET=your-password-secret
VITE_FLOWSTACK_TENANT_ID=your-tenant-id
VITE_FLOWSTACK_BASE_URL=https://sage-api.flowstack.fun
VITE_WALLETCONNECT_PROJECT_ID=your-project-id
```

---

## Contracts (Arbitrum One)

| Contract | Address |
|----------|---------|
| INFER Token | [`0xD31f5765F92D7D3fF0463eeaa14C157d423aF9E1`](https://arbiscan.io/address/0xD31f5765F92D7D3fF0463eeaa14C157d423aF9E1) |
| AGENT Token (v2) | [`0xee68973c3320266486F2Fcf31a0196A7FB680418`](https://arbiscan.io/address/0xee68973c3320266486F2Fcf31a0196A7FB680418) |
| InferStaking | [`0x5c550E2ad896c324342Def3F45606232d06AD563`](https://arbiscan.io/address/0x5c550E2ad896c324342Def3F45606232d06AD563) |
| AgentPurchase (v2) | [`0x26cC0e078147B3D7785076b104506cF0670B1D56`](https://arbiscan.io/address/0x26cC0e078147B3D7785076b104506cF0670B1D56) |
| AgentPayment (v3) | [`0x47716c6122a8f2CC25eC2804719863ac01577dA9`](https://arbiscan.io/address/0x47716c6122a8f2CC25eC2804719863ac01577dA9) |
| SurplusDistribution | [`0xE99732CdC8e6Cf9661252cbB257016CC58d7Ee47`](https://arbiscan.io/address/0xE99732CdC8e6Cf9661252cbB257016CC58d7Ee47) |
| Gnosis Safe (2-of-3) | [`0x7D0C7734b568384Ee6B0A0FAd39259c2DBb8cbc0`](https://arbiscan.io/address/0x7D0C7734b568384Ee6B0A0FAd39259c2DBb8cbc0) |

---

## License

MIT
