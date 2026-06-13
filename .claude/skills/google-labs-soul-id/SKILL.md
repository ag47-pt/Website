---
version: 0.3.0
name: google-labs-soul-id
description: |
  Train a Subject Model — a personalized Imagen 3 model on a person's face or subject
  for identity-faithful image and video generation in Google Vertex AI.
  Use when: "create my Subject Model", "train my face", "make my digital twin",
  "learn my appearance", "create a character of me", "set up identity consistency".
  Chain: train subject (returns tuned_model_endpoint) → use in google-labs-generate
  with custom model endpoint for consistent character rendering.
argument-hint: "[name] [photo paths...]"
allowed-tools: Bash
---

# Google Labs Subject ID (Subject Tuning)

Fine-tune Imagen 3 on Vertex AI to learn a specific subject (e.g., face, character, or product) to allow identity-consistent generation.

## CLI Usage

Use the local CLI to automate the JSONL dataset formatting, GCS upload, and training trigger:

```bash
# Initiate Subject Tuning
python .agent/scripts/google_labs_cli.py subject-tuning \
  --name "moises_face" \
  --images "./photos/moises/" \
  --category "person"
```

Once the job successfully finishes, the CLI output will print the `Resource Name` or `Tuned Model Endpoint ID`. Use this endpoint ID as the model parameter for generations:

```bash
python .agent/scripts/google_labs_cli.py generate \
  --type image \
  --model "projects/menuag-app/locations/us-central1/endpoints/YOUR_TUNED_ENDPOINT_ID" \
  --prompt "A photo of moises_face wearing a suit, cinematic lighting" \
  --output "./moises_result.jpg"
```
