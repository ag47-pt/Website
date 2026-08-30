/**
 * LiveSkills — Candidate Evidence Catalog
 * ========================================
 * Camada PARTILHADA do motor. Não pertence a nenhuma apresentação específica.
 *
 * Toda a evidência aqui declarada foi observada por auditoria direta dos
 * repositórios em 2026-08-30, exceto onde o nível é explicitamente
 * DOCUMENTED ou REPORTED.
 *
 * Apresentações futuras (`/labs/liveskills/<empresa>`) devem SELECIONAR deste
 * catálogo em vez de duplicar conhecimento. Ver `data/yer.ts` como referência.
 *
 * Regra: nunca promover uma evidência de nível sem nova auditoria.
 */

import type {
  AiTool,
  Capability,
  CapabilityGroup,
  CapabilityMapEntry,
  Evidence,
  ProjectCase,
  WorkflowStep,
} from '../types';

/** Data única de auditoria — mantém a proveniência consistente. */
export const AUDIT_DATE = '2026-08-30';

/* ================================================================== *
 * Identidade
 * ================================================================== */

export const CANDIDATE = {
  /** TODO: Candidate confirmation required — nome profissional a publicar. */
  displayName: 'AG47 · Software Engineer',
  positioning: 'Full-Stack Software Engineer',
  discipline: 'LLM-Driven Development · Agentic Systems · Product Engineering',
  location: 'Portugal',
  /** Apenas contactos já publicados no ecossistema AG47. */
  contactEmail: 'dev@ag47.pt',
  organization: 'Agência 47',
  organizationUrl: 'https://ag47.pt',
  publicRepository: 'https://github.com/ag47-pt/Website',
  /**
   * Informação que depende de confirmação humana antes de publicação.
   * Renderizada apenas na secção de transparência, nunca como claim.
   * Em inglês: é copy pública da apresentação, não comentário de código.
   */
  pendingConfirmation: [
    'Full professional name and the direct contact to publish',
    'Public profiles (LinkedIn / personal GitHub) to link',
    'Education, certifications and formal years of experience',
    'Availability, hybrid arrangement and work status in Portugal',
  ],
} as const;

/* ================================================================== *
 * Evidence Catalog
 * ================================================================== */

