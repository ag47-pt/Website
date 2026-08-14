# YouLearn — Visual Knowledge Library & Learning Engine

> **Part of Agência 47 Ecosystem (`AG47.pt/eco/YouLearn`)**  
> *Transforming hours of unstructured talks, masterclasses, and system architecture lectures into high-density, interactive visual learning experiences.*

---

## 🏛️ Architectural Foundations

YouLearn is designed with a strict boundary between **Content Data** and **Visual Presentation**:

```
Source (e.g. YouTube Video, Podcast, PDF)
  ↓
Knowledge Object (Declarative JSON/TypeScript Schema with Provenance)
  ↓
Learning Page Renderer (Dynamic Section Registry)
  ↓
Library Entry (Auto-derived index card with compression analytics)
  ↓
YouLearn Library Explorer (/eco/youlearn)
```

### Core Principles
1. **`DATA != PRESENTATION`**: Knowledge Objects are purely declarative data structures. No React JSX or HTML is embedded inside content manifests.
2. **`CONTENT != COMPONENT`**: Learning Pages are rendered via a compositional `SectionRegistry`.
3. **`SOURCE != LEARNING PAGE`**: Source attribution, creator credentials, and precise timestamps (`04:15`, `35:10`) are preserved for full provenance.
4. **`FUTURE AUTOMATION READY`**: The upcoming **YouLearn Skill** will ingest a YouTube URL, extract transcripts/frames, and emit a validated `KnowledgeObject` without requiring frontend changes.

---

## 📁 Repository Structure

```
eco/youlearn/
├── schema/
│   ├── types.ts              # TypeScript interfaces (Source, KnowledgeObject, Section, LibraryEntry)
│   ├── validation.ts         # Zod runtime schemas for payload validation
│   └── index.ts              # Core exports
├── lib/
│   ├── library.ts            # Index derivation, multi-field search, filters, stats
│   └── provenance.ts         # Timestamp parsing (MM:SS), URL builders, duration formatting
├── data/
│   ├── transformer-karpathy.ts # Demo 1: Technical Deep Dive ("How Transformers Work")
│   ├── systems-thinking.ts     # Demo 2: Conceptual Mental Models ("Systems Thinking")
│   ├── agentic-rag-prod.ts     # Demo 3: Process / Tutorial ("Production Agentic RAG")
│   └── index.ts              # Catalog registry & lookup helpers
├── tests/
│   └── test-runner.ts        # Automated verification test suite
└── README.md

app/eco/youlearn/
├── page.tsx                  # Server Page for /eco/youlearn
├── YouLearnLibraryClient.tsx # Client Library Explorer UI
├── components/
│   ├── YouLearnNavbar.tsx    # Header & Ecosystem navigation
│   ├── YouLearnHero.tsx      # Editorial hero, live metrics & instant search
│   ├── KnowledgeCard.tsx     # Reusable high-density knowledge card
│   ├── KnowledgeFilters.tsx  # Dynamic category pills & difficulty filters
│   └── LibraryEmptyState.tsx # Empty search state with reset actions
└── learn/
    └── [slug]/
        ├── page.tsx          # Dynamic Server Page (/eco/youlearn/learn/[slug]) with JSON-LD
        ├── LearningPageClient.tsx # Reading progress tracker & layout container
        ├── renderer/
        │   ├── LearningPageRenderer.tsx # Section stream renderer
        │   └── SectionRegistry.tsx      # Extensible component dispatcher & fallback
        └── sections/
            ├── LearningHeroSection.tsx
            ├── LearningOverviewSection.tsx
            ├── LearningTimelineSection.tsx
            ├── ConceptSection.tsx
            ├── ProcessSection.tsx
            ├── ComparisonSection.tsx
            ├── VisualEvidenceSection.tsx
            ├── InsightSection.tsx
            ├── QuizSection.tsx
            ├── TakeawaysSection.tsx
            └── SourceProvenanceSection.tsx
```

---

## 🧩 Section Registry & Extensibility

Adding a new section type to YouLearn requires only two steps:
1. Define the section type in `eco/youlearn/schema/types.ts` and `validation.ts`.
2. Register the component in `app/eco/youlearn/learn/[slug]/renderer/SectionRegistry.tsx`.

Existing built-in sections:
- `overview`: Executive summary, core thesis, why it matters, prerequisites, target audience.
- `timeline`: Chronological journey linked to timestamped source links.
- `concept`: Deep dive explanation with ASCII/visual architecture diagrams, code blocks with copy, and callouts.
- `process`: Sequential step-by-step workflow with badges and outcomes.
- `comparison`: Side-by-side matrices with highlighted winning columns and verdicts.
- `visual`: Image/frame evidence with analytical annotations.
- `insight`: Mental models, golden rules, warnings, and pro-tips.
- `quiz`: Interactive multiple-choice knowledge check with instant feedback.
- `takeaways`: Actionable checklist and synthesis cards.
- `provenance`: Academic/technical attribution, citations, license, and key timestamp directory.

---

## 🧪 Verification & Testing

Run the automated test suite:
```bash
npx tsx eco/youlearn/tests/test-runner.ts
```

Run full type check:
```bash
npx tsc --noEmit
```
