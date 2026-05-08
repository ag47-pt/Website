-- ============================================================
-- LEADS V2 MIGRATION — AG47 Leads Module Full Rebuild
-- Run this in the Supabase SQL editor (Database > SQL Editor)
-- ============================================================

-- 1. Add enriched columns to leads table
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS source              TEXT        DEFAULT 'chatbot',
  ADD COLUMN IF NOT EXISTS servico_interesse   TEXT,
  ADD COLUMN IF NOT EXISTS descricao_projeto   TEXT,
  ADD COLUMN IF NOT EXISTS orcamento_estimado  TEXT,
  ADD COLUMN IF NOT EXISTS urgencia            TEXT        DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS lead_score          INTEGER     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lead_temperature    TEXT        DEFAULT 'cold',
  ADD COLUMN IF NOT EXISTS tags                TEXT[]      DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS conversation_summary TEXT,
  ADD COLUMN IF NOT EXISTS chat_history        JSONB       DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS created_at          TIMESTAMPTZ DEFAULT NOW();

-- 2. Migrate viewed_at into created_at for existing rows that have it
UPDATE leads
SET created_at = viewed_at
WHERE created_at IS NULL AND viewed_at IS NOT NULL;

-- 3. Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. Allow anonymous users to INSERT (chatbot captures leads without auth)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leads' AND policyname = 'anon_insert_leads'
  ) THEN
    CREATE POLICY anon_insert_leads ON leads
      FOR INSERT TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- 5. Allow authenticated users full access (admin dashboard)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'leads' AND policyname = 'auth_full_access_leads'
  ) THEN
    CREATE POLICY auth_full_access_leads ON leads
      FOR ALL TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 6. Grant usage to anon role
GRANT SELECT, INSERT ON leads TO anon;
GRANT ALL ON leads TO authenticated;

-- Verify result
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
