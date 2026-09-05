---
name: ag47-designer-labs-miniapps-frontpages
description: "B**UI**ld immersive, technical, and high-end UI/**UX** for Agência 47's experimental Labs sector. Provides the blueprint for mini-apps, landing pages, and interactive dashboards following the \"Labs Blueprint\" aesthetic."
skills:
  - frontend-design
  - clean-code
---

# Ag47 Labs Mini-Apps & Frontpages Designer

Skill focused on building immersive, technical, and high-end UI/UX for Agência 47's experimental sector (Labs). It provides the blueprint for creating mini-apps, landing pages, and interactive dashboards that follow the "Labs Blueprint" aesthetic.

> 🔴 **MANDATORY**: Before writing any Labs UI, read `resources/DESIGN_TOKENS.md` for all tokens, rules and patterns. Then check `examples/LabTemplate.tsx` as a starting reference.

## Visual Identity (Labs Blueprint)

- **Technical Atmosphere**: Blueprint grids, monospace fonts, and coordinate displays.
- **Section Naming Convention**: Use the 'Technical Registry' pattern for section identifiers (e.g., HeroRestagNode_Registry, MetricasRestag, InfosRestag, GastroEngineeringCycle, TechnicalMenuGrid). This reinforces the idea of a modular, system-based interface.
- **Glassmorphism**: Heavy use of `backdrop-blur-xl`, subtle borders (`border-white/10`), glass-shine animations, and glowing shadows reactive to the theme.
- **Domain Cleanliness (Foco de Domínio)**: O design, vocabulário e dados expostos devem estar 100% integrados ao escopo/nicho do mini-app (ex: puramente futebol e análise de valor em trades quantitativos, sem jargões de outros universos off-topic como cripto).
- **Dynamic Theming**: Real-time theme switching via interactive status indicators.
- **Glow & Atmosphere**: Deep ambient glows and nebula backgrounds.
- **Scroll Storytelling**: Visible progress indicators (Comet bar) and percentage counters.

## Core Components

### 1. The Hero System (Scalable Variations)

Every Labs page starts with the `<LabHero />` component. It now supports a **variant system** to maintain hierarchy across different levels of information depth.

#### ✅ Hero Variants

1. **`variant="full"` (Completa - Default)**:
   - **Visual**: Immersive 160vh scroll container with "suction" animation.
   - **Content**: Overtitle, Title, Description, Status Tags, Actions, and Media (Image, Video, or **Mosaic**).
   - **Mosaic Feature**: Pass `mosaicImages={['url1', 'url2', ... ]}` to render a technical 2x2 grid of thumbnails instead of a single image.
   - **Use Case**: Main landing nodes (e.g., `/restag`, `/labs/ia`).

2. **`variant="medium"` (Media)**:
   - **Visual**: Compact 50/50 split layout. No background suction animation.
   - **Content**: Text on the left, **Actions column on the right** (vertically centered). No image/video.
   - **Use Case**: Secondary sections or transitional nodes where actions are the priority.

3. **`variant="mini"` (Mini)**:
   - **Visual**: Minimal padding, no split.
   - **Content**: Overtitle, smaller title, and description.
   - **Use Case**: Interior documentation pages or sub-modules (e.g., individual skill pages).

#### 🧠 Rationale (The "Why")

- **Information Density**: Different levels of the app require different focus. `full` is for emotional/brand impact; `medium` is for functional efficiency; `mini` is for content consumption.
- **Visual Hierarchy**: Ensures the user understands where they are in the "system map" based on the visual weight of the hero.
- **Scalability**: Allows us to build complex hierarchies without overloading the user with high-intensity animations on every single sub-page.

```tsx
import { LabHero } from '@/app/labs/components';
import { Terminal, Play } from 'lucide-react';

// FULL VARIANT with MOSAIC
<LabHero 
  variant="full"
  overline="SYSTEM_LOADED"
  overlineIcon={Terminal}
  title="Restag"
  mosaicImages={['/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg']}
  description="Immersive **hospitality** node."
  actions={<button>Deploy</button>}
/>

// MEDIUM VARIANT (Split actions)
<LabHero 
  variant="medium"
  overline="INTERNAL_MODULE"
  overlineIcon={Terminal}
  title="Settings"
  description="Configure your **node** registry."
  actions={<button>Save Changes</button>}
/>
```

### 2. Lab Card System

Use the specialized cards from `@/app/labs/components`:

- **`<LabVisitCard />`**: For project showcases (imitates `/labs/dev`). Includes progress bars and specs.
- **`<LabCallCard />`**: For navigational links (imitates `/labs` landing). Includes large watermarks and technical corners.
- **`<LabInfoCard />`**: For technical notifications or info boxes (imitates "Projetos Sob Demanda").

