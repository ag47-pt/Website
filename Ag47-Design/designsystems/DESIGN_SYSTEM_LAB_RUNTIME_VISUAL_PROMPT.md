# Design System Lab — Runtime Visual Real

## Prompt de implementação para Vision / Codex / Antigravity

### TAREFA: EVOLUIR O DESIGN SYSTEM LAB PARA UM RUNTIME VISUAL REAL

Antes de alterar qualquer código, faça reconnaissance do repositório atual.

**REPOSITÓRIO:** `ag47-pt/Website`

**IMPORTANTE:** Não trate esta tarefa como redesign geral do Labs. Não recrie o motor existente. Não substitua parser, normalizer, coverage, audit ou exporters sem necessidade comprovada. A tarefa é evoluir a experiência visual/runtime construída sobre a arquitetura atual.

## 1. Contexto e referência obrigatória

Antes de implementar, analise obrigatoriamente `Ag47-Design/`, em especial `Ag47-Design/designsystems/lime/Lima Design System.md` e `Ag47-Design/designsystems/lime/index.html`.

A pasta Ag47-Design deve servir como REFERÊNCIA CONCEITUAL E VISUAL para entender o que é um Design System completo; como regras documentadas viram interfaces reais; como tokens, tipografia, spacing, radius, grids, componentes, motion, iconografia e padrões alteram de verdade uma interface; como um Design System deve possuir identidade própria; e o que queremos que o “balcão” do Design System Lab consiga demonstrar.

NÃO copie o Lima para dentro do Lab. Use-o para entender a profundidade esperada do sistema.

O Lima Design System demonstra exatamente o problema que queremos resolver: um Design System não é apenas uma paleta de cores aplicada sobre componentes genéricos.

## 2. Problema atual

O Design System Lab já possui uma base importante:

`Markdown → parser → schema → normalizer → normalized design system → coverage/audit → renderer`

Preserve essa arquitetura.

Porém, o Runtime atual funciona principalmente como uma galeria técnica. Ele mostra hero de demonstração, feature grid, cards, botões, inputs, estados e padrões isolados. Isso é útil tecnicamente, mas produz uma experiência visual excessivamente genérica. Design Systems muito diferentes acabam parecendo variações do mesmo template.

Isso NÃO é aceitável.

O Lab não deve “desenhar por cima” do Design System. O Design System carregado deve controlar a aparência da experiência.

**REGRA CENTRAL: O DESIGN SYSTEM DEVE DESENHAR A PÁGINA. O LAB APENAS INTERPRETA E EXECUTA O DESIGN SYSTEM.**

## 3. Nova experiência: dois previews

Queremos manter DUAS experiências complementares.

### A. Preview estilizado / Workbench

Manter a experiência atual de bancada para inspeção técnica. Ela continua sendo útil para visualizar Foundations, Typography, Colors, Buttons, Forms, Cards, Components, States, Patterns, Accessibility, Spec, Audit e Coverage.

Essa área pertence ao AG47 Labs. Ela pode continuar dentro do layout do laboratório. Sua função é: “Quero inspecionar tecnicamente este Design System.”

Não eliminar o trabalho existente. Reorganizar quando necessário.

### B. Live Website / Runtime real

Adicionar uma nova experiência principal: “Quero ver um produto real construído com este Design System.”

Esse modo deve renderizar um WEBSITE COMPLETO e convincente usando exclusivamente as decisões disponíveis no Design System normalizado.

Exemplos de possíveis partes: Navbar, Hero, Social proof / metrics, Editorial section, Features, Product/service showcase, Cards, Content section, Testimonials, Pricing ou packages quando adequado, Form, FAQ, CTA e Footer.

ATENÇÃO: isso NÃO significa que todo Design System deve receber exatamente essas seções. A composição deve respeitar o perfil/padrões definidos pelo sistema.

Um sistema editorial não deve parecer um SaaS. Um sistema de commerce não deve parecer fintech. Um sistema de restaurante não deve parecer dashboard. Um sistema minimalista não deve virar uma coleção de cards. A estrutura também faz parte da identidade.

## 4. Princípio de fidelidade

**PROIBIDO INVENTAR UMA DECISÃO VISUAL QUANDO O DESIGN SYSTEM POSSUI UMA DEFINIÇÃO PARA ELA.**

Se o Design System define `button padding = 18px 28px`, o Runtime deve usar exatamente essa regra. NÃO usar `px-6 py-3` porque é um padrão conveniente do Tailwind.

O mesmo vale para padding, margin, gaps, radius, border, shadows, typography, font sizes, line height, letter spacing, colors, containers, grids, breakpoints, icon sizes, motion, navigation, card geometry, input geometry, section spacing e responsive behavior.

Evite decisões visuais hardcoded dentro do Runtime como `rounded-xl`, `rounded-2xl`, `shadow-lg`, `gap-6`, `px-6`, `py-4`, `bg-zinc-950`, `border-white/10`, `backdrop-blur` quando essas decisões deveriam vir da especificação.

Não queremos: `Design System → template genérico → troca de cores`.

