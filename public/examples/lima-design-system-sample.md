---
spec_version: "1.1"
name: "Lima Design System"
version: "1.2.0"
platform: "web"
description: "High contrast, full energy. Sistema construído sobre verde limão (#C2F500), violeta vibrante (#A855F7), preto e branco."
theme: "lime-dark"
supported_modes: "both"
author: "Agência 47 Design Studio"
last_updated: "2026-06-15"
presentation:
  archetype: "saas"
  density: "balanced"
  alignment: "symmetric"
  hero_style: "split"
  card_style: "bordered"
  section_flow: "alternating"
  navigation_style: "prominent"
  imagery_weight: "high"
  decorative_style: "expressive"
demo_content:
  profile: "saas"
  brand_name: "Lima Voice Platform"
  tagline: "High contrast, full energy. Clonagem de voz neural com síntese em tempo real."
  eyebrow: "LIMA NEURAL AUDIO V1.2"
  headline: "Clonagem de Voz Hiper-Realista com Menos de 3 Segundos de Áudio"
  description: "Gere vozes emotivas, duble conteúdos em 40 idiomas e integre em tempo real com latência inferior a 80ms através do motor neural Lima."
  cta_primary: "Experimentar Síntese Grátis"
  cta_secondary: "Ouvir Demonstrações de Áudio"
---

# Lima Design System

> **Brand Library** · v1.2 — *High contrast, full energy.*

---

## 1. Identidade & Princípios
id: identity
status: DEFINED