export const EVIDENCE_CATALOG: Evidence[] = [
  /* ---------------------------- AG Menu ---------------------------- */
  {
    id: 'ev.agmenu.scale',
    claim:
      'AG Menu is a production restaurant platform on Next.js 16 and React 19: 34 page routes, 41 API route handlers and 62 components across roughly 69,000 lines of TypeScript.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'ag47-pt/agmenu', kind: 'repository', detail: '263 commits on main' },
      { label: 'package.json', kind: 'config', detail: 'next 16.2.4 · react 19 · typescript 5 · tailwind 4' },
      { label: 'app/ · components/ · lib/ · hooks/', kind: 'code', detail: '68,997 lines counted' },
    ],
  },
  {
    id: 'ev.agmenu.authz',
    claim:
      'Access control is role-based and resolved server-side across four roles — ag47_admin, merchant, staff, customer — and enforced again at the database layer.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'lib/authz.ts', kind: 'code', detail: 'normalizeUserRole · resolveEffectiveRole · superadmin resolution' },
      { label: 'firestore.rules', kind: 'config', detail: '308 lines of security rules' },
      { label: 'app/api/auth/me · app/api/auth/profile/sync', kind: 'api', detail: 'server-side identity endpoints' },
    ],
  },
  {
    id: 'ev.agmenu.payments',
    claim:
      'Billing runs on Stripe checkout sessions with a dedicated webhook handler, and invoice issuing is delegated to InvoiceXpress with a SAF-T export path.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'app/api/merchant/billing/checkout/route.ts', kind: 'api' },
      { label: 'app/api/webhooks/stripe/route.ts', kind: 'api' },
      { label: 'lib/server/invoicing.ts', kind: 'code', detail: 'InvoiceXpress integration' },
      { label: 'app/api/merchant/invoices/saft-export/route.ts', kind: 'api' },
    ],
  },
  {
    id: 'ev.agmenu.integrations',
    claim:
      'Google Reserve v2 is implemented as 12 dedicated booking endpoints — availability, create, update, cancel, list, feeds, health check and diagnostics — alongside a three-step Google Business OAuth flow.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'app/api/google-reserve/v2/*', kind: 'api', detail: '12 route handlers' },
      { label: 'app/api/merchant/google-business/oauth/{start,callback,status}', kind: 'api' },
      { label: 'scripts/google-reserve-contract-tests.mjs', kind: 'test', detail: 'contract tests for the integration' },
    ],
  },
  {
    id: 'ev.agmenu.llm',
    claim:
      'Six LLM endpoints ship inside the product on @google/genai (Gemini): menu copy generation and translation, customer chat, ads, analytics, room planning and waitlist. Each constrains the model with a JSON responseSchema and fails closed with HTTP 503 when no key is configured.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      {
        label: 'app/api/agmenu/menu-ai/route.ts',
        kind: 'api',
        detail: 'responseMimeType application/json + responseSchema with required fields',
      },
      { label: 'app/api/merchant/{ads,analytics,room,waitlist}-ai/route.ts', kind: 'api' },
      { label: 'app/api/agmenu/chat/route.ts · app/api/chat/route.ts', kind: 'api' },
    ],
  },
  {
    id: 'ev.agmenu.testing',
    claim:
      'Quality is enforced by 37 operational scripts: contract tests for auth profile sync, Firestore rules, public projection, Stripe billing, page layout and theme family, plus browser smoke tests and reconciliation integration tests.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'scripts/', kind: 'test', detail: '37 test and operations scripts' },
      { label: 'package.json', kind: 'config', detail: '20 test:* npm scripts · playwright dependency' },
    ],
  },
  {
    id: 'ev.agmenu.delivery',
    claim:
      'The platform is live in production at agmenu.pt and ships with a containerised deployment path and public-page SEO: JSON-LD structured data, PWA manifest and push subscriptions.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'agmenu.pt', kind: 'product', url: 'https://agmenu.pt', detail: 'HTTP 200 checked on audit date' },
      { label: 'Dockerfile · scripts/deploy-cloudrun.ps1 · scripts/deploy-vercel-safe.ps1', kind: 'deploy' },
      { label: 'app/[slug]/page.tsx · app/restaurantes/*', kind: 'route', detail: 'application/ld+json emitted' },
    ],
  },

  /* ---------------------------- EvoPro ----------------------------- */
  {
    id: 'ev.evopro.package',
    claim:
      'The Evolution Protocol is a real Python package — ag47-evolution-protocol v0.3.1, MIT, Python ≥3.10 — with 85 source modules totalling about 18,000 lines and two console entry points.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'pyproject.toml', kind: 'config', detail: 'scripts: evolution · second-brain' },
      { label: 'src/evolution_kernel/', kind: 'code', detail: '85 modules · 18,036 lines' },
    ],
  },
  {
    id: 'ev.evopro.architecture',
    claim:
      'The kernel separates governance from cognition: 23 core modules (state machine, evolution graph, event ledger, decision trace, guardrails, scope policy, continuity, baseline), 8 engines (run loop, judge, gauntlet, policy, impact, benchmark, sprint) and 30 agent modules.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'src/evolution_kernel/core/', kind: 'code', detail: '23 modules' },
      { label: 'src/evolution_kernel/engines/', kind: 'code', detail: '8 modules' },
      { label: 'src/evolution_kernel/agents/', kind: 'code', detail: '30 modules incl. observer, planner, executor, validator' },
    ],
  },
  {
    id: 'ev.evopro.gateway',
    claim:
      'Every model call passes through a CognitiveGateway that parses the response as JSON, validates it against a schema, hashes input and output with SHA-256 for audit, and denies role-boundary violations — an analyst agent that proposes a solution is rejected, not merged.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      {
        label: 'src/evolution_kernel/cognitive_gateway/gateway.py',
        kind: 'code',
        detail: 'jsonschema validate · sha256 input/output hash · ROLE_BOUNDARY_VIOLATION deny',
      },
      { label: 'bundled_protocol/schemas/', kind: 'schema', detail: '24 JSON schemas' },
    ],
  },
  {
    id: 'ev.evopro.adapters',
    claim:
      'Model access sits behind an adapter interface with base, Gemini and mock implementations, so the protocol stays provider-agnostic and the whole loop is testable without a live model.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'cognitive_gateway/adapters/{base,gemini,mock}.py', kind: 'code' },
      { label: 'adapters/harness.py', kind: 'code', detail: 'harness abstraction' },
    ],
  },
  {
    id: 'ev.evopro.hostrun',
    claim:
      'The protocol has been executed against a real host project, not only specified: Alt-Radar carries 5 recorded evolution cycles with state transitions, timestamped event logs, agent-call counters and explicit budgets for calls, tokens and execution time.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      {
        label: 'eco/alt-radar/.evolution/cycles/*.json',
        kind: 'runtime',
        detail: '5 cycles · state machine PENDING → OBSERVING → … → COMPLETED · budget caps recorded',
      },
      { label: 'evolution.config.json', kind: 'config', detail: 'host configuration at repository root' },
    ],
  },
  {
    id: 'ev.evopro.tests',
    claim: 'The kernel is covered by 37 test modules totalling roughly 6,300 lines.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [{ label: 'tests/', kind: 'test', detail: '37 files · 6,260 lines' }],
  },
  {
    id: 'ev.evopro.published',
    claim:
      'The protocol is documented publicly on the AG47 ecosystem page, where every capability carries an explicit evidence status rather than a marketing claim.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'ag47.pt/eco/evopro', kind: 'product', url: '/eco/evopro' },
      { label: 'data/evopro.ts', kind: 'code', detail: 'capabilities typed as VALIDATED / IMPLEMENTED / OBSERVED / PARTIAL / UNKNOWN' },
    ],
    caveat: 'The protocol source repository is private. Everything above was read directly from the working tree.',
  },

  /* --------------------------- YouLearn ---------------------------- */
  {
    id: 'ev.youlearn.schema',
    claim:
      'The learning domain is modelled as Zod schemas before any UI exists: typed sources, provenance, learning metadata and eleven discriminated section types.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'eco/youlearn/schema/types.ts', kind: 'schema' },
      { label: 'eco/youlearn/schema/validation.ts', kind: 'schema', detail: 'Zod validation layer' },
    ],
  },
  {
    id: 'ev.youlearn.tests',
    claim:
      'The verification suite was executed during this audit and reported 49 assertions passed and 0 failed, covering schema validation, library derivation, filtering, timestamp maths and the Markdown exporter.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      {
        label: 'eco/youlearn/tests/test-runner.ts',
        kind: 'test',
        detail: 'run on audit date — SUMMARY: 49 PASSED, 0 FAILED',
      },
    ],
  },
  {
    id: 'ev.youlearn.renderer',
    claim:
      'Pages are assembled by a section registry that maps schema section types to React components, so the validated content shape drives the UI instead of the UI dictating the content.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'app/eco/youlearn/learn/[slug]/renderer/SectionRegistry.tsx', kind: 'component' },
      { label: 'app/eco/youlearn/learn/[slug]/sections/', kind: 'component', detail: '11 section components' },
    ],
  },
  {
    id: 'ev.youlearn.provenance',
    claim:
      'Provenance is first-class: timestamp parsing and formatting utilities build deep links back to the exact second of the source, and a Markdown/Obsidian exporter carries attribution out of the product.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'eco/youlearn/lib/provenance.ts', kind: 'code' },
      { label: 'eco/youlearn/lib/exportMarkdown.ts', kind: 'code', detail: 'YAML frontmatter + callouts' },
    ],
    caveat: 'Automatic ingestion was still a manual step at the audited stage; the ingest script exists but the pipeline is not autonomous.',
  },

  /* --------------------------- Alt-Radar --------------------------- */
  {
    id: 'ev.altradar.stack',
    claim:
      'Alt-Radar is a two-application monorepo: a Python API with Alembic migrations and 27 pytest modules, and a Next.js web app with Vitest unit tests and Playwright end-to-end tests.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'eco/alt-radar/apps/api/', kind: 'code', detail: 'alembic · pyproject · 27 test modules' },
      { label: 'eco/alt-radar/apps/web/', kind: 'code', detail: 'vitest.config.mts · playwright.config.ts · e2e/' },
    ],
  },
  {
    id: 'ev.altradar.ci',
    claim:
      'Delivery is automated: a path-filtered GitHub Actions verify workflow and a Cloud Run deployment pipeline, with the stack containerised through Dockerfile and docker-compose.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: '.github/workflows/ag47-radar.yml', kind: 'ci', detail: 'concurrency group · path filters · verify job' },
      { label: '.github/workflows/deploy-alt-radar-cloudrun.yml', kind: 'ci' },
      { label: 'eco/alt-radar/docker-compose.yml', kind: 'deploy' },
    ],
  },

  /* --------------------------- AG47 site --------------------------- */
  {
    id: 'ev.ag47.site',
    claim:
      'The site rendering this page is itself the largest shared codebase: a Next.js 16 / React 19 / Tailwind v4 application with 46 page routes, 12 API routes and 271 TypeScript files totalling about 52,000 lines — and its repository is public.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'ag47-pt/Website', kind: 'repository', url: 'https://github.com/ag47-pt/Website', detail: 'public repository' },
      { label: 'app/', kind: 'route', detail: '46 page.tsx · 12 route.ts' },
    ],
  },
  {
    id: 'ev.ag47.liveskills',
    claim:
      'LiveSkills — the engine rendering this page — is a typed presentation runtime: a shared evidence catalog, a per-opportunity configuration file and a dynamic route, so a second presentation costs one data file, not a second page.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'app/labs/liveskills/types.ts', kind: 'schema', detail: 'presentation + evidence graph model' },
      { label: 'app/labs/liveskills/data/candidate.ts', kind: 'code', detail: 'shared evidence catalog' },
      { label: 'app/labs/liveskills/[slug]/page.tsx', kind: 'route', detail: 'generateStaticParams over the registry' },
    ],
  },

  /* ------------------- Workflow / AI-native ------------------------ */
  {
    id: 'ev.workflow.instrumented',
    claim:
      'The repositories are instrumented for agent-assisted engineering rather than ad-hoc prompting: AGENTS.md operating rules sit at the root of AG47, AG Menu and Alt-Radar, next to per-harness configuration directories and an evolution host config.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [
      { label: 'AGENTS.md', kind: 'doc', detail: 'present in AG47, AG Menu and Alt-Radar' },
      { label: '.claude · .agent · .cursor · .gemini', kind: 'config', detail: 'harness configuration checked into the repo' },
      { label: 'evolution.config.json', kind: 'config' },
    ],
  },
  {
    id: 'ev.workflow.guardrail',
    claim:
      'The operating rule that agents run under is deliberately conservative: change only what was requested, never remove behaviour that was not the target of the request, and keep the blast radius isolated.',
    confidence: 'VERIFIED',
    observedOn: AUDIT_DATE,
    sources: [{ label: 'AGENTS.md', kind: 'doc', detail: 'P0 modification rule at repository root' }],
  },
  {
    id: 'ev.workflow.harnesses',
    claim:
      'Codex, Claude Code and Antigravity are the coding harnesses used day to day, selected per task rather than exclusively.',
    confidence: 'REPORTED',
    sources: [{ label: 'Candidate evidence dossier', kind: 'doc', detail: 'self-reported working practice' }],
    caveat:
      'Harness configuration is present in the repositories, but usage volume and split between tools are self-reported and were not measured.',
  },
];

