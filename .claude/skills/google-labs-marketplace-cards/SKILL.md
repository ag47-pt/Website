---
version: 0.3.0
name: google-labs-marketplace-cards
description: |
  Generate marketplace product image cards through Google Labs/Vertex AI: compliant
  main image, secondary product images, and A+ style content modules. Use when
  the user asks for marketplace listing images, product detail cards,
  secondary product images, product infographics, lifestyle listing shots,
  A+ style content, marketplace image sets, or sales-ready product visuals.
  Uses Google Imagen 4.0 Ultra (imagen-4.0-ultra-generate-002) for high-fidelity rendering.
argument-hint: "[--scope main|product-images|aplus|full-set] [prompt]"
allowed-tools: Bash
---

# Google Labs Marketplace Cards

Create marketplace-ready product visuals (Amazon, Shopify, Mercado Livre) using Google Imagen 4.0 Ultra.

## CLI Usage

### 1. Main Listing Image (Pure White Background)

```bash
python .agent/scripts/google_labs_cli.py generate \
  --type image \
  --prompt "A professional marketplace listing main image of the product, isolated on a solid pure white background (RGB 255,255,255), soft studio lighting, commercial product catalog photo" \
  --aspect-ratio "1:1" \
  --output "./main_listing.jpg"
```

### 2. Secondary Lifestyle Listing Image

```bash
python .agent/scripts/google_labs_cli.py generate \
  --type image \
  --prompt "A lifestyle product photo of the product in a minimalist modern bathroom setting, marble background, cinematic depth of field" \
  --aspect-ratio "1:1" \
  --output "./lifestyle_listing.jpg"
```
