---
description: High-end 3D scroll page creation workflow. Orchestrates the 3D Animation Specialist agent and uses the premium-3d-scroll-page skill to build immersive landing pages.
---

# /create-3d - Build Immersive 3D Experiences

This command initiates a specialized creative workflow for building premium 3D scroll-triggered landing pages.

## 🔄 The Creative Cycle

### Phase 1: Creative Discovery & Concept
- **Agent**: `project-planner` + `3d-animation-specialist`
- **Goal**: Define the "Astral" journey and the core 3D object.
- **Actions**:
  - Analyze brand identity and audience.
  - Select a "Radical Style" (Brutalist, Liquid Digital, Bauhaus, etc.).
  - Decide between **Real-time WebGL** vs **Hybrid Video Strategy**.
- **🚧 GATE 1 (Design Commitment)**: Present the "Design Commitment" block to the user. Approval is required before coding.

### Phase 2: Scene Scaffolding
- **Agent**: `3d-animation-specialist`
- **Goal**: Set up the environment and SSR-safe loader.
- **Actions**:
  - Implement `Basic3DSceneLoader` (SSR: false).
  - Configure the Canvas, Lights, and Background (Stars, Fog, Vignette).
  - Load the primary 3D model or video asset.
- **🚧 GATE 2 (SSR Stability)**: Verify no hydration errors and scene renders correctly.

### Phase 3: Interactive Logic (Lerp & Scroll)
- **Agent**: `3d-animation-specialist` + `performance-optimizer`
- **Goal**: Implement smooth, weighted motion.
- **Actions**:
  - Implement `ScrollManager` with **Lerp Physics** (factor: 0.05 - 0.1).
  - Define scroll-triggered ranges for each scene/card.
  - Bind scroll progress to 3D rotation, scale, or camera position.
- **🚧 GATE 3 (Physics Check)**: Animation must feel "weighted," not robotic.

### Phase 4: Motion Choreography & UI
- **Agent**: `frontend-specialist` + `3d-animation-specialist`
- **Goal**: Build the glassmorphism UI and staggered reveals.
- **Actions**:
  - Create `ScrollingCard` components with `backdrop-blur`.
  - Add **Staggered Reveals** for text and buttons.
  - Implement **Typewriter Effects** for headlines.
  - Apply technical typography (`font-mono`, tracking).
- **🚧 GATE 4 (Narrative Flow)**: Review the "scroll journey" to ensure smooth transitions between phases.

### Phase 5: Optimization & Launch
- **Agent**: `performance-optimizer` + `seo-specialist`
- **Goal**: Final polish and production readiness.
- **Actions**:
  - Optimize textures (WebP conversion).
  - Adjust `dpr` for mobile performance.
  - Implement SEO best practices (Meta tags, Sitemap).
- **🚧 GATE 5 (Final Audit)**: Run `npm run build` and verify lighthouse scores.

---

## Usage Examples

```
/create-3d astronaut floating in space with service cards
/create-3d premium dashboard for a saas landing page
/create-3d cinematic journey through a tech motherboard
```

## Mandatory Skill Loading
- Always load `premium-3d-scroll-page` skill.
- Reference `visual-effects.md` and `animation-guide.md` from `frontend-design` skill.
