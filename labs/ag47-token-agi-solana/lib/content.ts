/**
 * Single source of truth for every piece of copy and data rendered on the page.
 * Sections import from here so wording and numbers are changed in one place.
 */

export const site = {
  name: "AG Intelligence Token",
  ticker: "AGI",
  organism: "AG47 Cognitive Organism",
  chain: "Solana",
  tagline: "The infrastructure layer for decentralized intelligence.",
  docsUrl: "#whitepaper",
  appUrl: "#get-started",
} as const;

export const nav = [
  { label: "Problem", href: "#problem" },
  { label: "Protocol", href: "#solution" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Token", href: "#utility" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
] as const;

export const hero = {
  eyebrow: "AG47 · Cognitive Organism",
  title: "The infrastructure layer for *decentralized intelligence*",
  subtitle:
    "AGI is the metering and settlement asset of the AG47 Cognitive Organism — a network of specialized AI agents that ingest raw data, cross-verify each other, and return structured intelligence. Not a store of value. A unit of work.",
  primaryCta: { label: "Get started", href: "#get-started" },
  secondaryCta: { label: "Read whitepaper", href: "#whitepaper" },
  chips: [
    "SPL token on Solana",
    "Fixed supply, no mint authority",
    "Fees metered per unit of compute",
  ],
} as const;

/** Live-looking counters. Values come from the devnet environment and are illustrative. */
export const metrics = [
  {
    id: "analyses",
    label: "Analyses processed",
    value: 1_284_930,
    suffix: "",
    decimals: 0,
    drift: 3,
    caption: "Cumulative agent runs since devnet genesis",
    series: [12, 18, 22, 19, 28, 34, 31, 44, 52, 49, 63, 71],
  },
  {
    id: "agents",
    label: "Active agents",
    value: 312,
    suffix: "",
    decimals: 0,
    drift: 0,
    caption: "Staked nodes answering routing requests",
    series: [40, 44, 43, 51, 58, 62, 60, 71, 78, 82, 88, 94],
  },
  {
    id: "consensus",
    label: "Consensus rate",
    value: 94.2,
    suffix: "%",
    decimals: 1,
    drift: 0,
    caption: "Outputs confirmed by independent verifier agents",
    series: [78, 80, 83, 82, 86, 88, 87, 90, 91, 93, 93, 94],
  },
  {
    id: "latency",
    label: "Median resolution",
    value: 1.9,
    suffix: "s",
    decimals: 1,
    drift: 0,
    caption: "Request accepted → verified result returned",
    series: [64, 60, 58, 55, 51, 48, 44, 40, 36, 31, 27, 24],
  },
] as const;

export const problems = [
  {
    id: "volume",
    title: "Data volume outgrew human attention",
    body: "Markets, sensors, filings and social streams emit more signal per hour than any team can read in a week. The bottleneck stopped being access and became interpretation.",
    stat: "402 ZB",
    statLabel: "Data generated per year, of which a fraction is ever analysed",
  },
  {
    id: "structure",
    title: "Raw data is not intelligence",
    body: "Dashboards report what happened. They do not weigh conflicting sources, assign confidence, or explain why a conclusion should be trusted. Structure is the missing layer.",
    stat: "~80%",
    statLabel: "Of enterprise data is unstructured and never enters a decision",
  },
  {
    id: "centralized",
    title: "Intelligence is centralized and opaque",
    body: "A handful of providers own the models, the weights and the logs. You rent an answer without provenance, without the right to audit it, and without recourse when it is wrong.",
    stat: "5",
    statLabel: "Vendors control the majority of frontier inference capacity",
  },
  {
    id: "decisions",
    title: "Decisions are made on partial evidence",
    body: "When analysis is expensive, it gets skipped. Capital is allocated, risk is accepted and products are shipped on intuition that nobody ever scored.",
    stat: "Unpriced",
    statLabel: "The cost of an unverified conclusion is paid downstream",
  },
] as const;

export const solution = {
  eyebrow: "The protocol",
  title: "A cognitive organism, not a chatbot",
  lead: "AG47 coordinates specialized agents the way an organism coordinates organs: each one has a narrow job, none of them is trusted alone, and the value of the system comes from how their outputs are reconciled.",
  layers: [
    {
      id: "perception",
      name: "Perception",
      role: "Ingestion agents",
      body: "Normalize on-chain events, market data, documents and APIs into a typed event stream with provenance attached to every field.",
    },
    {
      id: "reasoning",
      name: "Reasoning",
      role: "Analyst agents",
      body: "Domain-scoped models score, correlate and forecast. Each output carries the inputs it used and a calibrated confidence value.",
    },
    {
      id: "verification",
      name: "Verification",
      role: "Verifier agents",
      body: "Independent agents re-derive conclusions from the same evidence. Disagreement is surfaced, not averaged away.",
    },
    {
      id: "settlement",
      name: "Settlement",
      role: "Protocol layer",
      body: "AGI meters the compute consumed, pays contributors by measured usefulness, and burns the protocol share of every fee.",
    },
  ],
  fuel: {
    title: "The token is the metering unit",
    body: "Every request debits AGI proportional to the compute and verification it consumed. Every accepted contribution credits AGI proportional to how much it improved the result. There is no path through the network that does not touch the token — which is what makes demand a function of usage rather than sentiment.",
  },
} as const;

export const flowSteps = [
  {
    id: "request",
    index: "01",
    title: "A request enters the network",
    body: "A user or an automated system submits a question with a budget ceiling and a required confidence threshold. The request is signed and posted to the routing layer.",
    detail: "Signed intent · budget ceiling · confidence floor",
  },
  {
    id: "route",
    index: "02",
    title: "The router assembles a team",
    body: "Agents are selected by historical accuracy in the relevant domain, current stake and available capacity. Nobody bids for work they have not proven they can do.",
    detail: "Reputation-weighted selection · stake as collateral",
  },
  {
    id: "process",
    index: "03",
    title: "Agents process in parallel",
    body: "Perception agents assemble the evidence set, analyst agents produce candidate conclusions, and each output is emitted with its inputs and a confidence score.",
    detail: "Parallel execution · provenance attached per field",
  },
  {
    id: "verify",
    index: "04",
    title: "Verifiers challenge the result",
    body: "A separate set of agents re-derives the conclusion. Agreement raises the confidence attached to the answer; disagreement is returned to the user rather than hidden.",
    detail: "Independent re-derivation · dissent is a first-class output",
  },
  {
    id: "settle",
    index: "05",
    title: "The result settles on-chain",
    body: "The verified output is delivered, the fee is debited in AGI, contributors are paid by measured contribution, and the protocol share is burned.",
    detail: "Fee debited · contributors paid · protocol share burned",
  },
] as const;

export const proofOfIntelligence = {
  title: "Proof of Intelligence",
  lead: "Reward is a function of measured usefulness, not of capital committed or hashes computed.",
  body: "Every agent output is scored against the verified final result and against what the answer would have been without it. An agent that adds nothing earns nothing, regardless of how much it staked. An agent that is confidently wrong is slashed against its own collateral. Reputation is earned per domain and decays if it is not maintained.",
  properties: [
    { label: "Measured", body: "Contribution is the marginal delta an agent added to the verified output." },
    { label: "Adversarial", body: "Verifiers are paid to disagree when the evidence supports disagreement." },
    { label: "Collateralized", body: "Stake is slashable, so confident errors carry a direct cost." },
    { label: "Domain-scoped", body: "Accuracy in one domain does not grant authority in another." },
  ],
} as const;

export const utilities = [
  {
    id: "access",
    icon: "key",
    title: "Access to premium agents",
    body: "Specialized agents — risk scoring, on-chain forensics, document extraction — are gated by AGI balance or subscription burn.",
  },
  {
    id: "execution",
    icon: "cpu",
    title: "Advanced analysis execution",
    body: "Deep multi-agent runs with higher verification depth cost proportionally more AGI than a single-pass query.",
  },
  {
    id: "forecasts",
    icon: "line-chart",
    title: "Purchasing forecasts",
    body: "Standing forecast streams are priced per delivery, with a refund path when realised accuracy falls under the published threshold.",
  },
  {
    id: "compute",
    icon: "server",
    title: "Payment for processing",
    body: "Compute is metered per unit of work. Node operators are settled in AGI for the capacity they actually served.",
  },
  {
    id: "governance",
    icon: "scale",
    title: "Governance",
    body: "Staked AGI votes on emission curves, verification parameters, treasury allocation and which agent classes enter the registry.",
  },
  {
    id: "rewards",
    icon: "award",
    title: "Contribution rewards",
    body: "Data providers, model operators and verifiers earn from the emission pool in proportion to scored, accepted contribution.",
  },
] as const;

export const tokenomics = {
  supply: "1,000,000,000",
  supplyNote: "Fixed at genesis. Mint authority revoked — supply can fall through burn, never rise.",
  standard: "SPL · Solana",
  decimals: "9",
  allocation: [
    {
      id: "rewards",
      label: "Network rewards",
      percent: 34,
      color: "var(--agi-violet)",
      note: "Proof of Intelligence emissions, released over 8 years on a decaying curve.",
    },
    {
      id: "ecosystem",
      label: "Ecosystem & grants",
      percent: 18,
      color: "var(--agi-indigo)",
      note: "Agent development, data partnerships, audits and integrations.",
    },
    {
      id: "treasury",
      label: "Protocol treasury",
      percent: 15,
      color: "var(--agi-cyan)",
      note: "Governed on-chain. Spending requires a passed proposal.",
    },
    {
      id: "team",
      label: "Core contributors",
      percent: 15,
      color: "var(--agi-blue)",
      note: "48-month vesting, 12-month cliff, enforced by on-chain schedule.",
    },
    {
      id: "backers",
      label: "Early backers",
      percent: 10,
      color: "var(--agi-plum)",
      note: "24-month vesting, 12-month cliff. No unlocked allocation at listing.",
    },
    {
      id: "liquidity",
      label: "Liquidity provisioning",
      percent: 8,
      color: "var(--agi-slate)",
      note: "Protocol-owned liquidity across venues, locked and publicly verifiable.",
    },
  ],
  mechanisms: [
    {
      id: "burn",
      title: "Fee burn",
      body: "30% of every request fee is burned at settlement. Burn scales with usage, so supply pressure tracks real demand for analysis rather than a fixed schedule.",
      metric: "30%",
      metricLabel: "of every fee, burned",
    },
    {
      id: "staking",
      title: "Staking as collateral",
      body: "Agents must post AGI to enter the routing pool. Stake is slashable on verified error, which prices the right to be trusted instead of granting it.",
      metric: "Slashable",
      metricLabel: "collateral per active agent",
    },
    {
      id: "required",
      title: "Mandatory in-protocol use",
      body: "Compute metering, verification depth and agent registry entries are denominated in AGI. There is no fiat or alternative-asset path around the meter.",
      metric: "100%",
      metricLabel: "of network work metered in AGI",
    },
  ],
} as const;

export const comparison = {
  rows: [
    {
      capability: "Value tied to measurable usage",
      support: { agi: true, speculative: false, centralized: true, tools: false },
    },
    {
      capability: "Verifiable provenance on every output",
      support: { agi: true, speculative: false, centralized: false, tools: false },
    },
    {
      capability: "Independent verification of results",
      support: { agi: true, speculative: false, centralized: false, tools: false },
    },
    {
      capability: "Contributors paid for usefulness",
      support: { agi: true, speculative: false, centralized: false, tools: false },
    },
    {
      capability: "Open participation without gatekeeping",
      support: { agi: true, speculative: true, centralized: false, tools: true },
    },
    {
      capability: "Supply reduced by real demand",
      support: { agi: true, speculative: false, centralized: false, tools: false },
    },
    {
      capability: "Auditable governance over parameters",
      support: { agi: true, speculative: false, centralized: false, tools: false },
    },
  ],
  columns: [
    { id: "agi", label: "AGI", sub: "Metered infrastructure" },
    { id: "speculative", label: "Speculative tokens", sub: "Narrative-priced" },
    { id: "centralized", label: "Centralized AI", sub: "Rented inference" },
    { id: "tools", label: "Isolated tools", sub: "Point solutions" },
  ],
  closing:
    "AGI is not competing on narrative. It is infrastructure with a meter attached, an economy that pays for accuracy, and governance over the parameters that decide both.",
} as const;

export const roadmap = [
  {
    id: "phase-1",
    phase: "Phase 1",
    title: "Cognitive organism MVP",
    status: "In progress",
    state: "active",
    items: [
      "Agent runtime with typed perception → reasoning → verification pipeline",
      "Deterministic, versioned scoring with reproducible outputs",
      "Devnet settlement contract and fee metering",
      "Public methodology for how confidence is calculated",
    ],
  },
  {
    id: "phase-2",
    phase: "Phase 2",
    title: "Real data integration",
    status: "Next",
    state: "next",
    items: [
      "Production market, on-chain and document ingestion providers",
      "Reputation ledger with domain-scoped accuracy history",
      "Third-party agent registry and staking with slashing live",
      "Independent security review of settlement and staking contracts",
    ],
  },
  {
    id: "phase-3",
    phase: "Phase 3",
    title: "Automation and execution",
    status: "Planned",
    state: "planned",
    items: [
      "Standing analysis subscriptions with accuracy-linked refunds",
      "Programmable triggers that fire on verified conclusions",
      "Agent-to-agent contracting inside the network",
      "Governance activation over emissions and verification depth",
    ],
  },
  {
    id: "phase-4",
    phase: "Phase 4",
    title: "Multi-chain expansion",
    status: "Planned",
    state: "planned",
    items: [
      "Settlement adapters beyond Solana with a canonical supply anchor",
      "Cross-domain agent marketplaces",
      "Enterprise deployment with private evidence sets",
      "Full treasury and parameter control handed to on-chain governance",
    ],
  },
] as const;

export const faqs = [
  {
    q: "Is AGI an investment product?",
    a: "No. AGI is a utility asset used to meter compute, collateralize agents and settle contributions inside the AG47 network. Nothing on this page is investment advice or an offer to sell a security. If you are looking for price appreciation as the primary use case, this is the wrong protocol.",
  },
  {
    q: "What stops the network from rewarding confident nonsense?",
    a: "Reward is scored against the verified final output, and verification is performed by agents that did not produce the answer. An agent that is confidently wrong loses stake. Because reputation is domain-scoped and decays without activity, a past record cannot be spent indefinitely.",
  },
  {
    q: "Why does this need a blockchain at all?",
    a: "Three properties are load-bearing: settlement that neither party controls, a stake that can be slashed by rule rather than by a company, and an auditable record of which evidence produced which conclusion. A centralized ledger would work technically and fail on exactly the trust assumption the protocol exists to remove.",
  },
  {
    q: "How is the fee for a request calculated?",
    a: "By metered work, not by a flat rate: the number of agents engaged, the compute consumed, and the verification depth requested. A single-pass query costs a fraction of a deep multi-agent run. Users set a budget ceiling up front, and the request will not exceed it.",
  },
  {
    q: "What happens to the token if usage is low?",
    a: "Burn slows, emissions continue on their schedule, and net supply grows. This is intentional and disclosed: the model is only deflationary when the network is actually used. We would rather publish that relationship than obscure it behind a fixed burn.",
  },
  {
    q: "Who can run an agent?",
    a: "Anyone who posts the required stake and passes registry admission, which is a governance parameter rather than a private decision. Agents compete on scored accuracy in their domain — there is no whitelist that grants routing priority independent of performance.",
  },
  {
    q: "How do you handle disagreement between agents?",
    a: "It is returned to the user. When verifiers cannot converge, the response carries the competing conclusions and the evidence behind each, and the confidence value reflects that spread. Averaging conflicting analysis into one number destroys the information that mattered most.",
  },
  {
    q: "What is live today?",
    a: "The agent runtime, the scoring pipeline and devnet settlement. Staking with slashing, the third-party registry and governance are Phase 2 and Phase 3 respectively. Metrics displayed on this page come from the devnet environment and are illustrative of the pipeline, not of mainnet volume.",
  },
] as const;

export const finalCta = {
  title: "Build on metered intelligence",
  body: "Read the protocol specification, run a request against the devnet, or apply to operate an agent. The network is early and the parameters are still being argued about in public — which is the point.",
  actions: [
    { label: "Read whitepaper", href: "#whitepaper", variant: "primary" as const },
    { label: "Devnet documentation", href: "#docs", variant: "ghost" as const },
    { label: "Apply to run an agent", href: "#agents", variant: "ghost" as const },
  ],
} as const;

export const disclosure =
  "AGI is a utility token used to meter and settle work inside the AG47 Cognitive Organism. It is not an investment product, and nothing on this page constitutes financial advice or an offer to sell a security. Network metrics shown are drawn from the devnet environment and are illustrative of pipeline behaviour, not mainnet volume.";
