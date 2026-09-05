---
version: 0.3.0
name: google-labs-product-photoshoot
description: |
  Generate brand-quality product images through Google Labs/Vertex AI product-photoshoot
  using Google Imagen 4.0 Ultra (imagen-4.0-ultra-generate-001) and virtual-try-on-001.
  Use when: "product photo", "studio shot", "lifestyle image", "Pinterest pin",
  "hero/banner", "carousel", "ad creative", "closeup with hands",
  "levitating/floating/splash product", "restyle", "seasonal/aesthetic variation".
  Modes: product_shot, lifestyle_scene, closeup_product_with_person,
  moodboard_pin, hero_banner, social_carousel, ad_creative_pack,
  virtual_model_tryout, conceptual_product, restyle.
argument-hint: "[--mode <mode>] [--count N] [prompt]"
allowed-tools: Bash
---

# Google Labs Product Photoshoot

Generate brand-quality, professional product photoshoots using Imagen 4.0 Ultra and specialized models.

## CLI Usage

### 1. Optimize & Enhance Prompt (Gemini-Powered)
Before sending the final prompt to the image model, expand it using the enhancer command:

```bash
python .agent/scripts/google_labs_cli.py enhance-prompt \
  --prompt "a bottle of juice on a wood table"
```

### 2. Generate Lifestyle Product Photoshoot (Imagen 4.0 Ultra)

```bash
python .agent/scripts/google_labs_cli.py generate \
  --type image \
  --prompt "[COPIAR PROMPT EXPANDIDO OBTIDO NO PASSO 1]" \
  --aspect-ratio "1:1" \
  --output "./photoshoot_result.jpg"
```

### 3. Virtual Model Tryout (Google Virtual Try-On 001)
To render clothing items worn by an AI-generated model:

```bash
python .agent/scripts/google_labs_cli.py generate \
  --type image \
  --model "virtual-try-on-001" \
  --prompt "A model wearing the input clothing item, walking on a Parisian street background" \
  --aspect-ratio "9:16" \
  --output "./tryon_model.jpg"
```