/** Índice O(1) por id, usado por todo o motor. */
export const EVIDENCE_BY_ID: Record<string, Evidence> = Object.fromEntries(
  EVIDENCE_CATALOG.map((item) => [item.id, item]),
);

/* ================================================================== *
 * Project Catalog
 * ================================================================== */

export const PROJECT_CATALOG: ProjectCase[] = [
  {
    id: 'agmenu',
    name: 'AG Menu',
    kicker: 'Full-stack restaurant platform, live in production',
    status: 'live',
    confidence: 'VERIFIED',
    problem:
      'Restaurants need a public digital presence, a way to take reservations and orders, and a back office to run all of it — usually stitched together from four disconnected tools, none of which talk to their invoicing or to Google.',
    built: [
      'Public restaurant pages, city directories and digital menus with structured data',
      'Merchant back office: menu, orders, reservations, waitlist, CRM, team, invoicing, analytics',
      'Authentication and four-role authorization enforced on the server and again in database rules',
      'Reservations exposed to Google Reserve, plus Google Business OAuth for the merchant',
      'Stripe billing with a webhook handler and InvoiceXpress issuing with SAF-T export',
      'Six in-product LLM endpoints for menu copy, chat, ads, analytics, room planning and waitlist',
    ],
    architecture: [
      'Next.js App Router — 34 page routes, 41 API route handlers',
      'Firebase client + Admin SDK; Firestore as the system of record',
      'Authorization resolved server-side, then re-enforced in 308 lines of security rules',
      'Third-party surface isolated behind dedicated route handlers (Stripe, Google, InvoiceXpress)',
      'Contract tests pinned to the boundaries that break silently',
    ],
    stack: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind v4',
      'Firebase / Firestore',
      'firebase-admin',
      'Stripe',
      'Google APIs',
      'Gemini (@google/genai)',
      'Playwright',
      'Vercel',
      'Cloud Run',
    ],
    demonstrates: [
      'Working inside a large codebase without rewriting it',
      'Multi-role product modelling, not just CRUD screens',
      'Third-party integration where failure is visible to a paying customer',
      'Shipping LLM features under real product constraints',
    ],
    metrics: [
      { label: 'Lines of TypeScript', value: '~69,000', source: 'app/ components/ lib/ hooks/ line count' },
      { label: 'API route handlers', value: '41', source: 'app/api/**/route.ts' },
      { label: 'Commits on main', value: '263', source: 'git rev-list --count HEAD' },
      { label: 'Test & ops scripts', value: '37', source: 'scripts/' },
    ],
    evidenceIds: [
      'ev.agmenu.scale',
      'ev.agmenu.authz',
      'ev.agmenu.payments',
      'ev.agmenu.integrations',
      'ev.agmenu.llm',
      'ev.agmenu.testing',
      'ev.agmenu.delivery',
    ],
    links: [
      // Link oficial do produto. O interno fica explicitamente marcado como
      // entrada no ecossistema para não competir com o site oficial.
      { label: 'agmenu.pt', href: 'https://agmenu.pt', external: true },
      { label: 'AG47 ecosystem entry', href: '/menuag' },
    ],
    caveat: 'The application repository is private, so the links point to the running product rather than to source.',
  },

  {
    id: 'evopro',
    name: 'Evolution Protocol (EvoPro)',
    kicker: 'A governance kernel for AI-assisted software engineering',
    status: 'beta',
    confidence: 'VERIFIED',
    problem:
      'Coding agents are fast and forgetful. Left ungoverned they lose architectural context between sessions, produce plausible output nobody validated, and quietly widen the scope of a change. The failure mode is not bad code — it is unaccountable code.',
    built: [
      'A state machine that moves a change through observe → plan → execute → validate with recorded transitions',
      'A CognitiveGateway that schema-validates every model response and hashes input and output for audit',
      'Role boundaries enforced in code: an analyst agent that proposes a solution is denied, not merged',
      'Guardrails and budgets — agent calls, tokens and execution time are capped per cycle',
      'An event ledger and decision trace so a change can be reconstructed after the fact',
      'A provider adapter layer (base / Gemini / mock) keeping the kernel model-agnostic and testable offline',
    ],
    architecture: [
      '23 core modules: state machine, evolution graph, event ledger, decision trace, guardrails, scope policy, continuity, baseline',
      '8 engines: run loop, judge, gauntlet, policy, impact, benchmark, sprint',
      '30 agent modules: observer, planner, executor, validator and specialised analysts',
      '24 bundled JSON schemas constraining agent and artifact contracts',
      'Two CLI entry points — evolution and second-brain',
    ],
    stack: ['Python ≥3.10', 'jsonschema', 'pytest', 'CLI (setuptools entry points)', 'MIT licence'],
    demonstrates: [
      'Designing agentic systems as engineering, not prompting',
      'Treating LLM output as untrusted input that must pass validation',
      'Auditability and human governance as first-class requirements',
      'Reasoning about autonomy limits before granting autonomy',
    ],
    metrics: [
      { label: 'Kernel modules', value: '85', source: 'src/evolution_kernel/**/*.py' },
      { label: 'Lines of Python', value: '~18,000', source: 'source line count' },
      { label: 'Test modules', value: '37', source: 'tests/' },
      { label: 'Recorded host cycles', value: '5', source: 'alt-radar .evolution/cycles/*.json' },
    ],
    evidenceIds: [
      'ev.evopro.package',
      'ev.evopro.architecture',
      'ev.evopro.gateway',
      'ev.evopro.adapters',
      'ev.evopro.hostrun',
      'ev.evopro.tests',
      'ev.evopro.published',
    ],
    links: [{ label: 'Protocol documentation', href: '/eco/evopro' }],
    caveat:
      'This is a working kernel with recorded runs against a real host project — not a fleet running unattended in production. The distinction is deliberate.',
  },

  {
    id: 'youlearn',
    name: 'YouLearn',
    kicker: 'Schema-driven knowledge transformation',
    status: 'live',
    confidence: 'VERIFIED',
    problem:
      'Turning a long recorded source into something learnable means imposing structure on it. If that structure lives in components, every new content type becomes a new page. If it lives in a schema, content and UI can evolve independently.',
    built: [
      'A Zod-validated domain: sources, authors, provenance, learning metadata and eleven section types',
      'A section registry that maps validated section types to React components',
      'Provenance utilities that deep-link back to the exact second of the source',
      'Library derivation, search, filtering, stats and compression ratios computed from the data',
      'A Markdown/Obsidian exporter with YAML frontmatter and attribution',
    ],
    architecture: [
      'Schema first: schema/types.ts and schema/validation.ts define the contract',
      'Content shape drives rendering through SectionRegistry, not the other way round',
      'Pure library and provenance functions kept outside components so they are testable',
      'A standalone verification runner covering validation, derivation and formatting',
    ],
    stack: ['Next.js', 'React 19', 'TypeScript', 'Zod', 'Tailwind'],
    demonstrates: [
      'Schema-driven development and validation at the boundary',
      'Provenance and attribution treated as product requirements',
      'Modular UI architecture that survives new content types',
      'Writing the tests that actually run',
    ],
    metrics: [
      { label: 'Assertions passing', value: '49 / 49', source: 'test runner executed during this audit' },
      { label: 'Section types', value: '11', source: 'schema section discriminants + section components' },
    ],
    evidenceIds: ['ev.youlearn.schema', 'ev.youlearn.tests', 'ev.youlearn.renderer', 'ev.youlearn.provenance'],
    links: [{ label: 'Live on AG47', href: '/eco/youlearn' }],
    caveat: 'Automatic ingestion was still manual at the audited stage — the pipeline exists, the autonomy does not.',
  },

  {
    id: 'alt-radar',
    name: 'Alt-Radar',
    kicker: 'Python API + Next.js web, shipped through CI',
    status: 'live',
    confidence: 'VERIFIED',
    problem:
      'A market signal product needs a real backend — scheduled ingestion, migrations, invariants that must hold under concurrency — and a frontend that never shows a number it cannot justify.',
    built: [
      'A Python API with Alembic migrations and 27 pytest modules covering ingestion, invariants, concurrency and security',
      'A Next.js web application with Vitest unit tests and Playwright end-to-end coverage',
      'A path-filtered GitHub Actions verify workflow plus a Cloud Run deployment pipeline',
      'Containerised local and deployed environments via Dockerfile and docker-compose',
    ],
    architecture: [
      'Monorepo split into apps/api and apps/web with independent toolchains',
      'Database migrations versioned with Alembic',
      'CI gates scoped by changed paths so unrelated work does not pay the cost',
      'The same repository also hosts the recorded EvoPro evolution cycles',
    ],
    stack: ['Python', 'FastAPI-style service layer', 'Alembic', 'pytest', 'Next.js', 'Vitest', 'Playwright', 'Docker', 'GitHub Actions', 'Cloud Run'],
    demonstrates: [
      'Backend engineering beyond the JavaScript ecosystem',
      'Migrations, invariants and concurrency treated seriously',
      'CI/CD as part of the product, not an afterthought',
    ],
    metrics: [
      { label: 'API test modules', value: '27', source: 'apps/api/tests/' },
      { label: 'CI workflows', value: '2', source: '.github/workflows/' },
    ],
    evidenceIds: ['ev.altradar.stack', 'ev.altradar.ci', 'ev.evopro.hostrun'],
    links: [{ label: 'Live on AG47', href: '/eco/alt-radar' }],
  },
];

