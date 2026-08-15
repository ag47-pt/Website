import { KnowledgeObject } from '@/eco/youlearn/schema/types';
import { formatDurationHuman } from './provenance';

/**
 * Renders a high-definition 1200x675 Knowledge Badge image to an HTML5 Canvas
 * and triggers a direct PNG download.
 */
export async function downloadKnowledgeBadgePng(knowledge: KnowledgeObject): Promise<void> {
  const { title, learning, source, category, slug } = knowledge;
  const originalDuration = formatDurationHuman(learning.originalDurationMinutes);
  const compressedDuration = formatDurationHuman(learning.estimatedLearningMinutes);
  const efficiency = `${learning.compressionRatioPercent}%`;

  const width = 1200;
  const height = 675;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }

  // 1. Background (Deep Dark Zinc-950)
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient Gradient Glows
  const topGlow = ctx.createRadialGradient(250, 150, 10, 250, 150, 450);
  topGlow.addColorStop(0, 'rgba(209, 255, 0, 0.18)');
  topGlow.addColorStop(1, 'rgba(9, 9, 11, 0)');
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, width, height);

  const bottomGlow = ctx.createRadialGradient(950, 500, 10, 950, 500, 450);
  bottomGlow.addColorStop(0, 'rgba(16, 185, 129, 0.14)');
  bottomGlow.addColorStop(1, 'rgba(9, 9, 11, 0)');
  ctx.fillStyle = bottomGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Card Outer Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 4. Header Bar
  // AG47 Logo Badge
  ctx.fillStyle = '#D1FF00';
  ctx.beginPath();
  ctx.roundRect(65, 65, 90, 32, 8);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('AG47', 90, 87);

  // YouLearn Title Tag
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(165, 65, 190, 32, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#E4E4E7';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('YOULEARN ACADEMY', 185, 86);

  // Category Tag (Right side)
  ctx.fillStyle = 'rgba(209, 255, 0, 0.12)';
  ctx.strokeStyle = 'rgba(209, 255, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(width - 320, 65, 255, 32, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D1FF00';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(category.toUpperCase(), width - 305, 86);

  // 5. Title & Author
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px sans-serif';

  // Smart multiline title wrapping
  const words = title.split(' ');
  let line = '';
  let y = 180;
  const maxTitleWidth = 1070;
  const lineHeight = 46;
  let linesCount = 0;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTitleWidth && i > 0) {
      ctx.fillText(line.trim(), 65, y);
      line = words[i] + ' ';
      y += lineHeight;
      linesCount++;
      if (linesCount >= 2 && i < words.length - 1) {
        // truncate with ellipsis if exceeds 2 lines
        line = line + '...';
        break;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), 65, y);

  // Author Subtitle
  y += 42;
  ctx.fillStyle = '#A1A1AA';
  ctx.font = '16px sans-serif';
  ctx.fillText(`Fonte Original: ${source.author.name} ${source.author.channelOrOrg ? `(${source.author.channelOrOrg})` : ''}`, 65, y);

  // 6. Metrics Cards (3 Balanced Columns)
  const cardY = 360;
  const cardHeight = 160;
  const cardWidth = 330;
  const cardGap = 40;
  const startX = 65;

  // Metric Card 1: Original Lecture
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(startX, cardY, cardWidth, cardHeight, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#71717A';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('AULA ORIGINAL', startX + 25, cardY + 45);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(originalDuration, startX + 25, cardY + 105);

  // Metric Card 2: YouLearn Time (Highlighted Lime)
  const card2X = startX + cardWidth + cardGap;
  ctx.fillStyle = 'rgba(209, 255, 0, 0.06)';
  ctx.strokeStyle = 'rgba(209, 255, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(card2X, cardY, cardWidth, cardHeight, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#D1FF00';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('TEMPO YOULEARN', card2X + 25, cardY + 45);

  ctx.fillStyle = '#D1FF00';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(`~${compressedDuration}`, card2X + 25, cardY + 105);

  // Metric Card 3: Efficiency Gain (Emerald)
  const card3X = card2X + cardWidth + cardGap;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.beginPath();
  ctx.roundRect(card3X, cardY, cardWidth, cardHeight, 16);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('ECONOMIA DE TEMPO', card3X + 25, cardY + 45);

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 36px monospace';
  ctx.fillText(`${efficiency} MAIS RÁPIDO`, card3X + 25, cardY + 105);

  // 7. Footer Bar
  ctx.fillStyle = '#52525B';
  ctx.font = '13px monospace';
  ctx.fillText('SÍNTESE ESTRUTURADA DE CONHECIMENTO • AG47 YOULEARN', 65, height - 60);

  ctx.fillStyle = '#D1FF00';
  ctx.fillText('ag47.pt/eco/youlearn', width - 260, height - 60);

  // 8. Convert to PNG & Trigger Download
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${slug}-knowledge-badge.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      resolve();
    }, 'image/png');
  });
}