Queremos: `Design System → interpretação → composição → website próprio`.

## 5. Fallbacks

Não invente estilos quando alguma definição estiver ausente. Fallback deve ser determinístico, documentado, neutro e previsível. Nunca use “o que parece bonito” como fallback.

Se um valor não está definido, preserve a semântica existente de `DEFINED`, `NOT_DEFINED`, `NOT_APPLICABLE`, `INHERITED`.

Quando o Runtime precisar obrigatoriamente de algo ausente, use um fallback técnico mínimo e registre que aquela decisão veio de fallback. O usuário deve conseguir distinguir `DEFINED BY DESIGN SYSTEM` de `RUNTIME FALLBACK`.

## 6. Presentation Profile

Analise se o schema atual consegue expressar suficientemente a composição visual de uma página. Caso NÃO consiga, faça a MENOR extensão arquitetural necessária.

Considere introduzir algo equivalente a:

```yaml
presentation:
  archetype: editorial | saas | commerce | fintech | restaurant | service | minimal | generic
  density: compact | balanced | spacious
  alignment: symmetric | asymmetric
  hero_style: centered | split | editorial | visual
  card_style: flat | bordered | elevated | image_led
  section_flow: linear | alternating | editorial | modular
  navigation_style: minimal | standard | prominent
  imagery_weight: none | low | medium | high
  decorative_style: none | restrained | expressive
```

Esses valores são exemplo de direção arquitetural. Antes de implementar cegamente, analise Ag47-Design e o schema atual e determine o menor contrato capaz de representar corretamente essa “gramática visual”.

Se adicionar esse conceito, versionar corretamente o contrato; preservar compatibilidade com `spec_version 1.0`; considerar `1.1` para a extensão; specs `1.0` devem continuar funcionando; informar warning/fallback quando presentation não existir; atualizar template, schema, types e normalizer; adicionar testes.

NÃO faça uma reescrita do pipeline para isso.

## 7. Separar Visual Grammar de Demo Content

Não misture identidade visual com conteúdo demonstrativo.

Considere separar `presentation` = como a interface se comporta visualmente; `demo_content` = qual domínio/conteúdo usamos para demonstrar.

Exemplo:

```yaml
demo_content:
  profile: saas | fintech | commerce | restaurant | service | editorial | generic
```

Isso permite que o Runtime apresente conteúdo plausível sem tentar inferir o negócio pela cor da interface. Nunca conclua “usa verde → deve ser fintech” ou qualquer inferência semelhante.

## 8. Website Showcase Engine

Crie uma arquitetura clara para a nova experiência, conceitualmente semelhante a:

`WebsiteShowcase → resolvePresentationProfile(spec) → resolveDemoContent(spec) → resolveSectionRecipe(profile) → SectionRegistry → DesignSystemRuntime`

Considere componentes como DemoNavbar, DemoHero, DemoSocialProof, DemoFeatures, DemoEditorial, DemoProductGrid, DemoServices, DemoMetrics, DemoTestimonial, DemoPricing, DemoForm, DemoFAQ, DemoCTA e DemoFooter.

MAS não monte sempre todos. Cada archetype deve possuir composição própria.

EDITORIAL: typography-led, menos cards, blocos de leitura, composição assimétrica, hierarquia editorial.

COMMERCE: category navigation, promotion, product grid, product cards, product CTA.

SAAS: product hero, interface/mockup area, metrics, product features, comparison, CTA.

FINTECH: trust, security, metrics, financial information, clean structured surfaces.

RESTAURANT: visual hero, menu highlights, dishes, story, reservation CTA.

SERVICE: proof, services, process, cases, packages, contact.

MINIMAL: typography-led, sparse composition, low decoration, fewer surfaces.

Essas diferenças devem ser ESTRUTURAIS. Não basta trocar classes CSS.

## 9. Live Runtime isolado do AG47

Este ponto é obrigatório.

O usuário deve conseguir visualizar o website fora da identidade visual do AG47.

Implementar uma opção semelhante a `OPEN LIVE` ou `ABRIR EXPERIÊNCIA`. Ela deve abrir o Runtime em nova aba/janela, por exemplo `/labs/skills/design-system/runtime/[session]` ou outra arquitetura melhor identificada durante reconnaissance.

Essa página NÃO deve herdar visualmente navbar AG47, sidebar AG47, typography AG47, background AG47, container AG47, iconografia decorativa AG47, theme AG47 ou CSS visual AG47.

Queremos uma superfície visual limpa.

**AG47 é o laboratório. O Runtime pertence ao Design System carregado.**

## 10. Mesmo Runtime dentro e fora do Lab

Não crie duas implementações.

Idealmente: `AG47 WORKBENCH → isolated preview → DesignSystemRuntime` e `Open Live → DesignSystemRuntime`.

O mesmo motor deve alimentar ambos. Para o preview interno, considere seriamente iframe isolation. Para Open Live, usar rota independente.

Avalie iframe versus Shadow DOM versus route isolation. Para website completo, prefira isolamento forte. O objetivo é impedir CSS leakage nos dois sentidos.

## 11. Navegação do Lab