export const PROJECT_BY_ID: Record<string, ProjectCase> = Object.fromEntries(
  PROJECT_CATALOG.map((project) => [project.id, project]),
);

/* ================================================================== *
 * Capabilities
 * ================================================================== */

export const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    id: 'build',
    label: 'Build',
    caption: 'Shipping applications people actually use',
    iconName: 'blocks',
  },
  {
    id: 'engineer',
    label: 'Engineer',
    caption: 'Keeping a growing system understandable',
    iconName: 'workflow',
  },
  {
    id: 'ai',
    label: 'Apply AI',
    caption: 'LLMs and agents as engineering components',
    iconName: 'bot',
  },
  {
    id: 'product',
    label: 'Own the outcome',
    caption: 'From problem statement to deployed product',
    iconName: 'target',
  },
];

export const CAPABILITY_CATALOG: Capability[] = [
  {
    id: 'cap.fullstack',
    label: 'Full-stack product development',
    summary:
      'Public experience, back office, API layer and database in the same codebase — including the boring parts: roles, permissions, invoices, error states.',
    group: 'build',
    evidenceIds: ['ev.agmenu.scale', 'ev.agmenu.authz'],
    projectIds: ['agmenu'],
  },
  {
    id: 'cap.integrations',
    label: 'Third-party integrations that carry money',
    summary:
      'Payments, invoicing, OAuth and booking protocols where a silent failure reaches a paying customer, so the boundary gets contract tests.',
    group: 'build',
    evidenceIds: ['ev.agmenu.payments', 'ev.agmenu.integrations', 'ev.agmenu.testing'],
    projectIds: ['agmenu'],
  },
  {
    id: 'cap.backend',
    label: 'Backend services and data',
    summary:
      'Python and TypeScript services, relational migrations, document-store rules, invariants that must hold under concurrency.',
    group: 'build',
    evidenceIds: ['ev.altradar.stack', 'ev.agmenu.authz'],
    projectIds: ['alt-radar', 'agmenu'],
  },
  {
    id: 'cap.architecture',
    label: 'Reading and extending existing systems',
    summary:
      'Most of the work is not greenfield. Understand the system first, change the smallest surface that solves the problem, leave the architecture intact.',
    group: 'engineer',
    evidenceIds: ['ev.workflow.guardrail', 'ev.agmenu.scale', 'ev.ag47.site'],
    projectIds: ['agmenu', 'evopro'],
  },
  {
    id: 'cap.schema',
    label: 'Schema-driven development',
    summary:
      'Define the contract before the interface. Validate at the boundary. Let the validated shape drive the rendering instead of hardcoding it.',
    group: 'engineer',
    evidenceIds: ['ev.youlearn.schema', 'ev.youlearn.renderer', 'ev.evopro.gateway'],
    projectIds: ['youlearn', 'evopro'],
  },
  {
    id: 'cap.testing',
    label: 'Testing, CI and deployment',
    summary:
      'Contract tests at integration boundaries, unit tests for pure logic, end-to-end for the paths that matter, and a pipeline that runs them.',
    group: 'engineer',
    evidenceIds: ['ev.agmenu.testing', 'ev.altradar.ci', 'ev.youlearn.tests', 'ev.agmenu.delivery'],
    projectIds: ['alt-radar', 'agmenu', 'youlearn'],
  },
  {
    id: 'cap.llm-features',
    label: 'LLM features inside real products',
    summary:
      'Schema-constrained generation, server-side key handling, graceful degradation when the model is unavailable — shipped, not demoed.',
    group: 'ai',
    evidenceIds: ['ev.agmenu.llm'],
    projectIds: ['agmenu'],
  },
  {
    id: 'cap.agentic',
    label: 'Agentic system design',
    summary:
      'Agents with declared roles and enforced boundaries, a state machine driving the loop, budgets capping autonomy, and an event log that makes a run reconstructable.',
    group: 'ai',
    evidenceIds: ['ev.evopro.architecture', 'ev.evopro.gateway', 'ev.evopro.hostrun'],
    projectIds: ['evopro'],
  },
  {
    id: 'cap.llm-validation',
    label: 'Treating model output as untrusted input',
    summary:
      'Parse, validate against a schema, hash for audit, reject on boundary violation. The interesting engineering is in what happens after generation.',
    group: 'ai',
    evidenceIds: ['ev.evopro.gateway', 'ev.evopro.adapters', 'ev.agmenu.llm'],
    projectIds: ['evopro', 'agmenu'],
  },
  {
    id: 'cap.ai-workflow',
    label: 'AI-native engineering workflow',
    summary:
      'Agent operating rules committed to the repository next to the code they govern, so the working agreement is versioned like everything else.',
    group: 'ai',
    evidenceIds: ['ev.workflow.instrumented', 'ev.workflow.guardrail', 'ev.workflow.harnesses'],
  },
  {
    id: 'cap.zero-to-one',
    label: 'Idea to deployed product',
    summary:
      'Problem framing, architecture, implementation, tests, deployment and the iteration after launch — repeatedly, across different domains.',
    group: 'product',
    evidenceIds: ['ev.agmenu.delivery', 'ev.altradar.ci', 'ev.ag47.site'],
    projectIds: ['agmenu', 'alt-radar', 'youlearn'],
  },
  {
    id: 'cap.rapid-prototyping',
    label: 'Rapid prototyping with a path to production',
    summary:
      'AG47 Labs is where experiments start; the ecosystem is where the ones that survive move. This page is an instance of that pipeline.',
    group: 'product',
    evidenceIds: ['ev.ag47.liveskills', 'ev.ag47.site'],
  },
  {
    id: 'cap.evidence',
    label: 'Evidence discipline',
    summary:
      'Separating what the code proves from what the documentation says from what someone remembers — and labelling which is which.',
    group: 'product',
    evidenceIds: ['ev.evopro.published', 'ev.ag47.liveskills'],
    projectIds: ['evopro'],
  },
];