#### ✅ MANDATORY: Overtitle Rule

Every card **MUST** display the folder path as an overtitle above the title. See `resources/DESIGN_TOKENS.md § 3` for full spec.

```tsx
// LabCallCard — pass the path prop
<LabCallCard 
  title="Dev Showcase"
  description="..."
  path="/labs/dev"   // ← renders as overtitle: ./labs/dev
  icon={<Code2 className="w-8 h-8" />}
  status="ACTIVE_SECTOR"
/>

// LabVisitCard — pass the prop (or falls back to /labs/sandbox/{slug})
<LabVisitCard 
  name="Alpha Interface"
  client="Agência 47"
  slug="alpha-ui"
  path="/labs/sandbox/alpha-ui"  // ← explicit path for overtitle
  ...
/>
```

#### ✅ MANDATORY: Dynamic Hover — Highlight Rule

Card titles MUST use the `--hover-color` CSS variable pattern. **Never** use Tailwind's `group-hover:text-primary`. See `resources/DESIGN_TOKENS.md § 4` for full spec.

The pattern is already implemented in `LabCards.tsx`. When building custom cards, replicate:

```tsx
// On the group container:
style={{ '--hover-color': theme.colors.primary } as React.CSSProperties}

// On the title:
className="... group-hover:bg-[var(--hover-color)] group-hover:text-black transition-all duration-500 inline-block"
```

All cards include:

- **Glass-shine (Shimmer Effect)**: Efeito de brilho de luz varrendo diagonalmente o card no hover:

  ```tsx
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
  </div>
  ```

- **Large Watermarks with Rotation**: Marca d'água posicionada no topo-direito com opacidade ultra-sutil (`0.03` a `0.08`) e rotação de `-rotate-12` que se endireita suavemente (`group-hover:rotate-0`) no hover.

- **Technical Corners**: Cantos técnicos usando a cor do tema com opacidade reduzida, reforçando a carcaça física da tela:

  ```tsx
  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-2xl opacity-30 border-[color:var(--theme-primary)]"></div>
  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-2xl opacity-30 border-[color:var(--theme-primary)]"></div>
  ```

- **Selo Perfect Outcome ("Perfect Predict/Success")**: Faixa absoluta no **canto INFERIOR DIREITO** para denotar acerto total (ex: 100% precisão ou "PERFECT PREDICT"). Cor primária do tema, texto preto. O arredondamento (`rounded-tl-2xl`) e a direção da sombra (`shadow-[-4px_-4px_...]`) devem ser ajustados para o canto inferior:

  ```tsx
  {isPerfectPredict && (
    <div className="absolute bottom-0 right-0 z-20 bg-[color:var(--theme-primary)] text-black px-4 py-1.5 rounded-tl-2xl font-mono text-[10px] font-black tracking-widest shadow-[-4px_-4px_20px_rgb(var(--theme-primary-rgb)_/_0.4)] flex items-center gap-1.5">
      <span>🎯</span> PERFECT PREDICT <span>⚽</span>
    </div>
  )}
  ```

  > ⚠️ **NUNCA coloque no canto superior direito** — conflitua com botões de ação (Dash, Edit, Delete).

- **Thematic Integration**: Uses `ThemeContext` colors automatically.
- **Entrance Animation**: Staggered `y: 20` fade-in with `viewport={{ once: true }}`.

### 3. Bottom-Sheet / Detail Overlay Pattern

For detail drawers or expanded views:

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="fixed bottom-0 left-0 right-0 h-[80vh] bg-[#0A0A0A]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl z-50 p-8"
    >
      <div className="max-w-4xl mx-auto space-y-6 overflow-y-auto h-full nexus-scrollbar">
        <h2 className="text-3xl font-bold font-mono"># PROJECT_LOG: {title}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="font-mono text-gray-400">--- BEGIN DETAILED_SPEC ---</p>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### 3b. Expand/Collapse de Itens de Aba (Padrão Labs Recomendado)

**Regra**: Toda aba densa (Ledger, Pendentes, Aprendizado) deve iniciar com seus itens **retraídos/escondidos** e exibir um único botão central animado que expande/retrai.

- **Estado Inicial**: Itens ocultos. Apenas o botão de ação central visível.
- **Botão Central Animado**: Use um ícone flutuante animado (emoji ⚽ girando com `animate-bounce` ou `animate-spin`), efeito shimmer infinito, e label dinâmico "Ver Previsões (N)" / "Recolher".
- **Botão permanece visível**: O botão de expandir/recolher NUNCA deve desaparecer quando os itens estão expandidos — reposicione-o abaixo dos itens ou como sticky.

