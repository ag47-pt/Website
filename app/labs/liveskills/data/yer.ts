/**
 * LiveSkills #001 — YER · AI Engineer (Lisbon)
 * =============================================
 * Camada de CONFIGURAÇÃO. Contém apenas o que é específico desta oportunidade:
 * narrativa, curadoria de evidências e matriz de requisitos.
 *
 * Tudo o resto — capacidades, projetos, workflow e catálogo de evidências —
 * é importado de `./candidate.ts` e partilhado com apresentações futuras.
 *
 * Para criar `/labs/liveskills/<empresa>`: copiar este ficheiro, trocar target,
 * narrativa e requirementMatches, e registar em `../lib/registry.ts`.
 */

import {
  AI_TOOLS,
  AUDIT_DATE,
  CANDIDATE,
  CAPABILITY_CATALOG,
  CAPABILITY_GROUPS,
  CAPABILITY_MAP,
  ENGINEERING_WORKFLOW,
  EVIDENCE_CATALOG,
  PROJECT_CATALOG,
} from './candidate';
import type { LiveSkillPresentation, ProjectCase, RequirementMatch } from '../types';

/** Curadoria: ordem narrativa dos casos para esta candidatura. */
const YER_PROJECT_ORDER = ['agmenu', 'evopro', 'youlearn', 'alt-radar'];

const YER_PROJECTS: ProjectCase[] = YER_PROJECT_ORDER.map(
  (id) => PROJECT_CATALOG.find((project) => project.id === id)!,
).filter(Boolean);

/**
 * Requisitos parafraseados a partir do briefing da função.
 * NÃO copiar o anúncio. NÃO inventar percentagens de aderência.
 */
const YER_REQUIREMENTS: RequirementMatch[] = [
  {
    id: 'req.fullstack',
    requirement: 'Strong software engineering foundations across the full stack',
    capability:
      'Building and maintaining production applications end to end — public surface, back office, API layer, database rules and the authorization that ties them together.',
    evidenceIds: ['ev.agmenu.scale', 'ev.agmenu.authz', 'ev.ag47.site'],
    projectIds: ['agmenu'],
  },
  {
    id: 'req.llm',
    requirement: 'Hands-on work with LLMs in real applications',
    capability:
      'Six LLM endpoints shipped inside a live product, each constraining the model with a JSON response schema, keeping the key server-side and failing closed when the model is unavailable.',
    evidenceIds: ['ev.agmenu.llm', 'ev.evopro.gateway'],
    projectIds: ['agmenu', 'evopro'],
  },
  {
    id: 'req.agents',
    requirement: 'AI agents, orchestration and automation',
    capability:
      'A working agentic kernel: role-bounded agents, a state machine driving the loop, schema validation on every model response, execution budgets and an event ledger — with cycles recorded against a real host project.',
    evidenceIds: ['ev.evopro.architecture', 'ev.evopro.gateway', 'ev.evopro.hostrun'],
    projectIds: ['evopro'],
  },
  {
    id: 'req.backend',
    requirement: 'Backend services, APIs and integrations',
    capability:
      'Stripe billing with webhooks, InvoiceXpress issuing, Google Reserve booking across 12 endpoints, Google Business OAuth, plus a separate Python API with migrations and concurrency tests.',
    evidenceIds: ['ev.agmenu.payments', 'ev.agmenu.integrations', 'ev.altradar.stack'],
    projectIds: ['agmenu', 'alt-radar'],
  },
  {
    id: 'req.prototyping',
    requirement: 'Turning ideas into working products quickly',
    capability:
      'AG47 Labs is the prototyping surface and the ecosystem is where surviving experiments move. This page was built through that same pipeline as a new Labs mini-app.',
    evidenceIds: ['ev.ag47.liveskills', 'ev.ag47.site'],
    projectIds: ['youlearn'],
  },
  {
    id: 'req.data',
    requirement: 'Working with data, schemas and validation',
    capability:
      'Zod-validated domain models, JSON Schema contracts between agents, Firestore security rules and Alembic migrations — validation placed at the boundary rather than inside components.',
    evidenceIds: ['ev.youlearn.schema', 'ev.evopro.gateway', 'ev.altradar.stack'],
    projectIds: ['youlearn', 'evopro', 'alt-radar'],
  },
  {
    id: 'req.delivery',
    requirement: 'Testing, deployment and production ownership',
    capability:
      'Contract tests on the boundaries that fail silently, Playwright and Vitest and pytest where each fits, GitHub Actions gating merges, and deployment through Vercel or Cloud Run.',
    evidenceIds: ['ev.agmenu.testing', 'ev.altradar.ci', 'ev.agmenu.delivery', 'ev.youlearn.tests'],
    projectIds: ['agmenu', 'alt-radar'],
  },
  {
    id: 'req.experimentation',
    requirement: 'Experimentation mindset and independent judgement',
    capability:
      'Experiments are run against real repositories with explicit evidence levels, and results that do not hold up are labelled rather than promoted.',
    evidenceIds: ['ev.evopro.published', 'ev.workflow.guardrail'],
    projectIds: ['evopro'],
    caveat:
      'Where a capability is conceptual rather than operational — autonomous agent fleets, for example — it is labelled that way on this page.',
  },
  {
    id: 'req.ml',
    requirement: 'Machine learning research and model training',
    capability:
      'Not the strength being offered. The work here is application-layer AI engineering: integrating, constraining, validating and shipping models — not training or fine-tuning them.',
    evidenceIds: ['ev.agmenu.llm', 'ev.evopro.adapters'],
    projectIds: [],
    caveat:
      'Stated explicitly so the fit can be assessed accurately. If the role is weighted towards ML research, this is the gap.',
  },
];

