"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
};

const LINK_DISTANCE = 168;
const DENSITY = 13_000; // one node per N square pixels

/**
 * Ambient particle network drawn on canvas: nodes drift, nearby nodes link,
 * and packets travel along links to suggest data flow between agents.
 * Everything is drawn client-side after mount, so there is no SSR mismatch.
 */
export function NetworkField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let raf = 0;

    const seed = () => {
      const count = Math.min(90, Math.max(28, Math.round((width * height) / DENSITY)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.5 + 0.6,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      frame += 1;

      for (const node of nodes) {
        if (!reduceMotion) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }

      // Links between nearby nodes, with a packet travelling along the strongest ones.
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;

          const strength = 1 - distance / LINK_DISTANCE;
          context.strokeStyle = `rgba(139, 92, 246, ${(strength * 0.28).toFixed(3)})`;
          context.lineWidth = 0.6;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();

          if (strength > 0.72) {
            const t = ((frame * 0.006 + i * 0.13 + j * 0.07) % 1 + 1) % 1;
            const px = a.x + (b.x - a.x) * t;
            const py = a.y + (b.y - a.y) * t;
            context.fillStyle = `rgba(34, 211, 238, ${(strength * 0.75).toFixed(3)})`;
            context.beginPath();
            context.arc(px, py, 1.25, 0, Math.PI * 2);
            context.fill();
          }
        }
      }

      for (const node of nodes) {
        const breathe = reduceMotion ? 0.5 : (Math.sin(frame * 0.02 + node.pulse) + 1) / 2;
        const alpha = 0.28 + breathe * 0.5;
        context.fillStyle = `rgba(226, 228, 255, ${alpha.toFixed(3)})`;
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    raf = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