```tsx
// Botão de Expand/Collapse animado
<button
  onClick={() => setIsExpanded(e => !e)}
  className="relative group mx-auto flex items-center gap-3 px-6 py-3 rounded-2xl border border-[rgb(var(--theme-primary-rgb)/_0.2)] bg-[rgb(var(--theme-primary-rgb)/_0.05)] hover:bg-[rgb(var(--theme-primary-rgb)/_0.12)] text-[color:var(--theme-primary)] font-mono text-sm transition-all overflow-hidden"
>
  {/* Shimmer infinito */}
  <div
    className="absolute inset-0 -translate-x-full w-[200%] bg-gradient-to-r from-transparent via-[rgb(var(--theme-primary-rgb)/_0.4)] to-transparent pointer-events-none mix-blend-screen opacity-60"
    style={{ animation: 'button-shimmer 3s infinite linear' }}
  />
  <span className={`text-xl ${isExpanded ? '' : 'animate-bounce'}`}>⚽</span>
  <span className="relative z-10">
    {isExpanded ? `Recolher Previsões` : `Ver Previsões (${count})`}
  </span>
</button>

// CSS global necessário:
// @keyframes button-shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
```

### 4. Scroll Experience

- **The Comet**: `ScrollProgressBar` attached to the bottom of the sticky header.
- **Percentage HUD**: A fixed bottom-right indicator showing the scroll progress starting from 47%.

### 5. Advanced Telemetry & Interactive SVGs (Cockpits)

Para módulos de análise avançada (Labs/Apex/Swarms), as interfaces devem parecer "painéis de controle" (Cockpits) com densidade de dados e responsividade:

- **SVGs Interativos & Confidence Areas**: Gráficos construídos com SVGs nativos. Use `<polygon>` com baixa opacidade (`opacity="0.03"`) ligando a base histórica a projeções futuras para criar "Cones de Variância" que mapeiam a dispersão visual do modelo.
- **SVG Area Charts**: Use preenchimentos degradê (`fill="url(#gradient)"`) de 5% a 0% de opacidade sob as linhas de histórico do gráfico para trazer mais profundidade sem ruído.
- **Micro-interações de Dados (Modais Glassmorphism)**: Use tabelas técnicas que, ao clicar, disparam modals / Bottom Sheets (`backdrop-blur-2xl`) revelando a telemetria aprofundada ou recomendação do agente (Deep Dives).
- **HUDs de Streaming em Tempo Real (SSE)**: Simule terminais de execução usando React e `TransformStream` via API (Server-Sent Events) para imprimir os logs operacionais do sistema na tela conforme os agentes processam os blocos de trabalho.
- **Glow Dinâmico Baseado em Dados**: Em vez de cores estáticas, passe cores baseadas no "viés" dos dados (ex: `$biasColor` = verde ou vermelho) para dentro de atributos `box-shadow` e `style={{ color }}` para criar glows temáticos vibrantes (`box-shadow: 0 0 15px ${biasColor}33`).
- **Gráficos side-by-side**: Quando exibir dois gráficos relacionados (ex: Hit Rate + Calibração), renderize-os em grid `grid-cols-1 md:grid-cols-2` no mesmo card/sessão. Nunca separe em abas distintas para dados complementares.

### 6. Interactive Navigation Pipelines & Shimmer Buttons

Para dar dinamismo a abas de controle de painel ou passos de pipeline:

- **Pipeline Animado**: Substitua o fluxo fixo por um pipeline reativo às abas do painel que utiliza `framer-motion` para guiar visualmente o foco do usuário:

  ```tsx
  const steps = [
    { n: '01', label: 'ANALISAR', targetTab: 'today' },
    { n: '02', label: 'BUSCAR RESULTADOS', targetTab: 'pending' },
    ...
  ];
  
  // Elemento do Step:
  <motion.div 
    animate={{
      backgroundColor: isActive ? 'rgba(var(--theme-primary-rgb), 0.15)' : 'rgba(255, 255, 255, 0.03)',
      borderColor: isActive ? 'rgba(var(--theme-primary-rgb), 0.4)' : 'rgba(255, 255, 255, 0.05)',
      scale: isActive ? 1.05 : 1
    }}
    className="relative flex items-center gap-2 px-4 py-2 rounded-xl border"
  >
    {isActive && (
      <motion.div
        layoutId="pipeline-glow"
        className="absolute inset-0 rounded-xl bg-[color:var(--theme-primary)] blur-md opacity-20"
      />
    )}
    ...
  </motion.div>
  ```

