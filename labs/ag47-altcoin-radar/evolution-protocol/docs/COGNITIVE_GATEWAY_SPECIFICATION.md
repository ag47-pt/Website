# Cognitive Gateway Specification

The Cognitive Gateway is the essential isolation layer between probabilistic intelligence (LLMs) and the deterministic Evolution Kernel. Artificial Intelligence cannot be allowed to act as an unconstrained authority within the protocol. Instead, it must be reduced to an "inference engine" that acts as a controlled proposer of data.

## 1. Flow of Information

**❌ Forbidden Flow:**
`Snapshot -> LLM -> architecture-gap.json`
*If the LLM writes directly to the official artifact, it effectively bypasses the protocol's authority.*

**✅ Required Flow:**
`Snapshot -> Cognitive Gateway -> LLM -> candidate-analysis.json -> Parser/Validator -> Kernel -> architecture-gap.json`
*The LLM writes a candidate. The Cognitive Gateway parses, extracts, and validates it. Only if it perfectly complies with the system rules does it get transformed into the official artifact.*

## 2. Gateway Responsibilities

### Context Assembly
The Gateway must construct the deterministic prompt envelope, feeding the LLM only the facts it needs:
- **System Prompt**: Loaded exactly as versioned from the Prompt Registry (`.evolution/prompts/`).
- **Input Artifacts**: Supplied in strict JSON format (e.g., `01_system_snapshot.json`).
- **Boundaries**: Clear JSON format enforcement for the LLM output.

### Artifact Translation
The LLM output (`candidate-analysis.json`) can be verbose, containing keys like `observations` or `reasoning`. The Gateway must:
1. Strip out the reasoning meta-data.
2. Extract the strict data (e.g., `candidate_gaps`).
3. Transform it into the official strict schema (`architecture-gap.json`).

### Fallback & Recovery
If the LLM outputs malformed JSON or invalid schema structures, the Gateway catches the exception locally and triggers a retry or yields a `FAILED` state to the Kernel, without corrupting the active task folder with broken artifacts.

## 3. Registries (Memory of Intent)

**Prompt Registry (`.evolution/prompts/`)**
Every cognitive agent behavior is driven by a system prompt. Prompts are treated as production code. Changing a prompt changes the agent's "laws of physics". Thus, prompts are stored as physical, auditable markdown files.

**Model Registry (`.evolution/models/`)**
A static ledger of which provider, model, and configuration (temperature, tokens) is approved for each agent. This ensures that in post-mortem audits, we know exactly *which* brain made a decision.
