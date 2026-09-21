import { catalogServices } from '../data/services'

/**
 * Base de conhecimento completa da Agência 47.
 * Importada pelo agente como contexto estático.
 */
export const KNOWLEDGE_BASE = `
# Agência 47 — Conhecimento Completo

## Identidade da Empresa
- **Nome**: Agência 47 (também conhecida como Ag47 ou ag47.pt)
- **Website**: https://ag47.pt
- **Localização**: Portugal
- **Slogan**: "Catapultamos o teu negócio para o próximo nível"
- **Missão**: Criar soluções digitais com o DNA da marca do cliente — websites de conversão, SaaS, Social Media e Tráfego Pago.
- **Tecnologia principal**: Next.js, TypeScript, Supabase, Vercel (sem WordPress)
- **Contacto/Orçamento**: Sessão gratuita de diagnóstico (15-30 min) agendável pelo site

---

## Sitemap / Páginas

| Página | URL |
|--------|-----|
| Homepage | https://ag47.pt |
| Serviços | https://ag47.pt/servicos |
| Websites & Landing Pages | https://ag47.pt/servicos/websites-landing-pages |
| SaaS & WebApps | https://ag47.pt/servicos/saas-webapps |
| Social Media & Conteúdo | https://ag47.pt/servicos/social-media-conteudo |
| Tráfego Pago & Conversão | https://ag47.pt/servicos/trafego-pago-conversao |
| Planos & Preços | https://ag47.pt/servicos/planos |

---

## Serviços Detalhados

${catalogServices.map((service) => `### ${service.cardTitle}
${service.metaDescription}
URL: https://ag47.pt/servicos/${service.slug}
${service.offers.filter((offer) => offer.active).map((offer) => `- ${offer.title}: ${offer.priceLabel}; prazo indicativo: ${offer.deliveryLabel}. ${offer.outcome}`).join('\n')}
${service.faqs.map((faq) => `- ${faq.q} ${faq.a}`).join('\n')}`).join('\n\n')}

Preços iniciais e prazos indicativos. Confirmar âmbito, IVA, licenças e condições na proposta. Não apresentar médias, garantias ou resultados quantitativos sem evidência documentada.

---

## Planos & Preços

### Plano Startup
- **Setup**: €497
- **Mensalidade**: €49/mês (poupe 29% vs €69 original)
- **Inclui**: 1 Landing Page Premium, Copywriting, CRO, Alojamento, Suporte Email/WhatsApp, Design Exclusivo Ag47, SSL (grátis), Integração CRM/Email, Relatório Mensal, CDN Global (grátis)

### Plano Professional ⭐ (mais popular)
- **Setup**: €1.497
- **Mensalidade**: €149/mês (poupe 25% vs €199 original)
- **Inclui tudo do Startup mais**: Website até 5 páginas, Gestão de Tráfego Pago, SEO Avançado, Backups Diários, Gestor Dedicado, Painel Cliente Ag47, Heatmaps Mensal, Suporte Prioritário 24h, 10 Emails Profissionais (grátis), Automações de Marketing

### Plano Growth
- **Setup**: €2.997
- **Mensalidade**: €299/mês (poupe 25% vs €399 original)
- **Inclui tudo do Professional mais**: Ecossistema Digital Completo, Desenvolvimento SaaS/App Personalizada, Funis de Venda Complexos, Consultoria Estratégica Semanal, Infraestrutura Ilimitada, Blog/Conteúdo, Dashboards em Tempo Real, Segurança Enterprise, Apoio 24/7, Treino de Equipa Mensal

---

## Política de Trabalho & Garantias
- **Sem lock-in**: Código, domínio e infraestrutura pertencem sempre ao cliente
- **Transparência total**: Cliente tem acesso a todos os dados e métricas
- **Aprovação antes do lançamento**: Nada vai ao ar sem aprovação do cliente
- **Diagnóstico gratuito**: Sessão 15-30 min sem compromisso
- **30 dias de suporte**: Incluídos após lançamento
- **Sem templates**: Todos os projetos são desenvolvidos do zero

---

## FAQs Gerais

**Q: Como começo a trabalhar com a Ag47?**
A: Agenda uma sessão gratuita de diagnóstico pelo site (https://ag47.pt). Saímos com um plano claro.

**Q: Trabalham com clientes fora de Portugal?**
A: Sim, trabalhamos remotamente com clientes em Portugal, Brasil e resto do mundo.

**Q: Quanto tempo demora a entregar?**
A: Landing page: ~7 dias. Website completo: 2-3 semanas. MVP SaaS: ~4 semanas.

**Q: Fazem manutenção após a entrega?**
A: Sim, incluído nos planos mensais. 30 dias de suporte gratuito em projetos pontuais.

**Q: Qual é o próximo passo?**
A: Clicar em "Pedir Orçamento" ou "Agendar Diagnóstico" no site. Sem compromisso.
`