/* ================================================================== *
 * Presentation
 * ================================================================== */

export const YER_PRESENTATION: LiveSkillPresentation = {
  id: 'liveskill.yer.ai-engineer',
  slug: 'yer',
  index: '#001',
  type: 'job_application',
  status: 'active',
  visibility: 'public',

  target: {
    organization: 'YER',
    role: 'AI Engineer',
    location: 'Lisbon',
    briefSource: 'Role brief supplied by the candidate',
    briefNeedsConfirmation: true,
  },
  objective:
    'Give an engineer at YER enough verifiable evidence, in one page, to decide whether a technical conversation is worth starting.',
  audience: 'Engineering manager, technical recruiter or hiring engineer at YER',

  hero: {
    salutation: 'Hi YER.',
    headline: "I didn't want to just send you a CV.",
    subheadline: 'So I built this instead.',
    body:
      "I'm a Full-Stack Software Engineer working with LLM-driven development, AI agents and rapid product engineering. This page was created specifically for my application to your AI Engineer position in Lisbon — and every claim on it links back to code I can show you.",
    primaryCta: { label: 'See how I engineer', href: '#workflow' },
    secondaryCta: { label: 'Selected work', href: '#work' },
  },

  narrative: [
    'I build software end to end and use AI as an engineering multiplier — not as a replacement for understanding the system.',
    'The work is hands-on full-stack product development: reading existing codebases, structuring systems, building frontend and backend capabilities, integrating services that carry money, and shipping to production.',
    'Over time I moved LLMs and coding agents into that workflow. The interesting part was never generating code — it was designing the checks around generation: schema validation, role boundaries, execution budgets and audit trails.',
  ],

  sections: {
    capabilities: {
      eyebrow: 'What I build',
      title: 'Capabilities, each tied to something that exists',
      description:
        'Every capability below links to evidence read directly from a repository on the audit date. Expand one to see the artefacts behind it.',
    },
    workflow: {
      eyebrow: 'How I engineer',
      title: 'The loop I actually run',
      description:
        'Steps marked with an agent badge are where AI participates. The unmarked ones are deliberately not delegated.',
      principle: "I don't delegate understanding to AI. I use AI to increase engineering throughput.",
    },
    projects: {
      eyebrow: 'Selected engineering work',
      title: 'Four systems, four different problems',
      description:
        'Problem, what was built, how it is structured, and what each one demonstrates. Stack lists are extracted from the repositories, not from memory.',
    },
    requirements: {
      eyebrow: 'Your requirements → my evidence',
      title: 'Where the fit is — and where it is not',
      description:
        'Requirements are paraphrased from the role brief, not copied. The last row is a stated gap rather than a match.',
    },
    capabilityMap: {
      eyebrow: 'Technical capability map',
      title: 'Technologies, grouped by where they were used',
      description:
        'No percentages. Each group names the projects where these technologies were observed during the audit.',
    },
    aiNative: {
      eyebrow: 'AI-native engineering',
      title: 'How AI sits inside the workflow',
      description:
        'These are engineering instruments with declared roles, not a list of tools I have opened.',
      principle: 'AI is part of my engineering workflow, not a substitute for understanding the system.',
    },
    meta: {
      eyebrow: 'About this page',
      title: 'This application is also a small product',
      description:
        'LiveSkills is the engine behind this page — a new mini-app inside AG47 Labs, built for this application and designed to be reused.',
    },
  },

  capabilityGroups: CAPABILITY_GROUPS,
  capabilities: CAPABILITY_CATALOG,
  workflow: ENGINEERING_WORKFLOW,
  projects: YER_PROJECTS,
  requirementMatches: YER_REQUIREMENTS,
  capabilityMap: CAPABILITY_MAP,
  aiNativeTools: AI_TOOLS,

  metaProof: [
    {
      label: 'Presentation engine, not a landing page',
      detail:
        'A typed presentation model, a shared evidence catalog and a dynamic route. A second company costs one data file — not a second page.',
    },
    {
      label: 'Evidence graph',
      detail:
        'Capabilities, projects and requirement matches all reference the same evidence catalog by id, so nothing can be claimed twice from different sources.',
    },
    {
      label: 'Explicit confidence levels',
      detail:
        'Every claim carries VERIFIED, DOCUMENTED or REPORTED. Anything unverified is either labelled or absent.',
    },
    {
      label: 'Built inside an existing system',
      detail:
        'Added to the AG47 codebase under its Labs layout, design system and conventions — no parallel app, no framework swap, no existing route touched.',
    },
    {
      label: 'Accessible and responsive',
      detail:
        'Semantic landmarks, keyboard-operable disclosures, visible focus states, and motion that respects prefers-reduced-motion.',
    },
    {
      label: 'Honest about its own gaps',
      detail:
        'The role requirements below still need confirming against the live posting, and personal details are marked pending rather than invented.',
    },
  ],

  cta: {
    eyebrow: 'Next step',
    title: 'This wasn’t a template.',
    body:
      'I built this page because I saw your AI Engineer position and think the way I work lines up with the kind of engineering you are building. If that reads right, the fastest next step is a technical conversation — I am happy to walk through any of the systems above, including the parts that are still rough.',
    actions: [
      { label: `Email ${CANDIDATE.contactEmail}`, href: `mailto:${CANDIDATE.contactEmail}`, external: true },
      { label: 'AG47 ecosystem', href: '/labs' },
      { label: 'Source of this site', href: CANDIDATE.publicRepository, external: true },
    ],
    disclosures: [
      'This page was written with AI assistance, as is every other system described on it. The evidence, the audit and the architectural decisions are mine.',
      'The AG Menu and Evolution Protocol repositories are private, so those links point to the running product and its documentation rather than to source. Source access can be arranged for a technical conversation.',
      'Role requirements are paraphrased from the brief I was given and have not been confirmed against the live posting.',
    ],
  },

  evidence: EVIDENCE_CATALOG,

  metadata: {
    title: 'AI Engineer application for YER — LiveSkills #001 | Agência 47',
    description:
      'A purpose-built application for YER’s AI Engineer position in Lisbon: full-stack product engineering, LLM features in production and agentic system design, with every claim tied to audited evidence.',
    keywords: [
      'AI Engineer',
      'YER',
      'Lisbon',
      'LLM-driven development',
      'agentic systems',
      'full-stack engineer',
      'Next.js',
      'TypeScript',
      'Python',
      'Agência 47',
      'LiveSkills',
    ],
    updatedAt: AUDIT_DATE,
  },
};
