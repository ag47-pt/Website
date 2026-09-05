---
version: 0.3.0
name: google-labs-studio
description: |
  Creative Director (Diretor de Criação) for sequential video campaigns in Google Labs/Vertex AI.
  Orchestrates storyboard scripting, keyframe visual continuity, and multi-scene video generation.
  Use when: "google labs studio", "crie um vídeo sequencial no google", "diretor de criação",
  "storyboard para veo", "gerar roteiro e vídeo", "continuidade visual".
  Acts as a wrapper that plans the narrative, generates scene-by-scene keyframes (Start/End images)
  using Google Imagen 4.0, and submits sequentially linked transition jobs to Google Veo 3.1.
argument-hint: "[theme-or-prompt] [--scenes N] [--type commercial|novela|promo]"
allowed-tools: Bash
---

# Google Labs Studio (Diretor de Criação)

This skill orchestrates sequential video generation using Google Labs (Imagen 4.0 + Veo 3.1) by enforcing visual continuity, storyboard consistency, and narrative fidelity.

---

## Technical Workflow & CLI Commands

### Phase 1 — Storyboard Planning
Create style guides and storyboard layouts before rendering.

### Phase 2 — Keyframe Generation
Generate keyframes locally using Imagen 4.0 Ultra (`google-labs-generate`):
- For Scene 1, generate start and end images.
- For Scene N, reuse the previous end image as the start frame.

### Phase 3 — Video Generation (Google Veo 3.1 Transitions)
Submit transitions via the local CLI:

```bash
# Animate from Scene Start Image to Scene End Image
python .agent/scripts/google_labs_cli.py generate \
  --type video \
  --prompt "Slow panning camera following the subject action" \
  --image-ref "./Scene_1_Start.jpg" \
  --last-frame "./Scene_1_End.jpg" \
  --aspect-ratio "16:9" \
  --output "./Scene_1_Video.mp4"
```