- **Conectores de Feixe de Luz (Laser Connectors)**: Crie conexões horizontais entre etapas do pipeline que fluam energia dinamicamente em loop infinito apenas quando a etapa anterior estiver ativa:

  ```tsx
  <div className="w-8 md:w-12 h-[2px] rounded-full overflow-hidden bg-white/5 relative">
    {isActive && (
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--theme-primary)] to-transparent opacity-80"
      />
    )}
  </div>
  ```

- **Shimmer Buttons (Botões de Alta Ação)**: Para ações críticas ou pendentes, use shimmer infinito em loop para guiar o olhar do usuário de forma premium:

  ```tsx
  <button className="relative overflow-hidden group/btn px-3 py-1.5 bg-[rgb(var(--theme-primary-rgb)_/_0.1)] hover:bg-[rgb(var(--theme-primary-rgb)_/_0.2)] border border-[rgb(var(--theme-primary-rgb)_/_0.2)] rounded-lg text-[color:var(--theme-primary)] text-xs font-medium transition">
    <div 
      className="absolute inset-0 -translate-x-full w-[200%] bg-gradient-to-r from-transparent via-[rgb(var(--theme-primary-rgb)_/_0.6)] to-transparent pointer-events-none mix-blend-screen opacity-70"
      style={{ animation: 'button-shimmer 2.5s infinite linear' }}
    />
    <span className="relative z-10 flex items-center gap-2">Buscar Resultados</span>
  </button>
  ```

  > ⚙️ **CSS Global Obrigatório** para shimmer funcionar:
  > ```css
  > @keyframes button-shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
  > ```
  > Velocidade ideal: **2.5s–3s** (mais lento = mais premium). Nunca use velocidade < 2s.

- **Premium Action Buttons com Mouse Tracking Neon**: Para botões de destaque primário (ex: "Buscar Jogos do Dia"), use borda neon bicolor que segue o cursor via `onMouseMove`:

  ```tsx
  // No container pai, capture a posição do mouse:
  onMouseMove={(e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  }}

  // No botão, use backgroundImage com radial-gradient na borda:
  style={{
    border: '1px solid transparent',
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), radial-gradient(circle 100px at var(--mouse-x, 0px) var(--mouse-y, 0px), var(--theme-primary), var(--theme-secondary), transparent)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    boxShadow: '0 0 15px rgba(var(--theme-primary-rgb), 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
  }}
  ```

  > 🧠 **Mirror/Reflexo Periódico**: Adicione um segundo shimmer que dispara a cada 7 segundos com `setInterval`, usando `opacity` controlada via `useRef`, para criar o efeito de reflexo lento que varre o botão periodicamente. Velocidade entre **2s–4s** para o reflexo.
  > ```tsx
  > const mirrorRef = useRef<HTMLDivElement>(null);
  > useEffect(() => {
  >   const interval = setInterval(() => {
  >     mirrorRef.current?.classList.add('animate-mirror');
  >     setTimeout(() => mirrorRef.current?.classList.remove('animate-mirror'), 3000);
  >   }, 7000);
  >   return () => clearInterval(interval);
  > }, []);
  > ```

## Project Structure & Implementation

### 7. Dynamic HUD Navigation (Context-Aware)

Every immersive app MUST use a context-aware navigation system (HUD).

- **Architecture**: Refactor the page layout into a `RestagLayout` (or similar) that accepts a `navItems` array.
- **Components**: The HUD consists of `RoundHUDIcon` buttons with tooltips.
- **Interaction**: Use an `IntersectionObserver` in the Layout to automatically highlight the current section.
- **Scroll Alignment**: Use a global `offset` of **50px** in navigation functions to center content perfectly below the fixed header.

```tsx
const NAV_ITEMS = [
  { id: 'hero', label: 'START_NODE', icon: Terminal },
  { id: 'metrics', label: 'LIVE_TELEMETRY', icon: Activity },
  { id: 'form', label: 'DEPLOY_REQUEST', icon: Send },
];

export default function App() {
  return (
    <RestagLayout navItems={NAV_ITEMS}>
      {/* Page Content with matching IDs */}
    </RestagLayout>
  );
}
```

### 7b. Sticky Header Colapsável (Padrão Sticky-Collapse Labs)

Para mini-apps com painel de abas e pipeline superior, use um bloco sticky único que **colapsa ao rolar para baixo** e **expande ao rolar para cima** (ou ao clicar).