/* ================================================================== *
 * Workflow
 * ================================================================== */

export const ENGINEERING_WORKFLOW: WorkflowStep[] = [
  {
    id: 'wf.problem',
    label: 'Problem',
    detail: 'State what actually has to be true when this is done. Not the ticket — the outcome.',
    aiAssisted: false,
  },
  {
    id: 'wf.understand',
    label: 'Understand the system',
    detail: 'Read the existing code, routes, schemas and config before proposing anything. This step is never delegated.',
    aiAssisted: false,
  },
  {
    id: 'wf.architecture',
    label: 'Architecture',
    detail: 'Decide the smallest change that solves the problem without widening the blast radius.',
    aiAssisted: false,
  },
  {
    id: 'wf.build',
    label: 'Build',
    detail: 'Implement in the editor, in the real codebase, following the conventions already there.',
    aiAssisted: true,
  },
  {
    id: 'wf.ai',
    label: 'AI-assisted execution',
    detail: 'Agents handle mechanical breadth — sweeps, scaffolds, refactors — under rules committed to the repository.',
    aiAssisted: true,
  },
  {
    id: 'wf.review',
    label: 'Review',
    detail: 'Read every diff. Generated code is a proposal, not a commit.',
    aiAssisted: false,
  },
  {
    id: 'wf.test',
    label: 'Test',
    detail: 'Contract tests at integration boundaries, unit tests for logic, end-to-end for the paths users take.',
    aiAssisted: true,
  },
  {
    id: 'wf.deploy',
    label: 'Deploy',
    detail: 'Through the pipeline, not from a laptop. Vercel or Cloud Run depending on the workload.',
    aiAssisted: false,
  },
  {
    id: 'wf.observe',
    label: 'Observe',
    detail: 'Telemetry, logs and audit trails, so the next iteration starts from data instead of opinion.',
    aiAssisted: false,
  },
  {
    id: 'wf.iterate',
    label: 'Iterate',
    detail: 'Feed what was learned back into the architecture and the agent rules.',
    aiAssisted: true,
  },
];

