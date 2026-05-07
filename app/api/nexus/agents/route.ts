/**
 * GET  /api/nexus/agents        → merged list (static built-ins + DB user agents)
 * POST /api/nexus/agents        → create a new DB agent
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { NEXUS_AGENTS, type NexusAgent } from '@/data/nexus-agents'

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase credentials not configured')
  return createClient(url, key)
}

/** Convert a DB row to the NexusAgent shape expected by the frontend */
function rowToAgent(row: Record<string, unknown>): NexusAgent {
  return {
    id:            String(row.slug),
    name:          String(row.name),
    desc:          String(row.description ?? ''),
    iconBg:        String(row.icon_bg ?? 'bg-info/10'),
    iconTxt:       String(row.icon_txt ?? 'text-info'),
    model:         String(row.model_label ?? row.model),
    providerValue: String(row.provider),
    modelValue:    String(row.model),
    status:        (row.status as NexusAgent['status']) ?? 'active',
    agentType:     (row.agent_type as NexusAgent['agentType']) ?? 'chat',
    tools:         Array.isArray(row.tools) ? (row.tools as NexusAgent['tools']) : [],
    systemPrompt:  String(row.system_prompt ?? ''),
    lastExec:      (row.created_at ? new Date(String(row.created_at)).toLocaleDateString('pt-PT') : '—'),
    lastStatus:    'DB',
    lastStatusCls: 'text-text-muted',
    health:        ['bg-success', 'bg-success', 'bg-success'],
    isReal:        false,
    metadata:      row.metadata as Record<string, unknown> | undefined,
  }
}

export async function GET() {
  try {
    const supabase = makeSupabase()
    const { data, error } = await supabase
      .from('nexus_agents')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error

    const dbAgents: NexusAgent[] = (data ?? []).map(rowToAgent)

    // Merge: built-in static agents first, then DB agents
    // DB agents that share an id with a static agent are skipped (can't override built-ins via DB)
    const staticIds = new Set(NEXUS_AGENTS.map((a) => a.id))
    const merged = [...NEXUS_AGENTS, ...dbAgents.filter((a) => !staticIds.has(a.id))]

    return NextResponse.json({ agents: merged })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[GET /api/nexus/agents]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      name, description = '', provider = 'google', model = 'gemini-2.5-flash',
      modelLabel = model, status = 'active', agentType = 'chat',
      systemPrompt = '', temperature = 0.7, maxTokens = 2048,
      tools = [], iconBg = 'bg-info/10', iconTxt = 'text-info',
    } = body as Record<string, unknown>

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Nome do agente obrigatório (mínimo 2 caracteres)' }, { status: 400 })
    }

    const slug = String(name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36)

    const supabase = makeSupabase()
    const { data, error } = await supabase
      .from('nexus_agents')
      .insert({
        slug,
        name:          String(name).trim(),
        description:   String(description).trim(),
        provider:      String(provider),
        model:         String(model),
        model_label:   String(modelLabel),
        status:        String(status),
        agent_type:    String(agentType),
        system_prompt: String(systemPrompt),
        temperature:   Number(temperature),
        max_tokens:    Number(maxTokens),
        tools,
        icon_bg:       String(iconBg),
        icon_txt:      String(iconTxt),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ agent: rowToAgent(data as Record<string, unknown>) }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[POST /api/nexus/agents]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