### Princípios
- Alto Contraste & Energia: Combinação ousada de verde limão elétrico sobre fundos pretos profundos.
- Tipografia Técnica com Alma: Space Grotesk para autoridade em títulos e Hanken Grotesk para legibilidade impecável no corpo.
- Vermelho Estritamente Semântico: O vermelho (#FF463A) é reservado exclusivamente para alertas e erros críticos, nunca de forma decorativa.
- Resposta Instantânea: Transições rápidas e precisas entre 60ms e 200ms que transmitem velocidade de execução.

### Direção Visual
Interface técnica de alta densidade visual, com bordas sutis (#2A2A2A), superfícies escuras (#151515 / #1E1E1E) e realces pontuais com a dupla complementar Lime (#C2F500) e Purple (#A855F7).

### Boas Práticas (DO)
- Usar Lime para botões primários, badges de destaque e anéis de foco ativo.
- Usar Purple (#A855F7) para ações secundárias de alto contraste ou tags de categoria.
- Preservar raio de 12px em botões e 18px em cards e contêineres principais.

### O Que Evitar (DON'T)
- Nunca usar vermelho para botões primários ou detalhes decorativos.
- Não misturar fontes serifadas ou itálicas genéricas fora do par Space/Hanken Grotesk.
- Não utilizar sombras difusas coloridas que comprometam o contraste de acessibilidade WCAG AA.

---

## 2. Cores da Marca & Superfícies
id: colors.brand
status: DEFINED

| Token Key | Nome | Valor Claro | Valor Escuro | Uso Principal | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| primary | Lime | #C2F500 | #C2F500 | Ação principal, CTAs, energia e foco | DEFINED |
| secondary | Purple | #7C3AED | #A855F7 | Ação secundária, contraste e categorias | DEFINED |
| accent | Purple Accent | #7C3AED | #A855F7 | Destaques complementares e badges | DEFINED |
| background | Background Base | #FFFFFF | #0A0A0A | Fundo base de toda a aplicação | DEFINED |
| surface | Surface | #FAFAFA | #151515 | Superfície de cards e painéis | DEFINED |
| surface_elevated | Surface Elevated | #F4F4F5 | #1E1E1E | Modais, dropdowns e cards flutuantes | DEFINED |
| text_primary | Text Primary | #0A0A0A | #FFFFFF | Títulos e leitura primária de alto contraste | DEFINED |
| text_secondary | Text Secondary | #52525B | #A1A1AA | Descrições secundárias e subtítulos | DEFINED |
| text_muted | Text Muted | #71717A | #71717A | Legendas, metadados e números de apoio | DEFINED |
| border | Border Subtitle | #E4E4E7 | #2A2A2A | Linhas de divisão e contornos de cards | DEFINED |
| success | Success Emerald | #10B981 | #10B981 | Confirmações e status positivo | DEFINED |
| warning | Warning Amber | #F59E0B | #F59E0B | Alertas intermediários | DEFINED |
| error | Critical Red | #E11D26 | #FF463A | Erros críticos e estados destrutivos | DEFINED |
| info | Info Blue | #3B82F6 | #38BDF8 | Informações e novidades | DEFINED |

---

## 3. Escala Tipográfica
id: typography
status: DEFINED

| Nível | Família | Tamanho | Peso | Line Height | Tracking | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| display | 'Space Grotesk', sans-serif | 56px | 700 | 1.05 | -0.04em | DEFINED |
| h1 | 'Space Grotesk', sans-serif | 40px | 700 | 1.1 | -0.03em | DEFINED |
| h2 | 'Space Grotesk', sans-serif | 30px | 700 | 1.15 | -0.02em | DEFINED |
| h3 | 'Space Grotesk', sans-serif | 22px | 600 | 1.25 | -0.02em | DEFINED |
| section_title | 'Space Grotesk', sans-serif | 20px | 600 | 1.3 | -0.01em | DEFINED |
| card_title | 'Space Grotesk', sans-serif | 18px | 600 | 1.3 | 0 | DEFINED |
| body | 'Hanken Grotesk', sans-serif | 16px | 400 | 1.6 | 0 | DEFINED |
| secondary_body | 'Hanken Grotesk', sans-serif | 14px | 400 | 1.5 | 0 | DEFINED |
| caption | 'Hanken Grotesk', sans-serif | 13px | 400 | 1.4 | 0 | DEFINED |
| label | 'Space Grotesk', sans-serif | 13px | 600 | 1.3 | 0.02em | DEFINED |
| button | 'Space Grotesk', sans-serif | 14px | 700 | 1.2 | 0 | DEFINED |
| price | 'Space Grotesk', sans-serif | 28px | 700 | 1.1 | -0.02em | DEFINED |
| metadata | 'Space Grotesk', sans-serif | 11px | 600 | 1.3 | 0.05em | DEFINED |

---

## 4. Espaçamento & Gaps
id: spacing
status: DEFINED
base_unit: 4px
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 40px
section_spacing: 80px
container_padding: 32px

---

## 5. Raios de Arredondamento (Border Radius)
id: radius
status: DEFINED
xs: 4px
sm: 8px
md: 12px
lg: 18px
full: 999px

---

## 6. Sombras & Elevação
id: elevation
status: DEFINED
sm: 0 1px 2px rgba(0,0,0,0.4)
md: 0 4px 12px rgba(0,0,0,0.5)
lg: 0 12px 32px rgba(0,0,0,0.6)
focus_ring: 0 0 0 3px rgba(194, 245, 0, 0.35)

---

## 7. Bordas
id: borders
status: DEFINED
width: 1px
style: solid
color_token: border

---

## 8. Containers & Breakpoints
id: containers
status: DEFINED
max_width_sm: 640px
max_width_md: 768px
max_width_lg: 1024px
max_width_xl: 1200px

---

## 9. Motion & Transições
id: motion
status: DEFINED
duration_fast: 60ms
duration_normal: 200ms
duration_slow: 400ms
easing_default: cubic-bezier(0.4, 0, 0.2, 1)

---

## 10. Botões
id: component.button_primary
status: DEFINED
category: button
name: Botão Primário Lime
radius: 12px
padding: 12px 24px
font_token: button

### Estados
- default: bg=#C2F500, text=#0A0A0A, border=none, font_weight=700
- hover: bg=#D1FF00, transform=translateY(-1px)
- active: transform=translateY(0)
- disabled: opacity=0.4, cursor=not-allowed

---

## 11. Botão Secundário Purple
id: component.button_secondary
status: DEFINED
category: button
name: Botão Secundário Purple
radius: 12px
padding: 12px 24px
font_token: button

### Estados
- default: bg=#1E1E1E, text=#FFFFFF, border=1px solid #2A2A2A
- hover: border=1px solid #A855F7, text=#A855F7
- active: bg=#151515

---

## 12. Cards
id: component.card_primary
status: DEFINED
category: card
name: Card Base Lima
radius: 18px
padding: 24px
shadow: md

### Estados
- default: bg=#151515, border=1px solid #2A2A2A
- hover: border=1px solid #C2F500, transform=translateY(-2px)

---

## 13. Acessibilidade & Responsividade
id: accessibility
status: DEFINED
wcag_target: AA
color_contrast_min: 4.5:1
keyboard_navigable: true
screen_reader_tested: true
responsive_strategy: mobile_first