/* ================================================================== *
 * Technical capability map
 * ================================================================== */

export const CAPABILITY_MAP: CapabilityMapEntry[] = [
  {
    category: 'Frontend',
    items: ['Next.js (App Router)', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'PWA'],
    observedIn: 'AG Menu · AG47 · YouLearn · Alt-Radar web',
  },
  {
    category: 'Backend',
    items: ['Node.js route handlers', 'Python services', 'REST APIs', 'Webhooks', 'OAuth 2.0', 'Server-side authorization'],
    observedIn: 'AG Menu · Alt-Radar API',
  },
  {
    category: 'Data',
    items: ['Firestore', 'Security rules', 'Alembic migrations', 'Zod schemas', 'JSON Schema', 'Structured logging'],
    observedIn: 'AG Menu · Alt-Radar · YouLearn · EvoPro',
  },
  {
    category: 'AI / LLM',
    items: ['Gemini via @google/genai', 'Schema-constrained output', 'Provider adapters', 'Prompt & system-instruction design', 'Graceful degradation'],
    observedIn: 'AG Menu · EvoPro',
  },
  {
    category: 'Agentic systems',
    items: ['Role-bounded agents', 'State machines', 'Event ledgers', 'Decision traces', 'Execution budgets', 'Human governance gates'],
    observedIn: 'EvoPro (with recorded cycles on Alt-Radar)',
  },
  {
    category: 'Infrastructure',
    items: ['Vercel', 'Google Cloud Run', 'Docker & docker-compose', 'GitHub Actions', 'Environment & secret handling'],
    observedIn: 'AG Menu · Alt-Radar · AG47',
  },
  {
    category: 'Testing',
    items: ['Contract tests', 'Playwright', 'Vitest', 'pytest', 'Smoke & integration scripts'],
    observedIn: 'AG Menu · Alt-Radar · YouLearn',
  },
  {
    category: 'Product engineering',
    items: ['Multi-role modelling', 'SEO & JSON-LD', 'Analytics & telemetry', 'GDPR consent flows', 'Billing & invoicing'],
    observedIn: 'AG Menu · AG47',
  },
];

/* ================================================================== *
 * AI-native toolchain
 * ================================================================== */

export const AI_TOOLS: AiTool[] = [
  {
    name: 'Claude Code',
    usage: 'Repository-wide reasoning and multi-file changes, run against committed operating rules rather than ad-hoc prompts.',
    evidenceIds: ['ev.workflow.instrumented'],
  },
  {
    name: 'Codex',
    usage: 'Scoped implementation passes and mechanical refactors where the target is well specified.',
    evidenceIds: ['ev.workflow.harnesses'],
  },
  {
    name: 'Antigravity',
    usage: 'Longer autonomous passes on tasks with a clear acceptance criterion and a small blast radius.',
    evidenceIds: ['ev.workflow.harnesses'],
  },
  {
    name: 'Gemini (@google/genai)',
    usage: 'The model actually shipped in product features — always behind a JSON schema and a server-side key.',
    evidenceIds: ['ev.agmenu.llm', 'ev.evopro.adapters'],
  },
];