**Regras obrigatórias**:
1. O header sticky deve conter: logo + path, seletor de modelo IA, abas de navegação, e pipeline de etapas — tudo em um bloco único.
2. O colapso deve ser suave via `framer-motion` com `height: 0 → auto`.
3. Quando **recolhido**, ao clicar no botão central das abas, avançar para a próxima aba em ordem crescente (1→2→3→4→1), sem precisar expandir o header.
4. O botão de toggle (expand/collapse) deve ter ícone claramente distinguível: `ChevronDown` expandido, `ChevronUp` recolhido — ou `Menu`/`X`.
5. **NUNCA** use `position: absolute` dentro do sticky; use `position: sticky top-0 z-50`.

```tsx
// Padrão de detecção de scroll para auto-collapse
const [isCollapsed, setIsCollapsed] = useState(false);
const lastScrollY = useRef(0);

useEffect(() => {
  const handleScroll = () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY.current && currentY > 120) {
      setIsCollapsed(true);  // rolando para baixo → colapsa
    } else if (currentY < lastScrollY.current) {
      setIsCollapsed(false); // rolando para cima → expande
    }
    lastScrollY.current = currentY;
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

// Ao clicar nas abas com header colapsado → avançar automaticamente
const handleTabClickCollapsed = () => {
  const tabOrder = ['today', 'pending', 'ledger', 'learning'];
  const nextIndex = (tabOrder.indexOf(tab) + 1) % tabOrder.length;
  setTab(tabOrder[nextIndex]);
};
```

### Dynamic Backgrounds

Use a combination of:

1. **Blueprint Grid**: Fixed background with a repeating grid pattern.
2. **Nebula Image**: Low-opacity nebula image (`opacity-30`).
3. **Ambient Glows**: Large blurred circles using `theme.colors.primary`.

### Theme-Reactive Color Usage

- **Use `style={{ color: theme.colors.primary }}`** for accent text, overtitles, and icons (NOT Tailwind `text-primary`).
- **Use `style={{ backgroundColor: theme.colors.primary }}`** for highlight backgrounds.
- **Use CSS variable `--hover-color`** for group-hover effects to remain reactive.

### Card Opacity & Theme Adherence Rules

> 🔴 **Obrigatório** — Violações causam visual quebrado.

1. **Fundo de card NUNCA completamente transparente**: Use mínimo `bg-black/40` (40% opacidade preta). Cards com `bg-black/10` ou menos ficam invisíveis sobre fundos nebulares.
2. **Nunca use cores hardcoded (ex: `text-green-400`, `border-green-500`)** em mini-apps que têm `ThemeContext`. Sempre use `var(--theme-primary)` e `var(--theme-primary-rgb)`.
3. **Marcas d'água de ícone**: Toda tela Labs deve ter um ícone grande de fundo (watermark) em `opacity-[0.03]` a `opacity-[0.06]`, com `rotate-12` que suaviza para `group-hover:rotate-0`.
4. **Isolamento de App**: Mini-apps dentro de `/labs` devem remover o chatbox flutuante global e o navbar principal da plataforma, apresentando navegação própria isolada.
5. **Glassmorphism de seção**: Blocos de controle (pipelines, headers, menus de abas) DEVEM usar `backdrop-blur-xl bg-black/40 border border-white/10` para criar o efeito de painel de vidro coeso.

## Project Setup (Path Aliases)

To ensure proper resolution of the `@/` alias in the `.agent` directory, ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["**/*.ts", "**/*.tsx", ".agent/**/*.tsx"]
}
```

## Design Tokens Reference

Refer to `resources/DESIGN_TOKENS.md` for all tokens. Key references:

- **Primary Colors**: Main interaction and highlight color.
- **Card Overtitle**: Font Mono, UPPERCASE, 9-10px, tracking 0.1-0.2em, primary color.
- **Card Hover**: `--hover-color` CSS var, `bg-[var(--hover-color)] text-black`, `duration-500`.
- **Watermarks**: Opacity `0.05` to `0.15`, size `w-48` to `w-72`.
- **Animations**: Standard durations — entrance `0.8s`, hover `0.5s`, watermark `0.7s`.
- **Shimmer Speed**: `2.5s–3s` para botões de ação (loop infinito), `2s–4s` para reflexo periódico (7s interval).

## When to use this skill

- Creating a new tool/mini-app within `/labs`.
- Building a new showcase or portal page.
- Refactoring existing pages to follow the latest Labs design system.
- Implementing interactive theme-dependent UI.
- Adding new card types that must follow the overtitle and hover rules.
- Building dense information tabs (Ledger, Pending) with expand/collapse behavior.
- Implementing sticky headers with auto-collapse on scroll.
- Adding mouse-tracking neon borders to primary CTA buttons.
