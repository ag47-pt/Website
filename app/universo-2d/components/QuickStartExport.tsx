'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { UNIVERSO_2D_DATA } from '@/data/universo-2d';
import { Download, FileText, Check, Sparkles, ArrowUpRight } from 'lucide-react';

export function QuickStartExport() {
  const { theme, themeContrast } = useTheme();
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleDownloadSpecs = () => {
    const markdownContent = `# AGÊNCIA 47 — PLATAFORMA & ESPECIFICAÇÕES TÉCNICAS (UNIVERSO 2D)
Data de Emissão: 2026-08-14
Status do Sistema: ${UNIVERSO_2D_DATA.brand.status}
Versão: ${UNIVERSO_2D_DATA.brand.version}
Domínio Oficial: https://${UNIVERSO_2D_DATA.brand.domain}

---

## 1. MANIFESTO & QUEM SOMOS
${UNIVERSO_2D_DATA.about.description}

### Pilares Fundamentais:
${UNIVERSO_2D_DATA.about.pillars.map((p, i) => `${i + 1}. **${p.title}**: ${p.description}`).join('\n')}

---

## 2. SUITE DE SERVIÇOS ESPECIALIZADOS
${UNIVERSO_2D_DATA.services.map((s) => `### ${s.title}
- **Tag**: ${s.tag}
- **Prazo Médio**: ${s.deliveryTime}
- **Resumo**: ${s.description}
- **Recursos Principais**:
${s.features.map((f) => `  - ${f}`).join('\n')}
- **Métricas Chave**: ${s.metrics.map((m) => `${m.label}: ${m.value}`).join(' | ')}
`).join('\n')}

---

## 3. ECOSSISTEMA VIVO & PRODUTOS DO PORTFÓLIO
${UNIVERSO_2D_DATA.portfolio.map((p) => `- **${p.title}** (${p.subtitle})
  - Categoria: ${p.categoryLabel}
  - Status: ${p.status}
  - Rota: https://ag47.pt${p.path}
  - Stack: ${p.techStack.join(', ')}
  - Destaque: ${p.featuredMetric.label} = ${p.featuredMetric.value}
`).join('\n')}

---

## 4. PLANOS DE INVESTIMENTO & PREÇOS
${UNIVERSO_2D_DATA.pricingTiers.map((t) => `### Plano: ${t.name} (${t.badge || 'PADRÃO'})
- **Investimento Projeto**: ${t.priceProject} (${t.periodLabel})
- **Recorrência Mensal**: ${t.priceMonthly || 'N/A'}
- **Público-Alvo**: ${t.targetAudience}
- **Entregáveis**:
${t.features.map((f) => `  - [x] ${f}`).join('\n')}
`).join('\n')}

---

## 5. CONTACTO & BRIEFING DIRETO
- **Website**: https://${UNIVERSO_2D_DATA.brand.domain}
- **E-mail**: ${UNIVERSO_2D_DATA.brand.email}
- **WhatsApp**: ${UNIVERSO_2D_DATA.brand.whatsapp}
- **Engenharia**: Next.js 15 + TypeScript + Cloudflare Edge + Google Cloud
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'AG47-Universo-2D-Especificacoes.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section className="py-14 px-4 sm:px-6 relative border-t border-white/10 bg-gradient-to-b from-black to-zinc-950">
      <div className="max-w-4xl mx-auto text-center">
        <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 blur-3xl pointer-events-none opacity-15 transition-colors duration-700"
            style={{ backgroundColor: theme.colors.primary }}
          />

          <div className="relative z-10">
            <div 
              className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 transition-colors duration-500"
              style={{ color: theme.colors.primary }}
            >
              <FileText className="w-6 h-6" />
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight uppercase">
              Exportar Documentação Completa & Manifesto (.md)
            </h3>

            <p className="text-sm text-zinc-400 max-w-xl mx-auto mb-6 font-light">
              Faça o download do arquivo Markdown canónico com todas as diretrizes técnicas, arquitetura de software e preçário para partilhar com a sua equipe técnica.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleDownloadSpecs}
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: themeContrast || '#000000',
                  boxShadow: `0 0 20px ${theme.colors.primary}35`,
                }}
              >
                {downloaded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Download Concluído!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Baixar Especificações (.md)</span>
                  </>
                )}
              </button>

              <a
                href="https://wa.me/351912345678?text=Olá!%20Li%20a%20documentação%20da%20Agência%2047%20e%20gostaria%20de%20iniciar%20um%20projeto."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl text-xs sm:text-sm font-mono text-zinc-300 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 flex items-center gap-2 transition-all"
              >
                <span>Falar Diretamente com a Equipe</span>
                <ArrowUpRight 
                  className="w-4 h-4 transition-colors duration-500" 
                  style={{ color: theme.colors.primary }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
