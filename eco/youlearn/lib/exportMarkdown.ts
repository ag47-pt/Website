import { KnowledgeObject } from '../schema/types';
import { formatDurationHuman } from './provenance';

/**
 * Generates an Obsidian / Notion-compatible Markdown document from a KnowledgeObject
 */
export function exportKnowledgeObjectToMarkdown(knowledge: KnowledgeObject): string {
  const { title, subtitle, description, source, learning, topics, tags, category, sections, slug } = knowledge;

  const tagsList = tags && tags.length > 0 ? tags : topics;
  const formattedTags = tagsList.map((t) => t.toLowerCase().replace(/[^a-z0-9_-]/g, '-')).join(', ');

  let md = `---
title: "${title.replace(/"/g, '\\"')}"
author: "${source.author.name.replace(/"/g, '\\"')}"
source_url: "${source.url}"
category: "${category}"
tags: [${formattedTags}]
original_duration: "${formatDurationHuman(learning.originalDurationMinutes)}"
youlearn_reading_time: "${formatDurationHuman(learning.estimatedLearningMinutes)}"
efficiency_gain: "${learning.compressionRatioPercent}% faster"
exported_at: "${new Date().toISOString().split('T')[0]}"
generator: "AG47 YouLearn Knowledge Compiler"
---

# ${title}
${subtitle ? `> *${subtitle}*\n` : ''}
${description}

---

## 📊 Summary & Key Metrics
- **Source Material**: [${source.title || 'Original Lecture'}](${source.url}) by **${source.author.name}**${source.author.channelOrOrg ? ` (${source.author.channelOrOrg})` : ''}
- **Original Duration**: ${formatDurationHuman(learning.originalDurationMinutes)}
- **YouLearn Distillation**: ~${formatDurationHuman(learning.estimatedLearningMinutes)} (${learning.compressionRatioPercent}% time saved)
- **Difficulty Tier**: \`${learning.difficulty.toUpperCase()}\`
- **Core Synthesis**: ${learning.keyTakeawaysSummary}

---
`;

  // Render each section into Obsidian / Notion markdown callouts
  for (const section of sections) {
    md += `\n## ${section.title}\n`;
    if (section.subtitle) {
      md += `*${section.subtitle}*\n\n`;
    }

    switch (section.type) {
      case 'overview': {
        const c = section.content as any;
        if (c.executiveSummary) {
          md += `### Executive Summary\n${c.executiveSummary}\n\n`;
        }
        if (c.coreThesis) {
          md += `> [!NOTE] Core Thesis\n> ${c.coreThesis}\n\n`;
        }
        if (c.whyItMatters && c.whyItMatters.length > 0) {
          md += `### Why It Matters\n`;
          for (const item of c.whyItMatters) {
            md += `- **${item.point}**: ${item.impact}\n`;
          }
          md += `\n`;
        }
        if (c.targetAudience && c.targetAudience.length > 0) {
          md += `**Target Audience**: ${c.targetAudience.join(', ')}\n\n`;
        }
        break;
      }

      case 'timeline': {
        const c = section.content as any;
        if (c.chapters && c.chapters.length > 0) {
          for (const chap of c.chapters) {
            const timeLink = chap.provenance?.sourceUrl || source.url;
            md += `### [${chap.timestampDisplay}](${timeLink}) — ${chap.title}\n`;
            md += `${chap.summary}\n\n`;
            if (chap.keyPoints && chap.keyPoints.length > 0) {
              for (const kp of chap.keyPoints) {
                md += `- ${kp}\n`;
              }
              md += `\n`;
            }
          }
        }
        break;
      }

      case 'concept': {
        const c = section.content as any;
        if (c.coreIdea) {
          md += `> [!INFO] Core Idea\n> ${c.coreIdea}\n\n`;
        }
        if (c.deepDive) {
          md += `### Architectural Deep Dive\n${c.deepDive}\n\n`;
        }
        if (c.asciiDiagram) {
          md += `\`\`\`text\n${c.asciiDiagram}\n\`\`\`\n\n`;
        }
        if (c.codeSnippet) {
          md += `\`\`\`${c.codeSnippet.language || 'typescript'}\n${c.codeSnippet.code}\n\`\`\`\n`;
          if (c.codeSnippet.explanation) {
            md += `*${c.codeSnippet.explanation}*\n\n`;
          }
        }
        if (c.keyTakeaways && c.keyTakeaways.length > 0) {
          md += `### Key Conceptual Takeaways\n`;
          for (const kt of c.keyTakeaways) {
            md += `- ${kt}\n`;
          }
          md += `\n`;
        }
        break;
      }

      case 'process': {
        const c = section.content as any;
        if (c.workflowOverview) {
          md += `${c.workflowOverview}\n\n`;
        }
        if (c.steps && c.steps.length > 0) {
          for (const st of c.steps) {
            md += `### Step ${st.stepNumber}: ${st.title}\n`;
            md += `${st.description}\n\n`;
            if (st.keyAction) {
              md += `> [!TIP] Actionable Instruction\n> ${st.keyAction}\n\n`;
            }
            if (st.verificationCheckpoint) {
              md += `- **Checkpoint**: ${st.verificationCheckpoint}\n`;
            }
            if (st.commonPitfall) {
              md += `- ⚠️ **Common Pitfall**: ${st.commonPitfall}\n`;
            }
            md += `\n`;
          }
        }
        break;
      }

      case 'comparison': {
        const c = section.content as any;
        if (c.context) {
          md += `${c.context}\n\n`;
        }
        if (c.columns && c.rows) {
          const headers = c.columns.map((col: any) => col.label).join(' | ');
          const divider = c.columns.map(() => '---').join(' | ');
          md += `| ${headers} |\n| ${divider} |\n`;
          for (const row of c.rows) {
            const aspect = row.aspect;
            const vals = c.columns.slice(1).map((col: any) => row.values[col.key] || '-');
            md += `| **${aspect}** | ${vals.join(' | ')} |\n`;
          }
          md += `\n`;
        }
        if (c.verdict) {
          md += `> [!SUCCESS] Comparative Verdict\n> ${c.verdict}\n\n`;
        }
        break;
      }

      case 'visual': {
        const c = section.content as any;
        if (c.overviewText) {
          md += `${c.overviewText}\n\n`;
        }
        if (c.items && c.items.length > 0) {
          for (const it of c.items) {
            md += `### ${it.title}\n`;
            if (it.imageUrl) {
              md += `![${it.caption || it.title}](${it.imageUrl})\n\n`;
            }
            if (it.analysis) {
              md += `${it.analysis}\n\n`;
            }
            if (it.annotations && it.annotations.length > 0) {
              for (const an of it.annotations) {
                md += `- **${an.label}**: ${an.description}\n`;
              }
              md += `\n`;
            }
          }
        }
        break;
      }

      case 'insight': {
        const c = section.content as any;
        if (c.items && c.items.length > 0) {
          for (const ins of c.items) {
            const calloutType = ins.type === 'warning' ? 'WARNING' : ins.type === 'pro_tip' ? 'TIP' : 'IMPORTANT';
            md += `> [!${calloutType}] ${ins.title}\n`;
            md += `> ${ins.description}\n`;
            if (ins.actionableAdvice) {
              md += `>\n> **Application**: ${ins.actionableAdvice}\n`;
            }
            md += `\n`;
          }
        }
        break;
      }

      case 'quiz': {
        const c = section.content as any;
        if (c.questions && c.questions.length > 0) {
          md += `> [!QUESTION] Active Recall & Self-Assessment\n`;
          for (let qIdx = 0; qIdx < c.questions.length; qIdx++) {
            const q = c.questions[qIdx];
            md += `> **Q${qIdx + 1}: ${q.question}**\n`;
            for (let optIdx = 0; optIdx < q.options.length; optIdx++) {
              const isCorrect = optIdx === q.correctAnswerIndex;
              md += `> - [${isCorrect ? 'x' : ' '}] ${q.options[optIdx]}${isCorrect ? ' *(Correct)*' : ''}\n`;
            }
            md += `> *Explanation: ${q.explanation}*\n>\n`;
          }
          md += `\n`;
        }
        break;
      }

      case 'takeaways': {
        const c = section.content as any;
        if (c.actionChecklist && c.actionChecklist.length > 0) {
          md += `### Actionable Implementation Checklist\n`;
          for (const item of c.actionChecklist) {
            md += `- [ ] **${item.action}**\n  - *Why*: ${item.expectedOutcome}\n`;
          }
          md += `\n`;
        }
        if (c.synthesisPoints && c.synthesisPoints.length > 0) {
          md += `### Synthesis Principles\n`;
          for (const sp of c.synthesisPoints) {
            md += `1. **${sp.headline}**: ${sp.elaboration}\n`;
          }
          md += `\n`;
        }
        break;
      }

      case 'provenance': {
        const c = section.content as any;
        md += `### Source Attribution & Licensing\n`;
        md += `- **Original Author**: ${c.creator?.name || source.author.name}\n`;
        md += `- **Source URL**: ${c.originalSourceUrl || source.url}\n`;
        md += `- **License**: ${c.license || source.license || 'All Rights Reserved by Original Creator'}\n`;
        if (c.citationText) {
          md += `- **Suggested Citation**: \`${c.citationText}\`\n`;
        }
        md += `\n`;
        break;
      }

      default:
        break;
    }
  }

  md += `\n---\n*Compiled with [AG47 YouLearn](https://ag47.pt/eco/youlearn) — Visual AI Knowledge Ecosystem.*\n`;

  return md;
}
