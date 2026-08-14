import { KnowledgeObject } from '../schema/types';

export const transformerKarpathy: KnowledgeObject = {
  id: 'ko-transformer-karpathy-001',
  slug: 'how-transformers-work',
  version: '1.0.0',
  title: 'How Transformers Work & Deep Architecture from Scratch',
  subtitle: 'A visual engineering guide to Self-Attention, Positional Encoding, and modern LLM architecture.',
  description:
    'Deconstruct the core architectural breakthroughs powering GPT-4, Claude, and modern generative AI. Learn how multi-head attention computes context in parallel without recurrent loops.',
  category: 'AI',
  topics: ['LLM', 'Attention Mechanism', 'Deep Learning', 'Neural Networks', 'PyTorch'],
  tags: ['karpathy', 'attention-is-all-you-need', 'gpt', 'tokenization', 'qkv-matrices'],
  featured: true,
  thumbnail: 'https://img.youtube.com/vi/kCc8FmEb1nY/maxresdefault.jpg',
  source: {
    type: 'youtube',
    title: 'Let\'s build GPT: from scratch, in code, spelled out.',
    url: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
    author: {
      name: 'Andrej Karpathy',
      channelOrOrg: 'Andrej Karpathy YouTube Channel',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      roleOrBio: 'Ex-Director of AI at Tesla, OpenAI Founding Member',
      profileUrl: 'https://karpathy.ai',
    },
    publishedAt: '2023-01-17',
    platformIdentifier: 'kCc8FmEb1nY',
    license: 'CC BY 4.0 / Educational Open Access',
  },
  learning: {
    originalDurationMinutes: 116,
    estimatedLearningMinutes: 14,
    compressionRatioPercent: 88,
    difficulty: 'intermediate',
    keyTakeawaysSummary:
      'Transformers replaced sequential recurrence with Query-Key-Value dot-product attention, allowing every token to communicate with all previous tokens simultaneously in parallel matrices.',
    targetAudience: [
      'Machine Learning Engineers',
      'Full-stack Developers entering AI',
      'Technical Architects',
      'Data Scientists',
    ],
    prerequisites: ['Basic Matrix Multiplication', 'High-level Neural Network intuitions', 'Basic Python'],
  },
  createdAt: '2026-08-10T12:00:00Z',
  updatedAt: '2026-08-14T09:00:00Z',
  status: 'published',
  sections: [
    {
      id: 'sec-overview',
      type: 'overview',
      title: 'Executive Summary & Core Thesis',
      subtitle: 'Why the Transformer revolutionized artificial intelligence',
      content: {
        executiveSummary:
          'Before 2017, sequence processing relied on Recurrent Neural Networks (RNNs) and LSTMs that processed text word-by-word sequentially, causing severe memory bottlenecks and preventing GPU parallelization. The Transformer eliminated recurrence completely, introducing Scaled Dot-Product Self-Attention where all tokens interact in parallel.',
        coreThesis:
          'Attention is a communication mechanism. It treats tokens as nodes in a fully-connected directed graph where edges are dynamically weighted by relevance (similarity between Queries and Keys).',
        whyItMatters:
          'Understanding Q, K, V matrices and residual connections gives you the exact mental model needed to debug context windows, temperature, hallucinations, and inference latency.',
        prerequisites: ['Dot product of vectors', 'Softmax activation', 'Matrix dimensions'],
        targetAudience: ['AI Engineers', 'Software Architects', 'Curious Practitioners'],
      },
    },
    {
      id: 'sec-timeline',
      type: 'timeline',
      title: 'Intellectual Journey & Timestamped Chapters',
      subtitle: 'Step-by-step deconstruction aligned with the original masterclass',
      content: {
        introText:
          'Follow the chronological derivation of the GPT architecture from raw characters to a working nanoGPT implementation.',
        chapters: [
          {
            id: 'ch-1',
            title: 'The Bottleneck of Recurrent Models (RNN/LSTM)',
            timestampDisplay: '04:15',
            timestampSeconds: 255,
            durationMinutes: 12,
            summary: 'Why $O(N)$ sequential steps prevented massive training scale and destroyed long-range context.',
            keyConcepts: ['Vanishing Gradients', 'Sequential compute dependency', 'Context degradation'],
            badge: 'Problem Space',
          },
          {
            id: 'ch-2',
            title: 'Tokenization & Positional Encodings',
            timestampDisplay: '18:40',
            timestampSeconds: 1120,
            durationMinutes: 15,
            summary: 'Injecting permutation awareness into order-agnostic permutation invariant attention layers.',
            keyConcepts: ['Learned Positional Embeddings', 'Token Vocabulary', 'Embedding Tables'],
            badge: 'Foundations',
          },
          {
            id: 'ch-3',
            title: 'Scaled Dot-Product Attention (Query, Key, Value)',
            timestampDisplay: '35:10',
            timestampSeconds: 2110,
            durationMinutes: 28,
            summary: 'The mathematical heart: Q*K^T / sqrt(d_k) masked with -inf to prevent future-peeking.',
            keyConcepts: ['Affinity Matrix', 'Causal Masking', 'Softmax normalization', 'Value weighting'],
            badge: 'Core Engine',
          },
          {
            id: 'ch-4',
            title: 'Multi-Head Attention & Subspace Projections',
            timestampDisplay: '63:20',
            timestampSeconds: 3800,
            durationMinutes: 20,
            summary: 'Allowing the model to attend to information from different representation subspaces jointly.',
            keyConcepts: ['Parallel Heads', 'Linear Projections', 'Subspace specialization'],
            badge: 'Architecture',
          },
          {
            id: 'ch-5',
            title: 'Residual Highway & Layer Normalization (Pre-LN)',
            timestampDisplay: '84:05',
            timestampSeconds: 5045,
            durationMinutes: 22,
            summary: 'Unimpeded gradient flow allowing models to scale to hundreds of layers deep.',
            keyConcepts: ['Skip connections', 'Pre-LN stability', 'Feed-forward projection'],
            badge: 'Optimization',
          },
          {
            id: 'ch-6',
            title: 'Inference & Autoregressive Sampling',
            timestampDisplay: '106:15',
            timestampSeconds: 6375,
            durationMinutes: 19,
            summary: 'Generating tokens iteratively: logit computation, temperature scaling, and top-k filtering.',
            keyConcepts: ['Temperature', 'Top-K sampling', 'KV-cache preview'],
            badge: 'Runtime',
          },
        ],
      },
    },
    {
      id: 'sec-concept-qkv',
      type: 'concept',
      title: 'Deep Concept: The Query-Key-Value Interaction Matrix',
      subtitle: 'How information is routed dynamically between tokens',
      provenance: {
        timestampDisplay: '37:45',
        timestampSeconds: 2265,
        sourceUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
        excerpt: 'Think of Query as "what I am looking for", Key as "what I contain", and Value as "what I will communicate".',
      },
      content: {
        coreIdea:
          'Every token vector $x_i$ is linearly projected into three distinct spaces: a Query $Q_i$, a Key $K_i$, and a Value $V_i$. The dot product $Q_i \\cdot K_j$ determines how much token $i$ attends to token $j$.',
        deepDive:
          'When we compute $A = \\text{softmax}(\\frac{Q K^T}{\\sqrt{d_k}})$, each row of $A$ represents a probability distribution over all preceding tokens. Multiplying $A \\times V$ produces a weighted mixture of the values, aggregating relevant context directly into the token representation without passing through intermediate nodes.',
        keyTakeaways: [
          'Queries and Keys must live in the same dimensional space $d_k$ to allow meaningful dot product similarities.',
          'The scale factor $\\sqrt{d_k}$ prevents dot products from growing excessively large, which would push softmax into flat gradient regions with vanishing gradients.',
          'Causal masking sets upper triangle entries to $-\\infty$, ensuring tokens at position $t$ only attend to positions $\\le t$.',
        ],
        diagram: {
          type: 'architecture',
          title: 'Scaled Dot-Product Attention Pipeline',
          description: 'Input vectors -> Linear projections -> Scaled Dot Product -> Softmax Mask -> Weighted Value Sum',
          asciiArt: `
  [Tokens X] ---> [ Linear Q ] -------------\\
             ---> [ Linear K ] ---> [ MatMul Q*K^T ] ---> [ Scale 1/sqrt(d) ] ---> [ Causal Mask ] ---> [ Softmax ] ---\\
             ---> [ Linear V ] ------------------------------------------------------------------------> [ MatMul ] ---> [ Output Z ]
          `,
          caption: 'Figure 1.1: Tensor flow through single-head causal self-attention.',
        },
        codeSnippet: {
          language: 'python',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class CausalSelfAttention(nn.Module):
    def __init__(self, n_embd, n_head, block_size):
        super().__init__()
        self.head_dim = n_embd // n_head
        self.qkv_proj = nn.Linear(n_embd, 3 * n_embd, bias=False)
        self.out_proj = nn.Linear(n_embd, n_embd, bias=False)
        self.register_buffer("mask", torch.tril(torch.ones(block_size, block_size)))

    def forward(self, x):
        B, T, C = x.shape
        q, k, v = self.qkv_proj(x).chunk(3, dim=-1)
        # Scaled dot-product with causal mask
        att = (q @ k.transpose(-2, -1)) * (1.0 / (self.head_dim ** 0.5))
        att = att.masked_fill(self.mask[:T, :T] == 0, float('-inf'))
        att = F.softmax(att, dim=-1)
        return self.out_proj(att @ v)`,
          explanation: 'Minimal self-contained PyTorch implementation of Causal Self-Attention in 20 lines.',
        },
        callout: {
          type: 'quote',
          text: 'Attention is fundamentally a communication mechanism: tokens vote on which other tokens have the answers they need to predict what comes next.',
          author: 'Andrej Karpathy',
        },
      },
    },
    {
      id: 'sec-comparison',
      type: 'comparison',
      title: 'Architectural Comparison: RNN / LSTM vs. Modern Transformer',
      subtitle: 'Why recurrence lost the scaling war',
      provenance: {
        timestampDisplay: '08:20',
        timestampSeconds: 500,
        sourceUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
      },
      content: {
        context:
          'Comparing sequential step-by-step state recurrence with parallelized attention across compute, memory, and long-range dependency horizons.',
        columns: [
          { key: 'aspect', label: 'Architectural Dimension' },
          { key: 'rnn', label: 'Classic RNN / LSTM' },
          { key: 'transformer', label: 'Transformer (Decoder-Only)', highlight: true },
        ],
        rows: [
          {
            aspect: 'Training Parallelization',
            values: {
              rnn: 'Sequential O(N) — Token t+1 requires state from token t.',
              transformer: 'Fully Parallel O(1) across sequence dimension during training.',
            },
            verdictWinnerKey: 'transformer',
            note: 'Enables trillion-token pre-training across GPU clusters.',
          },
          {
            aspect: 'Maximum Path Length',
            values: {
              rnn: 'O(N) steps — signals degrade across 100+ tokens.',
              transformer: 'O(1) direct connection — any token attends to any other token in one hop.',
            },
            verdictWinnerKey: 'transformer',
            note: 'Essential for maintaining coherence in 100k+ context windows.',
          },
          {
            aspect: 'Inference Complexity',
            values: {
              rnn: 'O(1) constant memory and compute per new generated token.',
              transformer: 'O(N) with KV-cache / O(N^2) without KV-cache per step.',
            },
            verdictWinnerKey: 'rnn',
            note: 'The one trade-off where RNN was cheaper at inference time.',
          },
          {
            aspect: 'Hardware Affinity (GPUs)',
            values: {
              rnn: 'Memory bandwidth bound with tiny sequential matrix-vector ops.',
              transformer: 'Compute bound with massive high-throughput Matrix-Matrix (GEMM) multiplications.',
            },
            verdictWinnerKey: 'transformer',
            note: 'Perfect match for Tensor Cores.',
          },
        ],
        verdict:
          'The Transformer sacrificed $O(1)$ inference cost to gain $O(1)$ path length and massive training parallelizability — unlocking the entire modern scaling era.',
      },
    },
    {
      id: 'sec-process',
      type: 'process',
      title: 'Step-by-Step: The Autoregressive Forward Pass',
      subtitle: 'From input character prompt to next-token probability distribution',
      content: {
        summary:
          'How raw string text moves through embeddings, transformer blocks, and unembedding head in 5 discrete stages.',
        steps: [
          {
            stepNumber: 1,
            title: 'Tokenization & Dual Embedding Lookup',
            description:
              'Raw string is mapped to discrete token IDs $[t_0, t_1, \\dots, t_T]$. Token embedding table $W_{tok}$ and position embedding table $W_{pos}$ are summed: $x = E_{tok} + E_{pos}$.',
            badge: 'Stage 1',
            substeps: [
              'Byte-Pair Encoding (BPE) splits text into subwords',
              'Vectors are projected to dimension $d_{model}$ (e.g. 768 or 4096)',
            ],
            provenanceTimestamp: '21:15',
          },
          {
            stepNumber: 2,
            title: 'Multi-Head Causal Self-Attention Block',
            description:
              'Tokens communicate. Queries, Keys, and Values are computed in parallel for $H$ heads. Masked softmax affinity matrix mixes information across the sequence.',
            badge: 'Stage 2',
            substeps: [
              'Head outputs are concatenated and linearly projected via $W_O$',
              'Output is added to input via residual connection: $x = x + \\text{Attention}(\\text{LN}(x))$',
            ],
            provenanceTimestamp: '54:30',
          },
          {
            stepNumber: 3,
            title: 'Pointwise Feed-Forward Network (MLP)',
            description:
              'Tokens think individually. Each token vector passes through an expansion layer (typically $4 \\times d_{model}$), a non-linear activation (GeLU/SwiGLU), and a projection back down.',
            badge: 'Stage 3',
            substeps: [
              'No cross-token communication occurs in this step',
              'Acts as a key-value associative memory of factual knowledge',
            ],
            provenanceTimestamp: '76:10',
          },
          {
            stepNumber: 4,
            title: 'Stack Iteration (N Layers)',
            description:
              'Steps 2 and 3 repeat through $L$ identical blocks (e.g. 12 layers in GPT-2 small, 96 layers in GPT-3). Information gradually ascends from syntax to semantics to logic.',
            badge: 'Stage 4',
            provenanceTimestamp: '88:45',
          },
          {
            stepNumber: 5,
            title: 'Final LayerNorm & Language Modeling Head',
            description:
              'Final vectors are normalized and projected via the unembedding matrix $W_{vocab}$ to produce raw logits of size $V$ (vocabulary size). Softmax with temperature generates probabilities for sampling.',
            badge: 'Stage 5',
            provenanceTimestamp: '98:20',
          },
        ],
        outcomeSummary:
          'The sampled token is appended to the context window and the loop repeats autoregressively until an End-of-Sequence (EOS) token is produced.',
      },
    },
    {
      id: 'sec-visual-evidence',
      type: 'visual',
      title: 'Visual Evidence: Attention Patterns & Residual Highway',
      subtitle: 'Inspecting what internal attention heads actually learn',
      content: {
        overviewText:
          'Empirical captures demonstrating how attention heads specialize in specific linguistic and logical roles (e.g., induction heads, syntax parsing, delimiter tracking).',
        items: [
          {
            id: 'vis-1',
            title: 'Lower Triangular Causal Mask & Attention Heatmap',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80',
            caption: 'Figure 2.1: Attention weights between tokens with strictly masked upper triangular future tokens.',
            visualType: 'diagram',
            analysis:
              'Notice the intense concentration on the first token (attention sink) and recent previous tokens (recency bias), alongside specific long-distance spikes connecting pronouns to their antecedents.',
            annotations: [
              { label: 'Attention Sink', description: 'Position 0 absorbs unused attention mass.' },
              { label: 'Induction Head', description: 'Tracks recurring bigrams across distant context.' },
            ],
            provenance: {
              timestampDisplay: '48:10',
              timestampSeconds: 2890,
              sourceUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
            },
          },
          {
            id: 'vis-2',
            title: 'Pre-LN vs Post-LN Gradient Highway',
            imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1000&q=80',
            caption: 'Figure 2.2: Unobstructed gradient flow through the residual addition stream.',
            visualType: 'benchmark',
            analysis:
              'By placing LayerNorm inside the branch (Pre-LN) rather than in the main trunk (Post-LN), the identity mapping $x_{l+1} = x_l + F(x_l)$ allows gradients to backpropagate from layer 100 directly to layer 1 without degradation.',
            provenance: {
              timestampDisplay: '86:30',
              timestampSeconds: 5190,
              sourceUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
            },
          },
        ],
      },
    },
    {
      id: 'sec-insights',
      type: 'insight',
      title: 'Key Insights & Engineering Gotchas',
      subtitle: 'Critical heuristics from building neural networks in production',
      content: {
        items: [
          {
            id: 'ins-1',
            type: 'key_insight',
            title: 'The Residual Stream is an Additive Blackboard',
            description:
              'Think of the residual stream as a shared central memory bus. Each attention and MLP block reads from the bus, does a calculation, and adds (adds, never overwrites) its delta contribution back onto the bus.',
            actionableAdvice: 'Never place operations that destroy the additive identity in the main trunk.',
          },
          {
            id: 'ins-2',
            type: 'mental_model',
            title: 'Attention = Communication, MLP = Computation',
            description:
              'Self-Attention is where tokens talk to each other to share context. The Feed-Forward MLP is where each token sits in isolation and processes what it has heard.',
            quote: {
              text: 'Attention routes information between tokens. The MLP computes on that routed information.',
              author: 'Andrej Karpathy',
            },
          },
          {
            id: 'ins-3',
            type: 'warning',
            title: 'The Softmax Vanishing Gradient Trap (d_k scaling)',
            description:
              'Without dividing by sqrt(d_k), for large vector dimensions (e.g. d_k=128), dot products grow in magnitude into the hundreds. Softmax outputs converge to one-hot vectors, yielding virtually zero gradients during backprop.',
            actionableAdvice: 'Always scale before softmax masking.',
          },
        ],
      },
    },
    {
      id: 'sec-quiz',
      type: 'quiz',
      title: 'Interactive Knowledge Check',
      subtitle: 'Test your grasp of the architectural principles',
      content: {
        title: 'Transformer Architecture Mastery Check',
        description: 'Verify your understanding of Attention mechanisms and tensor dimensions.',
        questions: [
          {
            id: 'q1',
            question: 'Why do we divide the Query-Key dot product by sqrt(d_k)?',
            options: [
              'To reduce GPU memory allocation during matrix multiplication',
              'To prevent dot product magnitudes from pushing the softmax into vanishing gradient saturation',
              'To force all attention weights to be strictly positive numbers',
              'To ensure the matrix is symmetric and invertible',
            ],
            correctOptionIndex: 1,
            explanation:
              'When d_k is large, the variance of the dot product is d_k. Dividing by sqrt(d_k) normalizes variance to 1, preventing softmax from saturating into flat zero-derivative regions.',
            hint: 'Think about what happens to the derivative of softmax when logits are +50 or -50.',
          },
          {
            id: 'q2',
            question: 'During causal autoregressive training, what is the role of the upper triangular mask in self-attention?',
            options: [
              'It drops 50% of the weights to act as a Dropout regularizer',
              'It replaces future token positions with -infinity so softmax assigns them 0 probability',
              'It speeds up matrix multiplication by converting dense tensors to sparse tensors',
              'It forces the model to ignore punctuation and whitespace',
            ],
            correctOptionIndex: 1,
            explanation:
              'Setting attention logits of future positions to -infinity ensures exp(-inf) = 0 in softmax, guaranteeing that position t cannot access information from positions t+1, t+2, etc.',
          },
          {
            id: 'q3',
            question: 'What is the primary conceptual difference between Self-Attention and the Feed-Forward (MLP) layer?',
            options: [
              'Self-Attention operates across tokens (sequence); MLP operates on each token vector independently.',
              'Self-Attention uses non-linear activations; MLP is strictly linear.',
              'Self-Attention is used only in inference; MLP is used only in training.',
              'Self-Attention requires recurrent feedback loops; MLP uses convolution.',
            ],
            correctOptionIndex: 0,
            explanation:
              'Self-Attention facilitates cross-token communication across the sequence dimension. The MLP applies identical non-linear transformations to each token vector independently.',
          },
        ],
      },
    },
    {
      id: 'sec-takeaways',
      type: 'takeaways',
      title: 'Actionable Takeaways & Next Steps',
      subtitle: 'What to apply immediately in your ML & AI engineering workflow',
      content: {
        mainPoints: [
          'Attention is a dynamically weighted communication protocol over a fully connected graph.',
          'Residual connections (Pre-LN) are essential for gradient preservation in deep networks.',
          'Transformers achieve massive scale because training is 100% parallel matrix operations (GEMM).',
          'Positional embeddings are mandatory because pure self-attention is permutation-invariant.',
        ],
        actionableChecklist: [
          { text: 'Implement a minimal 1-head self-attention module in PyTorch with causal masking.', category: 'Code Practice' },
          { text: 'Verify tensor shapes at every step: [Batch, Time, Channels] -> [B, T, Head, HeadDim].', category: 'Debugging' },
          { text: 'Inspect how temperature parameter affects softmax probability entropy at generation time.', category: 'Inference' },
        ],
        nextSteps: [
          'Study FlashAttention memory tiling and IO-aware GPU kernel optimizations.',
          'Explore Rotary Positional Embeddings (RoPE) used in Llama 3 and modern models.',
        ],
        recommendedFollowUps: [
          {
            title: 'Building Production-Ready Multi-Agent RAG Architectures',
            linkOrSlug: '/eco/youlearn/learn/production-agentic-rag',
            type: 'YouLearn Experience',
          },
          {
            title: 'Systems Thinking & High-Leverage Decision Architecture',
            linkOrSlug: '/eco/youlearn/learn/systems-thinking',
            type: 'YouLearn Experience',
          },
        ],
      },
    },
    {
      id: 'sec-provenance',
      type: 'provenance',
      title: 'Source Provenance & Original Attribution',
      subtitle: 'Original lecture and citation metadata',
      content: {
        sourceTitle: 'Let\'s build GPT: from scratch, in code, spelled out.',
        sourceUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
        author: {
          name: 'Andrej Karpathy',
          channelOrOrg: 'Andrej Karpathy YouTube Channel',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          roleOrBio: 'Ex-Director of AI at Tesla, OpenAI Founding Member',
          profileUrl: 'https://karpathy.ai',
        },
        license: 'Educational Creative Commons / Open Access attribution',
        citationText:
          'Karpathy, A. (2023). "Let\'s build GPT: from scratch, in code, spelled out." YouTube Masterclass Series.',
        keyTimestamps: [
          { label: 'Introduction & Big Picture', timestampDisplay: '00:00', timestampSeconds: 0 },
          { label: 'Attention Matrix Math Derivation', timestampDisplay: '35:10', timestampSeconds: 2110 },
          { label: 'Multi-Head Architecture', timestampDisplay: '63:20', timestampSeconds: 3800 },
          { label: 'Complete nanoGPT Training Run', timestampDisplay: '102:40', timestampSeconds: 6160 },
        ],
        references: [
          {
            label: 'Vaswani et al. (2017) "Attention Is All You Need"',
            url: 'https://arxiv.org/abs/1706.03762',
            type: 'paper',
            description: 'The foundational research paper introducing the Transformer architecture.',
          },
          {
            label: 'nanoGPT GitHub Repository',
            url: 'https://github.com/karpathy/nanoGPT',
            type: 'github',
            description: 'The simplest, fastest repository for training/finetuning medium-sized GPTs.',
          },
        ],
      },
    },
  ],
};
