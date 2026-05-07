-- ══════════════════════════════════════════════════════════════════
-- NexusAI Agents — Supabase Migration
-- Run this in the Supabase SQL editor once.
-- ══════════════════════════════════════════════════════════════════

-- Agents created / edited by users via the NexusAI dashboard.
-- "Built-in" agents (ag47-assistant, liquidity-flow-crypto) live in
-- code (data/nexus-agents.ts) and are merged at query time.

CREATE TABLE IF NOT EXISTS nexus_agents (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT          UNIQUE NOT NULL,
  name          TEXT          NOT NULL,
  description   TEXT          NOT NULL DEFAULT '',
  provider      TEXT          NOT NULL DEFAULT 'google',
  model         TEXT          NOT NULL DEFAULT 'gemini-2.5-flash',
  model_label   TEXT          NOT NULL DEFAULT 'Gemini 2.5 Flash',
  status        TEXT          NOT NULL DEFAULT 'active'
                              CHECK (status IN ('active','inactive','error')),
  agent_type    TEXT          NOT NULL DEFAULT 'chat'
                              CHECK (agent_type IN ('chat','cycle')),
  system_prompt TEXT          NOT NULL DEFAULT '',
  temperature   NUMERIC(3,2)  NOT NULL DEFAULT 0.70,
  max_tokens    INTEGER       NOT NULL DEFAULT 2048,
  tools         JSONB         NOT NULL DEFAULT '[]',
  icon_bg       TEXT          NOT NULL DEFAULT 'bg-info/10',
  icon_txt      TEXT          NOT NULL DEFAULT 'text-info',
  metadata      JSONB         NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION nexus_agents_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_nexus_agents_updated_at ON nexus_agents;
CREATE TRIGGER trg_nexus_agents_updated_at
  BEFORE UPDATE ON nexus_agents
  FOR EACH ROW EXECUTE FUNCTION nexus_agents_set_updated_at();

-- Row-Level Security — enable but allow anon/service access for now
ALTER TABLE nexus_agents ENABLE ROW LEVEL SECURITY;

-- Allow full access to the service role (API routes)
CREATE POLICY "service_role_all" ON nexus_agents
  AS PERMISSIVE FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow reads to authenticated users (future auth integration)
CREATE POLICY "authenticated_read" ON nexus_agents
  AS PERMISSIVE FOR SELECT
  TO authenticated
  USING (true);

-- ── Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_nexus_agents_slug   ON nexus_agents (slug);
CREATE INDEX IF NOT EXISTS idx_nexus_agents_status ON nexus_agents (status);

-- ── Health check ─────────────────────────────────────────────────
SELECT count(*) AS nexus_agents_rows FROM nexus_agents;
