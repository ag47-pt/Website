'use client';

import React from 'react';
import { Terminal, Code2, Layers, Info } from 'lucide-react';
import { LabHero, LabCallCard, LabVisitCard, LabInfoCard } from '@/app/labs/components';

/**
 * LabTemplate — Reference implementation for new Labs pages.
 * 
 * MANDATORY RULES (from DESIGN_TOKENS.md):
 * 1. Overtitle Rule:  Every card MUST receive a `path` prop that renders as
 *    a dot-notation overtitle (e.g., "./labs/dev") above the title.
 * 2. Hover Highlight: The card group container MUST receive
 *    `style={{ '--hover-color': theme.colors.primary }}` so title hover
 *    uses `group-hover:bg-[var(--hover-color)] group-hover:text-black`.
 *    (This is already implemented inside LabCallCard and LabVisitCard.)
 * 3. Theme Colors:    Use `style={{ color: theme.colors.primary }}` —
 *    NOT Tailwind `text-primary` — for all accent text.
 */
export default function LabTemplatePage() {
  return (
    <div className="space-y-24">
      {/* 1. Hero Section Standardized */}
      <LabHero 
        overline="PROJECT_IDENTIFIER_V1.0"
        overlineIcon={Terminal}
        title="Inovação sem"
        highlight="Limites"
        description="Esta página segue o **padrão visual** do Ag47 Labs. Use este template para novos **mini-apps** garantindo consistência visual e **funcional**."
        statusTags={[
          { label: "Alpha_v0.1", color: "orange", pulse: true },
          { label: "Design_Ready", color: "lime" }
        ]}
        actions={
          <button className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
            Iniciar Processo
          </button>
        }
        footer={
          <div className="flex items-center gap-2">
            <span>Diretório:</span>
            <code className="bg-white/10 px-2 py-0.5 rounded">app/labs/template</code>
          </div>
        }
      />

      {/* 2. VisitCards Section (Showcase style) */}
      {/* NOTE: Pass `path` prop — renders as overtitle above the card title */}
      <section className="space-y-8">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-white" />
          <h2 className="text-2xl font-bold text-white tracking-tighter">Showcase Projects</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LabVisitCard 
            title="Alpha Interface"
            client="Agência 47"
            description="Interface experimental com scroll progressivo e glassmorphism."
            thumbnail="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000"
            progress={85}
            specs={["Next.js", "Three.js", "AI"]}
            slug="alpha-ui"
            path="/labs/dev/sandbox/alpha-ui"    // ← MANDATORY: overtitle path
            hasSandbox={true}
            icon={<Layers />}
          />
        </div>
      </section>

      {/* 3. CallCards Section (Navigation style) */}
      {/* NOTE: Pass `path` prop — renders as overtitle. Must match the actual route. */}
      <section className="grid md:grid-cols-2 gap-8">
        <LabCallCard 
          title="Módulo de IA"
          description="Acesse o centro de processamento de Agentes Inteligentes."
          path="/labs/ia"                    // ← MANDATORY: overtitle path
          icon={<Terminal className="w-8 h-8" />}
          status="ACTIVE"
        />
        <LabCallCard 
          title="Dev Showcase"
          description="Acompanhe o desenvolvimento em tempo real dos nossos projetos ativos e MVPs em fase alfa."
          path="/labs/dev"                   // ← MANDATORY: overtitle path
          icon={<Code2 className="w-8 h-8" />}
          status="ACTIVE_SECTOR"
        />
      </section>

      {/* 4. InfoCard Section */}
      <LabInfoCard 
        title="Nota Técnica"
        description="Todos os componentes deste template são totalmente responsivos e seguem as diretrizes de acessibilidade WCAG 2.1."
        icon={<Info />}
      />
    </div>
  );
}
