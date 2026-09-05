---
version: 0.3.0
name: google-labs-generate
description: |
  Generate images and videos using Google's ecosystem (Imagen 3/4.0 and Veo).
  Uses Google GenAI SDK (google-genai) wrapper CLI to trigger and poll generation jobs.
  Use when: "generate an image", "make a video", "image-to-video",
  "produce a clip", "create an ad", "score this video", "analyze hook strength".
  Models used: imagen-4.0-ultra-generate-001, veo-3.1-generate-001, and gemini-2.5-flash for analysis.
argument-hint: "[prompt] [--model <name>] [--image|--video <path>]"
allowed-tools: Bash
---

# Google Labs Generate

Submit jobs to Google's media generation models (Imagen 4.0 Ultra and Veo 3.1) using the local CLI helper.

## Usage

### 1. Generating Images (Imagen 4.0 Ultra)

```bash
# Default Ultra generation (equivalent to Nano Banana Pro / GPT Image 2)
python .agent/scripts/google_labs_cli.py generate \
  --type image \
  --prompt "A futuristic neon city at sunset, highly detailed, 8k" \
  --aspect-ratio "16:9" \
  --output "./neon_city.jpg"

# Fast generation (equivalent to Z Image)
python .agent/scripts/google_labs_cli.py generate \
  --type image \
  --model "imagen-4.0-fast-generate-001" \
  --prompt "A fast sketch of a racing car" \
  --output "./racing_car.jpg"
```

### 2. Generating Videos (Google Veo 3.1)

```bash
# General video generation
python .agent/scripts/google_labs_cli.py generate \
  --type video \
  --prompt "A cute puppy playing in the grass, cinematic motion" \
  --aspect-ratio "16:9" \
  --output "./puppy.mp4"

# Fast/lite video generation
python .agent/scripts/google_labs_cli.py generate \
  --type video \
  --model "veo-3.1-lite-generate-001" \
  --prompt "A low fidelity fast draft of wind blowing through leaves" \
  --output "./draft.mp4"
```

### 3. Video Analysis & Scoring (Gemini 2.5 Flash)

```bash
python .agent/scripts/google_labs_cli.py generate \
  --type analyze \
  --video-ref "./marketing_ad.mp4"
```
