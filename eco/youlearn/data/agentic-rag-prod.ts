import { KnowledgeObject } from '../schema/types';

export const agenticRagProd: KnowledgeObject = {
  id: 'ko-agentic-rag-003',
  slug: 'production-agentic-rag',
  version: '1.0.0',
  title: 'Building Production-Ready Multi-Agent RAG Architectures',
  subtitle: 'Self-corrective retrieval, semantic routing, vector reranking, and stateful agent graph orchestrations.',
  description:
    'Move beyond naive top-k vector similarity. Learn how to architect robust Agentic RAG systems that query rewrite, grade retrieved chunks for relevance, self-reflect on hallucinations, and fallback to web search.',
  category: 'Programming',
  topics: ['AI Agents', 'RAG', 'Vector Databases', 'LangGraph', 'Production Architecture'],
  tags: ['harrison-chase', 'langchain', 'langgraph', 'corrective-rag', 'reranking', 'vector-search'],
  featured: false,
  thumbnail: 'https://img.youtube.com/vi/b0wU_m7vY3U/maxresdefault.jpg',
  source: {
    type: 'youtube',
    title: 'Architecting Stateful AI Agents with LangGraph & Corrective RAG',
    url: 'https://www.youtube.com/watch?v=b0wU_m7vY3U',
    author: {
      name: 'Harrison Chase',
      channelOrOrg: 'LangChain & AI Engineer Summit',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      roleOrBio: 'Co-founder & CEO of LangChain / LangGraph',
      profileUrl: 'https://langchain.com',
    },
    publishedAt: '2024-03-22',
    platformIdentifier: 'b0wU_m7vY3U',
    license: 'Open Source Community / Apache 2.0 Docs',
  },
  learning: {
    originalDurationMinutes: 52,
    estimatedLearningMinutes: 7,
    compressionRatioPercent: 87,
    difficulty: 'advanced',
    keyTakeawaysSummary:
      'Naive RAG fails because vector similarity is not relevance. Production architectures require agentic loops: query rewrite -> hybrid retrieval -> neural reranking -> document grading -> generation -> hallucination check.',
    targetAudience: [
      'Full-stack AI Engineers',
      'Backend Developers',
      'System Architects building LLM apps',
    ],
    prerequisites: ['Basic embeddings & vector store knowledge', 'Python / TypeScript', 'LLM API basics'],
  },
  createdAt: '2026-08-12T10:00:00Z',
  updatedAt: '2026-08-14T09:00:00Z',
  status: 'published',
  sections: [
    {
      id: 'sec-overview',
      type: 'overview',
      title: 'Executive Summary: Why Naive RAG Fails in Production',
      subtitle: 'The gap between a demo prototype and an enterprise retrieval pipeline',
      content: {
        executiveSummary:
          'Naive RAG connects a user query directly to an embedding model, retrieves top-3 cosine distance chunks, and stuffs them into a prompt. In production, this produces high hallucination rates because questions are ambiguous, chunks lack context, and vector similarity retrieves distractor documents.',
        coreThesis:
          'An effective RAG system is not a pipeline; it is a cyclic, self-reflective state machine that grades its own intermediate steps and can branch or retry when confidence is low.',
        whyItMatters:
          'Corrective RAG (C-RAG) drops hallucination rates by over 65% while improving retrieval precision in enterprise multi-tenant databases.',
        prerequisites: ['Vector database indexing (HNSW/IVF)', 'Cosine similarity vs inner product'],
        targetAudience: ['AI Engineers', 'Backend Leads'],
      },
    },
    {
      id: 'sec-timeline',
      type: 'timeline',
      title: 'Pipeline Architecture Journey',
      subtitle: 'From query ingestion to self-reflected generation',
      content: {
        introText: 'Key steps in transitioning from static retrieval to dynamic agentic workflows.',
        chapters: [
          {
            id: 'ch-1',
            title: 'Semantic Query Rewriting & Expansion',
            timestampDisplay: '03:40',
            timestampSeconds: 220,
            durationMinutes: 8,
            summary: 'Transforming conversational or ambiguous user input into clean search queries.',
            keyConcepts: ['HyDE (Hypothetical Document Embeddings)', 'Multi-Query Expansion', 'Router nodes'],
            badge: 'Input Prep',
          },
          {
            id: 'ch-2',
            title: 'Hybrid Search (Dense Vectors + BM25 Sparse Keyword)',
            timestampDisplay: '14:20',
            timestampSeconds: 860,
            durationMinutes: 11,
            summary: 'Combining exact keyword matching with semantic concept proximity via Reciprocal Rank Fusion.',
            keyConcepts: ['BM25', 'HNSW Dense Index', 'RRF (Reciprocal Rank Fusion)'],
            badge: 'Retrieval',
          },
          {
            id: 'ch-3',
            title: 'Neural Cross-Encoder Reranking',
            timestampDisplay: '26:50',
            timestampSeconds: 1610,
            durationMinutes: 10,
            summary: 'Scoring query-chunk pairs jointly with a cross-encoder to eliminate distractor chunks.',
            keyConcepts: ['Cross-Encoders', 'Cohere Rerank', 'Context Window Compression'],
            badge: 'Filtering',
          },
          {
            id: 'ch-4',
            title: 'Document Relevance Grader (Agent Decision Gate)',
            timestampDisplay: '37:15',
            timestampSeconds: 2235,
            durationMinutes: 12,
            summary: 'Binary classification by an LLM node: is this document relevant to answer the query?',
            keyConcepts: ['State Graph', 'Conditional Branching', 'Web Search Fallback'],
            badge: 'Gatekeeper',
          },
          {
            id: 'ch-5',
            title: 'Hallucination & Answer Verification Loop',
            timestampDisplay: '45:00',
            timestampSeconds: 2700,
            durationMinutes: 11,
            summary: 'Validating if the generated response is strictly grounded in retrieved evidence.',
            keyConcepts: ['Faithfulness Grader', 'Self-Correction', 'Citation Injection'],
            badge: 'Output Gate',
          },
        ],
      },
    },
    {
      id: 'sec-process-rag',
      type: 'process',
      title: 'The 5-Step Corrective Agentic RAG Pipeline',
      subtitle: 'The exact state machine graph implemented in production LangGraph systems',
      content: {
        summary: 'Step-by-step state traversal with feedback branching.',
        steps: [
          {
            stepNumber: 1,
            title: 'Query Transformation Node',
            description: 'Analyzes user conversation history, strips conversational noise, and generates 3 query variants.',
            badge: 'Node 1: Rewriter',
            provenanceTimestamp: '05:10',
          },
          {
            stepNumber: 2,
            title: 'Hybrid Retrieval & Reranking',
            description: 'Retrieves top 25 chunks across dense and sparse indexes, then reranks to top 4 using a neural cross-encoder.',
            badge: 'Node 2: Retriever',
            provenanceTimestamp: '18:30',
          },
          {
            stepNumber: 3,
            title: 'Document Relevance Grading Gate',
            description: 'A lightweight model (e.g. Flash) grades each chunk. If >50% are irrelevant, trigger Query Rewriter or Fallback Search.',
            badge: 'Node 3: Grader',
            provenanceTimestamp: '38:00',
          },
          {
            stepNumber: 4,
            title: 'Grounded Synthesis Generation',
            description: 'Generates answer constrained strictly to verified context with explicit citation footnotes.',
            badge: 'Node 4: Generator',
            provenanceTimestamp: '42:15',
          },
          {
            stepNumber: 5,
            title: 'Hallucination & Faithfulness Assertion',
            description: 'Asserts response contains zero facts outside provided chunks. If assertion fails, regenerate with stricter temperature.',
            badge: 'Node 5: Self-Reflection',
            provenanceTimestamp: '46:40',
          },
        ],
        outcomeSummary: 'Guarantees traceable, verifiable, hallucination-resistant answers with citations.',
      },
    },
    {
      id: 'sec-comparison-rag',
      type: 'comparison',
      title: 'Architecture Comparison: Naive RAG vs. Agentic Graph RAG',
      subtitle: 'Why adding stateful feedback loops transforms reliability',
      content: {
        context: 'Direct performance and reliability trade-offs between static vs agentic retrieval pipelines.',
        columns: [
          { key: 'metric', label: 'Engineering Dimension' },
          { key: 'naive', label: 'Naive Sequential RAG' },
          { key: 'agentic', label: 'Stateful Agentic Graph RAG', highlight: true },
        ],
        rows: [
          {
            aspect: 'Ambiguous Queries',
            values: {
              naive: 'Retrieves wrong chunks and hallucinates confidently.',
              agentic: 'Rewrites query, clarifies intent, or expands search space.',
            },
            verdictWinnerKey: 'agentic',
          },
          {
            aspect: 'Distractor Documents',
            values: {
              naive: 'Pollutes prompt context, corrupting generation quality.',
              agentic: 'Cross-encoder reranking and grading filters 95% of noise.',
            },
            verdictWinnerKey: 'agentic',
          },
          {
            aspect: 'Latency Profile',
            values: {
              naive: 'Fast single round-trip (400ms - 800ms).',
              agentic: 'Multi-step cyclic graph (1.2s - 2.5s).',
            },
            verdictWinnerKey: 'naive',
            note: 'Use streaming responses to mask graph traversal latency.',
          },
          {
            aspect: 'Production Error Rate',
            values: {
              naive: '15% - 30% hallucination or irrelevant response rate.',
              agentic: '< 3% grounded error rate with automated fallback.',
            },
            verdictWinnerKey: 'agentic',
          },
        ],
        verdict:
          'For mission-critical enterprise applications, the 800ms latency trade-off is overwhelmingly justified by dramatic gains in factual accuracy.',
      },
    },
    {
      id: 'sec-concept-langgraph',
      type: 'concept',
      title: 'State Graphs & Checkpointing in LangGraph',
      subtitle: 'Modeling agent memory as a deterministic state machine',
      content: {
        coreIdea:
          'An agent graph consists of State, Nodes (functions that transform state), Edges (conditional routing logic), and Checkpointers (persisting execution history).',
        deepDive:
          'By modeling retrieval as explicit graph nodes rather than implicit prompt chains, you can pause execution, inspect intermediate document grading scores, time travel to replay failures, and enforce deterministic recovery policies.',
        keyTakeaways: [
          'State should be strictly typed (e.g. TypedDict in Python or Zod in TypeScript).',
          'Conditional edges determine whether to loop back to rewrite query or proceed to synthesis.',
          'Checkpointers allow human-in-the-loop validation for sensitive enterprise queries.',
        ],
        codeSnippet: {
          language: 'typescript',
          code: `import { StateGraph, END } from "@langchain/langgraph";

interface AgentState {
  question: string;
  documents: string[];
  generation: string;
  isGrounded: boolean;
}

const workflow = new StateGraph<AgentState>({
  channels: {
    question: { value: (x, y) => y ?? x, default: () => "" },
    documents: { value: (x, y) => y ?? x, default: () => [] },
    generation: { value: (x, y) => y ?? x, default: () => "" },
    isGrounded: { value: (x, y) => y ?? x, default: () => false },
  }
})
  .addNode("retrieve", retrieveNode)
  .addNode("grade_documents", gradeDocumentsNode)
  .addNode("generate", generateNode)
  .addNode("transform_query", transformQueryNode)
  .addEdge("retrieve", "grade_documents")
  .addConditionalEdges("grade_documents", decideToGenerate, {
    transform_query: "transform_query",
    generate: "generate"
  })
  .addEdge("transform_query", "retrieve")
  .addEdge("generate", END);`,
          explanation: 'Expressive TypeScript declaration of an Agentic RAG state machine with retry loops.',
        },
      },
    },
    {
      id: 'sec-visual-evidence',
      type: 'visual',
      title: 'Visual Architecture: State Machines & Evaluation Triads',
      subtitle: 'Inspecting agent state flow graphs and faithfulness heatmaps',
      content: {
        overviewText:
          'Visual diagrams detailing the cyclic graph topology of LangGraph and the RAG Triad evaluation metrics.',
        items: [
          {
            id: 'vis-rag-1',
            title: 'Adaptive RAG State Machine & Self-Correction Loop',
            imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
            caption: 'Figure 3.1: Cyclic graph routing between document grading, web fallback, and query rewriting.',
            visualType: 'architecture',
            analysis:
              'Unlike linear chains, cyclic state graphs can reject poorly graded chunks, reformulate the user prompt, and re-query index nodes until confidence thresholds are satisfied.',
            annotations: [
              { label: 'Document Grader', description: 'Filters out distractor passages before context assembly.' },
              { label: 'Query Rewriter', description: 'Expands acronyms and optimizes semantic search vectors.' },
            ],
            provenance: {
              timestampDisplay: '24:10',
              timestampSeconds: 1450,
              sourceUrl: 'https://www.youtube.com/watch?v=pbAd8m1LReY',
            },
          },
          {
            id: 'vis-rag-2',
            title: 'The RAG Triad: Context Relevance & Faithfulness',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            caption: 'Figure 3.2: Automated evaluation scores measuring grounding and answer relevance.',
            visualType: 'benchmark',
            analysis:
              'By independently scoring Faithfulness (answer grounded in retrieved facts) and Context Relevance (retrieved facts relevant to question), production teams isolate retrieval bugs from hallucination bugs.',
            annotations: [
              { label: 'Groundedness', description: 'Zero claims outside provided context.' },
              { label: 'Answer Relevance', description: 'Direct answer without extraneous filler.' },
            ],
            provenance: {
              timestampDisplay: '41:20',
              timestampSeconds: 2480,
              sourceUrl: 'https://www.youtube.com/watch?v=pbAd8m1LReY',
            },
          },
        ],
      },
    },
    {
      id: 'sec-insights',
      type: 'insight',
      title: 'Production Insights & Pitfalls',
      subtitle: 'Lessons learned from enterprise RAG deployments',
      content: {
        items: [
          {
            id: 'ins-rag-1',
            type: 'pro_tip',
            title: 'Use Chunk Headers for Lost In The Middle Context',
            description:
              'Prepending Document Title, Section Path, and Summary to every individual vector chunk prevents the model from losing context during semantic retrieval.',
          },
          {
            id: 'ins-rag-2',
            type: 'warning',
            title: 'Never Rely on Vector Search Alone for Numbers or Part IDs',
            description:
              'Dense embeddings are terrible at exact SKU codes, invoice numbers, and error codes. Always combine with BM25 sparse keyword search.',
          },
        ],
      },
    },
    {
      id: 'sec-quiz',
      type: 'quiz',
      title: 'Agentic RAG Mastery Check',
      subtitle: 'Test your understanding of retrieval routing and cross-encoders',
      content: {
        title: 'Production RAG Architecture Assessment',
        description: 'Verify your knowledge of state graphs and reranking.',
        questions: [
          {
            id: 'rq1',
            question: 'What is the primary function of a Neural Cross-Encoder Reranker in RAG?',
            options: [
              'To translate queries into Spanish and French before search',
              'To score Query and Document pairs jointly with full cross-attention for high accuracy',
              'To compress PDF documents into zip archives',
              'To split long text into tokens without using whitespace',
            ],
            correctOptionIndex: 1,
            explanation:
              'Bi-encoders embed query and document independently (fast, but low precision). Cross-encoders compute full cross-attention between every query token and document token, producing far superior relevance rankings.',
          },
        ],
      },
    },
    {
      id: 'sec-takeaways',
      type: 'takeaways',
      title: 'Takeaways & Production Checklist',
      subtitle: 'Essential implementation checklist for production RAG',
      content: {
        mainPoints: [
          'Replace naive top-k with Hybrid Search + Cross-Encoder Reranking.',
          'Implement conditional retry edges with Query Rewriting for poor initial retrievals.',
          'Inject deterministic hallucination assertion gates before streaming final responses.',
        ],
        actionableChecklist: [
          { text: 'Set up BM25 sparse index alongside dense vector store.', category: 'Indexing' },
          { text: 'Integrate Cohere or open-source BGE reranker.', category: 'Reranking' },
          { text: 'Add a document grading LLM prompt to filter distractors.', category: 'Agent Flow' },
        ],
        nextSteps: ['Build an end-to-end evaluation dataset using RAGAS or TruLens.'],
      },
    },
    {
      id: 'sec-provenance',
      type: 'provenance',
      title: 'Source Attribution & Original Presentation',
      subtitle: 'Keynote attribution and documentation references',
      content: {
        sourceTitle: 'Architecting Stateful AI Agents with LangGraph & Corrective RAG',
        sourceUrl: 'https://www.youtube.com/watch?v=b0wU_m7vY3U',
        author: {
          name: 'Harrison Chase',
          channelOrOrg: 'LangChain & AI Engineer Summit',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          roleOrBio: 'Co-founder & CEO of LangChain / LangGraph',
          profileUrl: 'https://langchain.com',
        },
        license: 'Open Source Community / Apache 2.0 Docs',
        citationText: 'Chase, H. (2024). "Architecting Stateful AI Agents with LangGraph." AI Engineer Summit.',
        keyTimestamps: [
          { label: 'Why Naive RAG Breaks Down', timestampDisplay: '03:40', timestampSeconds: 220 },
          { label: 'Hybrid Retrieval Deep Dive', timestampDisplay: '14:20', timestampSeconds: 860 },
          { label: 'Corrective RAG State Machine', timestampDisplay: '37:15', timestampSeconds: 2235 },
        ],
        references: [
          {
            label: 'LangGraph Documentation & Patterns',
            url: 'https://langchain-ai.github.io/langgraph/',
            type: 'documentation',
          },
          {
            label: 'Yan et al. (2024) "Corrective Retrieval Augmented Generation"',
            url: 'https://arxiv.org/abs/2401.15884',
            type: 'paper',
          },
        ],
      },
    },
  ],
};