Reorganize conceitualmente a experiência para algo próximo de `PREVIEW | COMPONENTS | SPEC | AUDIT`.

PREVIEW = website real.

COMPONENTS = bancada técnica atual.

SPEC = especificação.

AUDIT = cobertura, problemas e validação.

Dentro de PREVIEW: Desktop, Tablet, Mobile, Light / Dark somente quando suportados pelo Design System, e Open Live.

## 12. Não mostrar meta-informação dentro do website

O website demonstrativo NÃO deve mostrar coisas como “Hero Section Pattern”, “Feature Section Grid”, “Primary Button”, “Token”, “Design System”, “Zero LLM”, “Parsing Seguro”, “Cobertura Determinística”.

Essas informações pertencem ao laboratório. O website precisa parecer um website real. Use copy demonstrativa plausível. Não use Lorem Ipsum. Não transforme o website numa propaganda do próprio Design System Lab.

## 13. Segurança

Manter o princípio atual: Markdown é DATA. Markdown nunca deve virar código arbitrário.

Não executar HTML arbitrário, JavaScript, scripts, event handlers, React vindo do arquivo ou `dangerouslySetInnerHTML` com conteúdo não confiável.

O Runtime interpreta apenas estruturas conhecidas pelo schema.

## 14. Ag47-Design como benchmark

Depois da implementação, use `Ag47-Design/designsystems/lime/Lima Design System.md` como primeiro benchmark real. Compare também com `Ag47-Design/designsystems/lime/index.html`.

Não esperamos reprodução pixel-perfect do `index.html`. O objetivo é verificar se o Runtime consegue preservar a PERSONALIDADE do Lima.

Pergunta de validação: **“Se alguém conhecesse o Lima Design System, reconheceria sua identidade olhando apenas para o website gerado?”**

Se a resposta for não, o Runtime ainda está genérico demais.

## 15. Não destruir o que já funciona

Preservar parser, schema validation, normalizer, coverage, audit, exporters, upload, template download, presets existentes, viewport controls, spec inspection e testes existentes.

Modificar esses módulos somente quando necessário para suportar o novo contrato. Não reconstruir o Design System Lab do zero. Não fazer redesign geral do AG47 Labs. Não alterar partes não relacionadas.

## 16. Testes obrigatórios

Adicionar testes para deterministic presentation resolver; demo content resolver; fallback behavior; spec 1.0 compatibility; spec 1.1 se criada; missing presentation; invalid presentation; light/dark support; section recipe resolution; no arbitrary code execution; existing parser/normalizer behavior.

## 17. Validação visual

Depois de implementar, faça auditoria visual real.

Testar pelo menos 3 presets/design systems diferentes × Desktop, Tablet e Mobile. Gerar screenshots.

Critério fundamental: os três websites precisam ser VISUAL E ESTRUTURALMENTE diferentes à primeira vista. Se parecem “a mesma landing page com cores diferentes”, FAIL.

Também validar zero horizontal overflow, responsive correto, typography correta, spacing correto, radius correto, buttons corretos, cards corretos, containers corretos, motion coerente, dark/light quando definido, isolamento do AG47 e Open Live funcionando.

## 18. Critério de aceitação principal

Esta tarefa só recebe PASS se:

1. O Preview principal parecer um website real.
2. A bancada técnica continuar disponível separadamente.
3. O mesmo Runtime alimentar preview interno e Open Live.
4. Open Live possuir isolamento visual real do AG47.
5. Valores definidos pelo Design System forem obedecidos em vez de substituídos por defaults visuais do frontend.
6. Fallbacks forem neutros, determinísticos e identificáveis.
7. Design Systems diferentes produzirem páginas estruturalmente diferentes.
8. O Lima preservar claramente sua personalidade.
9. Specs antigas continuarem funcionando.
10. Parser, normalizer, audit, coverage e exporters não sofrerem regressões.

## 19. Regra final

NÃO resolva esta tarefa simplesmente “melhorando PatternsShowcase.tsx”. NÃO transforme o atual demo em uma landing page SaaS maior.

O que estamos criando é uma nova camada:

`DESIGN SYSTEM → NORMALIZED SPEC → VISUAL GRAMMAR → RUNTIME ENGINE → REAL WEBSITE EXPERIENCE`

A bancada atual passa a ser uma ferramenta de inspeção desse sistema.

Antes de escrever código:

1. faça reconnaissance;
2. leia Ag47-Design;
3. leia Lima Design System.md;
4. inspecione Lima index.html;
5. inspecione o Design System Lab atual;
6. identifique o menor delta arquitetural;
7. apresente o plano;
8. somente então implemente.

Ao terminar, entregue arquivos alterados, arquitetura final, mudanças no schema, compatibilidade mantida, testes executados, screenshots/auditoria visual, divergências encontradas, limitações restantes e verdict final PASS ou FAIL.

**BUILD PASSING NÃO SIGNIFICA TAREFA CONCLUÍDA.**

O objetivo não é fazer o código compilar.

**O objetivo é provar visualmente que o Design System realmente ganhou vida.**
