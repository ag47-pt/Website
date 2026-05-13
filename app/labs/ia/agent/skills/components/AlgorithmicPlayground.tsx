'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

declare global {
  interface Window {
    p5: any;
    p5Instance: any;
  }
}

export default function AlgorithmicPlayground() {
  const { theme, themeContrast } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [seed, setSeed] = useState(12345);
  const [isReady, setIsReady] = useState(false);

  const initP5 = () => {
    if (typeof window === 'undefined' || !window.p5 || !containerRef.current) return;

    if (window.p5Instance) {
      window.p5Instance.remove();
    }

    const sketch = (p: any) => {
      p.setup = () => {
        const canvas = p.createCanvas(800, 400);
        canvas.parent(containerRef.current!);
        p.randomSeed(seed);
        p.noiseSeed(seed);
        p.noLoop(); // Static art
        drawArt(p);
      };

      const drawArt = (p: any) => {
        p.background(10, 10, 10);
        
        const particles = 1500;
        const noiseScale = 0.005;
        
        p.noFill();
        p.strokeWeight(1.5);
        
        for (let i = 0; i < particles; i++) {
          let x = p.random(p.width);
          let y = p.random(p.height);
          let length = p.random(20, 150);
          
          p.beginShape();
          for (let j = 0; j < length; j++) {
            p.vertex(x, y);
            let angle = p.noise(x * noiseScale, y * noiseScale) * p.TWO_PI * 4;
            x += p.cos(angle) * 2;
            y += p.sin(angle) * 2;
            
            let r = p.map(p.sin(angle), -1, 1, 50, 163); 
            let g = p.map(p.cos(angle), -1, 1, 100, 230);
            let b = p.map(y, 0, p.height, 20, 100);
            let a = p.map(j, 0, length, 200, 0);
            
            p.stroke(r, g, b, a);
          }
          p.endShape();
        }
      };
    };

    window.p5Instance = new window.p5(sketch);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load p5.js dynamically
    if (!window.p5) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js';
      script.async = true;
      
      script.onload = () => {
        setTimeout(() => {
          setIsReady(true);
          initP5();
        }, 0);
      };
      
      document.body.appendChild(script);
    } else {
      setTimeout(() => {
        setIsReady(true);
        initP5();
      }, 0);
    }

    return () => {
      // Clean up p5 instance if exists
      if (typeof window !== 'undefined' && window.p5Instance) {
        window.p5Instance.remove();
        window.p5Instance = undefined;
      }
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      initP5();
    }
  }, [seed, isReady]);

  const handleDownload = () => {
    if (typeof window !== 'undefined' && window.p5Instance) {
      window.p5Instance.saveCanvas(`ag47-art-${seed}`, 'png');
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/50 p-8 overflow-hidden relative">
      <div 
        className="absolute inset-0 bg-gradient-to-br to-transparent pointer-events-none"
        style={{ '--tw-gradient-from': `${theme.colors.primary}0D` } as any}
      ></div>
      
      <div className="relative z-10 flex flex-col xl:flex-row gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: `${theme.colors.primary}33`, color: theme.colors.primary }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </span>
            <h2 className="text-2xl font-bold text-white">Algorithmic Art Playground</h2>
          </div>
          
          <p className="text-gray-400 mb-8">
            Esta é uma demonstração prática da skill <code>algorithmic-art</code>. 
            O canvas ao lado é renderizado via código (p5.js) baseado em conceitos de &quot;Turbulência Orgânica&quot;. 
            Cada semente matemática produz uma obra generativa única.
          </p>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Semente Matemática (Seed): <span className="font-mono" style={{ color: theme.colors.primary }}>{seed}</span>
              </label>
              <div className="flex gap-4">
                <button 
                  onClick={() => setSeed(s => s - 1)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors text-sm font-medium"
                >
                  Anterior
                </button>
                <button 
                  onClick={() => setSeed(Math.floor(Math.random() * 99999))}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors text-sm font-medium"
                >
                  Gerar Aleatório
                </button>
                <button 
                  onClick={() => setSeed(s => s + 1)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors text-sm font-medium"
                >
                  Próximo
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <style jsx>{`
                .download-btn { background-color: var(--btn-bg); color: var(--btn-text); }
                .download-btn:hover { background-color: var(--hover-color); opacity: 0.9; }
              `}</style>
              <button 
                onClick={handleDownload}
                className="download-btn w-full flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-lg transition-all"
                style={{ '--btn-bg': theme.colors.primary, '--hover-color': theme.colors.primary, '--btn-text': themeContrast } as any}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Baixar Obra de Arte (PNG)
              </button>
            </div>
          </div>
        </div>

        <div className="flex-[1.5] flex items-center justify-center bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden min-h-[400px] shadow-2xl relative">
          {!isReady && <div className="text-white/50 animate-pulse absolute">Carregando p5.js...</div>}
          <div ref={containerRef}></div>
        </div>
      </div>
    </div>
  );
}
