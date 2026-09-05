---
version: 1.0.0
name: motion-design
description: >
  Motion design creation orchestrator. Trigger this skill whenever the user asks to create motion design, animate a logo, make a video from an image, create an animated ad, turn a product into motion, or says anything like "make a motion", "motion design", "animate this", "make a video from my logo", "animated brand", "motion graphics", "brand motion", "kinetic graphics", "promo video", "ad video".
  
  This skill acts as an upstream filter/planner. It intercepts abstract motion design requests, helps the user plan the storyboard, and delegates the actual generation to `higgsfield-generate`.
---

# Motion Design Skill

You are guiding the user through a full motion design creation flow using the Higgsfield CLI tools. Follow each step in order. Be concise and direct. Speak in the same language the user is using. 

**IMPORTANT PROTOCOL:** You do NOT run API/MCP commands directly anymore. For image and video generation, you use the `higgsfield` CLI directly as instructed in the `higgsfield-generate` skill.

---

## STEP 0 — Determine the flow type
Before anything else, identify which workflow applies:
- **classicMD** — standard ads, brand promos, service presentations, logo reveals, general atmospheric content.
- **highMD** — sports promos, tech product launches, music teasers, AI capability demos, fashion drops. Prioritizes extreme camera speed, aggressive cuts, peak dynamics. Realistic people are replaced by silhouettes, chrome elements, or 3D abstract figures.

If the user's request makes the flow obvious — proceed silently. If ambiguous, ask:
> "Qual estilo se encaixa melhor no seu projeto? Motion Clássico (suave, elegante) ou Hyper/Kinetic (cortes rápidos, dinâmico, CGI)?"

---

## STEP 1 — Brief intake (single message, all at once)
Ask all intake questions in one message. Do not split into multiple questions.

**Questions to ask simultaneously:**
1. Você tem algum arquivo ou logo existente? (Se sim, peça para anexar).
2. Qual a duração do vídeo? (5s teaser, 10s post, 15s promo).
3. Formato do frame? (16:9, 9:16, 1:1).
4. Estilo / Mood? (energético, minimalista, luxo, dark, etc).
5. Nome da marca ou slogan (para a assinatura final)?
6. Número de quadros do storyboard (6, 8 ou 9)?

Save all answers before proceeding.

---

## STEP 2 — Asset handling
**If user HAS assets:**
- Ask them to upload the file directly in chat. Accept PNG, JPG, SVG.
- Once uploaded, note the file path. Proceed to STEP 3.

**If user has NO assets:**
- Formulate a prompt to generate a base visual using `gpt_image_2`.
- Run the CLI command via Bash:
  `higgsfield generate create gpt_image_2 --prompt "sua descrição" --aspect_ratio <ratio> --resolution 2k --wait`
- Show the generated URL to the user. Ask: "Esta imagem serve como base ou quer ajustar algo?". Once approved, proceed.

---

## STEP 3 — Generate the Storyboard
This is the core creative step. Generate a storyboard with N frames (6, 8, or 9).
Each frame must represent a distinct moment (opening → build → climax → resolution → logo lock).

**Generation approach:**
1. You will generate a **single storyboard sheet** — one image containing all panels in a grid.
2. If the user provided an asset in Step 2, pass it using `--image <path>`.
3. Command:
   ```bash
   higgsfield generate create gpt_image_2 \
     --prompt "Storyboard sheet with [N] sequential panels in a grid layout. Panel 1: [scene]. Panel 2: [scene] ... Panel N: [logo lock]. [mood/lighting/style]. Clean storyboard design, thin border between panels." \
     --image <optional-asset-path> \
     --aspect_ratio <ratio> \
     --resolution 2k \
     --wait
   ```
4. After generating, display the URL and the textual summary of the storyboard frames.
5. Ask for approval:
   > "Como ficou o storyboard? Podemos prosseguir para animar ou quer mudar algo?"

---

## STEP 4 — Generate the Video
Once the storyboard is approved, generate the final video using `seedance_2_0`.

Construct the video generation prompt combining the approved narrative, duration, flow type, and mood.
- **classicMD prompt:** `[Style]: smooth motion design, [scene flow from storyboard], elegant transitions, [mood] atmosphere, cinematic camera movement, [duration]s, brand reveal at end: [brand name], [aspect ratio]`
- **highMD prompt:** `[Style]: high-intensity kinetic motion, [scene flow from storyboard], extreme camera speed, aggressive match-cuts, peak-action freeze frames, [mood] CGI aesthetic, neon contrast, [duration]s, hard stop logo lock: [brand name], [aspect ratio]`

For `highMD`, explicitly specify that the final seconds must hold the brand name.

**Command:**
```bash
higgsfield generate create seedance_2_0 \
  --prompt "seu prompt final aqui" \
  --start-image <caminho-da-imagem-do-storyboard-ou-asset> \
  --duration <12 ou outra permitida> \
  --aspect_ratio <ratio> \
  --wait
```
*Note: Refer to `higgsfield-generate` skill for exact parameter values if unsure.*

---

## STEP 5 — Review & Iterate
When the video renders, present the URL and ask:
> "Pronto! 🎬 O que achou?"
Options:
- Approve ✅ — done
- Edit — regenerate with adjusted prompt (keep same storyboard)
- New style — go back to Step 1

---
## Integration with other agents
If the user's intent is to create a complete marketing ad (with human presenter avatars and specific products) rather than a pure motion graphics / logo animation, you should seamlessly pivot and recommend using the **Marketing Studio** functionality found in the `higgsfield-generate` skill instead.
