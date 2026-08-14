import { KnowledgeObject } from '../schema/types';

export const systemsThinking: KnowledgeObject = {
  id: 'ko-systems-thinking-002',
  slug: 'systems-thinking',
  version: '1.0.0',
  title: 'Systems Thinking & High-Leverage Decision Architecture',
  subtitle: 'Mastering feedback loops, stock-and-flow dynamics, and the 12 leverage points in complex systems.',
  description:
    'Learn how to diagnose counter-intuitive behavior in organizations, codebases, and markets. Understand why direct, intuitive interventions often fail, and how to identify high-leverage intervention points.',
  category: 'Business',
  topics: ['Mental Models', 'Complex Systems', 'Feedback Loops', 'Strategy', 'Decision Making'],
  tags: ['donella-meadows', 'system-dynamics', 'leverage-points', 'feedback-delay', 'policy-resistance'],
  featured: false,
  thumbnail: 'https://img.youtube.com/vi/HMmChiLZZHg/maxresdefault.jpg',
  source: {
    type: 'youtube',
    title: 'Thinking in Systems: The 12 Leverage Points in Complex Organizations',
    url: 'https://www.youtube.com/watch?v=HMmChiLZZHg',
    author: {
      name: 'Donella Meadows Institute',
      channelOrOrg: 'Systems Dynamics & Sustainability Series',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      roleOrBio: 'Pioneers in Global System Dynamics and Organizational Modeling',
      profileUrl: 'https://donellameadows.org',
    },
    publishedAt: '2022-11-04',
    platformIdentifier: 'HMmChiLZZHg',
    license: 'Educational Commons License',
  },
  learning: {
    originalDurationMinutes: 74,
    estimatedLearningMinutes: 9,
    compressionRatioPercent: 88,
    difficulty: 'beginner',
    keyTakeawaysSummary:
      'Complex systems exhibit policy resistance because intuitive fixes push on low-leverage parameters (numbers and constants) instead of shifting information flows, rules, and paradigm goals.',
    targetAudience: [
      'Engineering Leads & CTOs',
      'Product Managers & Founders',
      'Strategy Consultants',
      'System Architects',
    ],
    prerequisites: ['Basic organizational experience', 'Familiarity with feedback concepts'],
  },
  createdAt: '2026-08-11T14:00:00Z',
  updatedAt: '2026-08-14T09:00:00Z',
  status: 'published',
  sections: [
    {
      id: 'sec-overview',
      type: 'overview',
      title: 'Executive Summary & The Systems Paradigm',
      subtitle: 'Why complex systems resist straightforward solutions',
      content: {
        executiveSummary:
          'When an organization, market, or software architecture behaves poorly, the instinctive reaction is to blame individuals or tweak numerical parameters (e.g. hire more people, add more budget). Systems thinking proves that system structure dictates 90% of behavior.',
        coreThesis:
          'The structure of stocks, flows, delays, and feedback loops creates system behavior. You cannot fix a systemic problem with a local, non-structural fix.',
        whyItMatters:
          'Leaders who master systems thinking avoid the trap of "pushing harder on the system" only to trigger compensatory balancing loops that snap back.',
        prerequisites: ['Understanding of cause-and-effect delays'],
        targetAudience: ['Tech Leaders', 'Founders', 'Designers of Complex Systems'],
      },
    },
    {
      id: 'sec-timeline',
      type: 'timeline',
      title: 'Intellectual Journey: Anatomy of a System',
      subtitle: 'Progressing from stock-flow basics to paradigm shifts',
      content: {
        introText: 'A structured breakdown of how systems store information, delay feedback, and respond to change.',
        chapters: [
          {
            id: 'ch-1',
            title: 'Stocks, Flows, and Inflow/Outflow Equilibrium',
            timestampDisplay: '02:30',
            timestampSeconds: 150,
            durationMinutes: 12,
            summary: 'Stocks are the memory of the system. Flows are the rate of change.',
            keyConcepts: ['Bathtub Model', 'Accumulation', 'Time Delays'],
            badge: 'Foundations',
          },
          {
            id: 'ch-2',
            title: 'Reinforcing (Growth) vs. Balancing (Stability) Loops',
            timestampDisplay: '16:45',
            timestampSeconds: 1005,
            durationMinutes: 18,
            summary: 'How positive feedback fuels exponential runaway and negative feedback enforces boundaries.',
            keyConcepts: ['Exponential Loops', 'Goal Seeking', 'Oscillations'],
            badge: 'Dynamics',
          },
          {
            id: 'ch-3',
            title: 'Why Delays Cause Destructive Oscillations',
            timestampDisplay: '38:10',
            timestampSeconds: 2290,
            durationMinutes: 16,
            summary: 'The bullwhip effect: when feedback arrives late, actors overcorrect repeatedly.',
            keyConcepts: ['Information Lag', 'Overshoot & Collapse', 'Damping'],
            badge: 'Pathologies',
          },
          {
            id: 'ch-4',
            title: 'The Hierarchy of the 12 Leverage Points',
            timestampDisplay: '55:20',
            timestampSeconds: 3320,
            durationMinutes: 24,
            summary: 'Ranking interventions from lowest leverage (parameters) to highest (goals and paradigms).',
            keyConcepts: ['Information Structure', 'System Rules', 'Paradigm Transcending'],
            badge: 'High Leverage',
          },
        ],
      },
    },
    {
      id: 'sec-concept-loops',
      type: 'concept',
      title: 'Core Concept: Reinforcing vs. Balancing Feedback Loops',
      subtitle: 'The two foundational atomic forces of all system dynamics',
      content: {
        coreIdea:
          'Every dynamic behavior in the universe is generated by combinations of two feedback loops: Reinforcing Loops (which amplify change exponentially) and Balancing Loops (which counteract change to maintain a goal).',
        deepDive:
          'A system that wants to maintain equilibrium (like code stability or company runway) uses balancing loops. However, when time delays exist between action and observation, balancing loops overcompensate, creating violent boom-and-bust cycles.',
        keyTakeaways: [
          'Reinforcing loops create viral growth or vicious spirals.',
          'Balancing loops have a target state or implicit goal (often hidden).',
          'Delays in feedback loops turn smooth regulation into chaotic oscillation.',
        ],
        diagram: {
          type: 'flow',
          title: 'Stock and Flow Dynamic Feedback Loop',
          description: 'Inflow -> Stock -> Outflow, regulated by Balancing Feedback with Time Delay',
          asciiArt: `
   [ INFLOW ] ======> ( STOCK / STATE ) ======> [ OUTFLOW ]
       ^                      |
       |                      v
   [ Action ] <--- ( Perceived Discrepancy ) <--- [ GOAL ]
         \\________________[ TIME DELAY ]_______________/
          `,
          caption: 'Figure 1.1: Standard balancing feedback loop with delay.',
        },
        callout: {
          type: 'note',
          text: 'If you want to stabilize an oscillating system, don\'t change the inflow rate — shorten the delay or slow down the decision cadence.',
          author: 'Donella Meadows',
        },
      },
    },
    {
      id: 'sec-comparison-leverage',
      type: 'comparison',
      title: 'Intervention Strategy: Low Leverage vs. High Leverage',
      subtitle: 'Where 99% of effort is wasted vs. where transformational shifts occur',
      content: {
        context:
          'Comparing standard superficial management tactics with true structural systems interventions.',
        columns: [
          { key: 'dimension', label: 'Intervention Level' },
          { key: 'low', label: 'Low Leverage (Superficial)' },
          { key: 'high', label: 'High Leverage (Systemic)', highlight: true },
        ],
        rows: [
          {
            aspect: 'Focus Point',
            values: {
              low: 'Parameters, numbers, salaries, budget percentages, quotas.',
              high: 'Information flows, rules, power to change rules, goals.',
            },
            verdictWinnerKey: 'high',
            note: 'Changing numbers rarely changes system behavior mode.',
          },
          {
            aspect: 'Effort Required',
            values: {
              low: 'High constant friction and policing.',
              high: 'Surgical one-time structural redesign.',
            },
            verdictWinnerKey: 'high',
            note: 'System naturally drives itself once rules are aligned.',
          },
          {
            aspect: 'Resistance',
            values: {
              low: 'Low initial pushback, but zero long-term impact.',
              high: 'Fierce psychological resistance because it challenges status quo.',
            },
            verdictWinnerKey: 'high',
            note: 'True leverage points are always resisted by incumbents.',
          },
          {
            aspect: 'Example in Tech',
            values: {
              low: 'Mandating "write more tests" without changing incentives.',
              high: 'Making failed builds block deployment pipeline automatically (forcing feedback loop).',
            },
            verdictWinnerKey: 'high',
            note: 'Information transparency enforces new behavior naturally.',
          },
        ],
        verdict:
          'True leverage exists in reshaping information visibility and defining who controls the feedback rules — not in tweaking numerical goals.',
      },
    },
    {
      id: 'sec-process-leverage',
      type: 'process',
      title: 'The 4-Step Diagnosis for Systemic Failure',
      subtitle: 'How to unpack counter-intuitive problems in your organization',
      content: {
        summary: 'A repeatable diagnostic protocol for debugging chronic issues.',
        steps: [
          {
            stepNumber: 1,
            title: 'Map Stocks & Accumulations',
            description: 'Identify what is physically accumulating (technical debt, unfinished PRs, customer goodwill, cash).',
            badge: 'Step 1',
          },
          {
            stepNumber: 2,
            title: 'Trace Information Delays',
            description: 'Measure how many days or weeks pass between a bug creation, discovery, report, and resolution.',
            badge: 'Step 2',
          },
          {
            stepNumber: 3,
            title: 'Locate Competing Implicit Goals',
            description: 'Uncover what the system is ACTUALLY optimizing for (e.g. shipping features vs system reliability).',
            badge: 'Step 3',
          },
          {
            stepNumber: 4,
            title: 'Restructure Information Access',
            description: 'Put feedback directly in front of the decision-maker who causes the downstream consequence.',
            badge: 'Step 4',
          },
        ],
        outcomeSummary: 'By closing the feedback loop, the system self-corrects without requiring micro-management.',
      },
    },
    {
      id: 'sec-visual-evidence',
      type: 'visual',
      title: 'Visual Archetypes: Feedback Loops & System Diagrams',
      subtitle: 'Inspecting the structural mechanics of complex systems',
      content: {
        overviewText:
          'Visual representations of balancing loops, reinforcing cascades, and the 12 leverage points hierarchy described by Donella Meadows.',
        items: [
          {
            id: 'vis-st-1',
            title: 'Bathtub Stock & Flow Equilibrium Model',
            imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80',
            caption: 'Figure 1.1: Visualizing inflows, accumulation (stock), outflows, and delay gaps.',
            visualType: 'diagram',
            analysis:
              'Stocks accumulate or drain according to the net difference between Inflows and Outflows. When delay sensors are slow, oscillation occurs.',
            annotations: [
              { label: 'Stock Reservoir', description: 'Accumulated technical debt, cash, or customer trust.' },
              { label: 'Delay Gap', description: 'Time lag between policy decision and physical outcome.' },
            ],
            provenance: {
              timestampDisplay: '18:15',
              timestampSeconds: 1095,
              sourceUrl: 'https://www.youtube.com/watch?v=HMmChiLZZHg',
            },
          },
          {
            id: 'vis-st-2',
            title: 'The 12 Leverage Points Hierarchy Matrix',
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
            caption: 'Figure 1.2: Ascending from shallow parameter tweaks to structural paradigm shifts.',
            visualType: 'architecture',
            analysis:
              'Parameters and numbers reside at the lowest leverage tier (#12-#10), while the mindset/paradigm out of which the system arises represents the highest leverage (#2-#1).',
            annotations: [
              { label: 'Low Leverage', description: 'Subsidies, quotas, and micro-targets.' },
              { label: 'High Leverage', description: 'System goals, self-organization rules, and paradigm shifts.' },
            ],
            provenance: {
              timestampDisplay: '46:30',
              timestampSeconds: 2790,
              sourceUrl: 'https://www.youtube.com/watch?v=HMmChiLZZHg',
            },
          },
        ],
      },
    },
    {
      id: 'sec-insights',
      type: 'insight',
      title: 'System Archetypes & Golden Rules',
      subtitle: 'Universal mental models observed across engineering and business',
      content: {
        items: [
          {
            id: 'ins-1',
            type: 'mental_model',
            title: 'Policy Resistance',
            description:
              'When you push against a system and it pushes back with equal force, you have found an active balancing loop defending an unstated goal.',
          },
          {
            id: 'ins-2',
            type: 'pro_tip',
            title: 'The Power of Missing Information',
            description:
              'Adding a new feedback connection where none existed (e.g., live error monitoring in the developer\'s terminal) produces 10x more impact than increasing QA staff.',
          },
          {
            id: 'ins-3',
            type: 'warning',
            title: 'Beware the Trap of Shifting the Burden',
            description:
              'Applying symptomatic band-aids weakens the system\'s internal capacity to solve its own underlying disease over time.',
          },
        ],
      },
    },
    {
      id: 'sec-quiz',
      type: 'quiz',
      title: 'Systems Thinking Knowledge Check',
      subtitle: 'Validate your grasp of leverage points and feedback dynamics',
      content: {
        title: 'Systems Dynamics Assessment',
        description: 'Test your ability to recognize high-leverage interventions.',
        questions: [
          {
            id: 'sq1',
            question: 'Which of the following is considered the HIGHEST leverage point in Donella Meadows\' hierarchy?',
            options: [
              'Adjusting constants and parameters (e.g. tax rates, salary levels)',
              'The mindset or paradigm out of which the system and its goals arise',
              'Changing the size of physical buffers and warehouses',
              'Speeding up the physical delivery trucks',
            ],
            correctOptionIndex: 1,
            explanation:
              'Paradigms are the source of systems. Transcending or shifting the underlying paradigm completely reconfigures all goals, rules, and flows in one stroke.',
          },
          {
            id: 'sq2',
            question: 'Why do delays in balancing feedback loops cause violent oscillations in systems?',
            options: [
              'Because actors keep applying corrective pressure based on outdated information before the previous correction takes effect',
              'Because physical friction destroys the feedback signals completely',
              'Because reinforcing loops become permanently disabled',
              'Because the goal of the system changes randomly',
            ],
            correctOptionIndex: 0,
            explanation:
              'When there is a lag between action and result (like turning a hot water shower dial), actors over-adjust while waiting, causing extreme overshoot and undershoot.',
          },
        ],
      },
    },
    {
      id: 'sec-takeaways',
      type: 'takeaways',
      title: 'Key Takeaways & Systemic Implementation',
      subtitle: 'Immediate steps for applying systems thinking',
      content: {
        mainPoints: [
          'Never blame people for what the structure of the system compels them to do.',
          'Look for hidden delays and missing feedback connections.',
          'Target rules and information flows instead of numerical quotas.',
          'Honor the self-organizing resilience of complex networks.',
        ],
        actionableChecklist: [
          { text: 'Draw the causal loop diagram for the biggest recurring problem in your team.', category: 'Audit' },
          { text: 'Identify the time delay between decision and feedback.', category: 'Measurement' },
          { text: 'Make feedback immediate and publicly visible.', category: 'Architecture' },
        ],
        nextSteps: ['Read Donella Meadows\' "Thinking in Systems: A Primer".'],
      },
    },
    {
      id: 'sec-provenance',
      type: 'provenance',
      title: 'Source Attribution & References',
      subtitle: 'Original lecture archive and foundational publications',
      content: {
        sourceTitle: 'Thinking in Systems: The 12 Leverage Points in Complex Organizations',
        sourceUrl: 'https://www.youtube.com/watch?v=HMmChiLZZHg',
        author: {
          name: 'Donella Meadows Institute',
          channelOrOrg: 'Systems Dynamics & Sustainability Series',
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          roleOrBio: 'Pioneers in Global System Dynamics and Organizational Modeling',
          profileUrl: 'https://donellameadows.org',
        },
        license: 'Educational Commons License',
        citationText: 'Meadows, D. (1999). "Leverage Points: Places to Intervene in a System." Whole Earth.',
        keyTimestamps: [
          { label: 'Introduction to Stocks and Flows', timestampDisplay: '02:30', timestampSeconds: 150 },
          { label: 'The 12 Leverage Points Hierarchy', timestampDisplay: '55:20', timestampSeconds: 3320 },
        ],
        references: [
          {
            label: 'Donella Meadows: Places to Intervene in a System (Classic Essay)',
            url: 'https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/',
            type: 'documentation',
          },
        ],
      },
    },
  ],
};
