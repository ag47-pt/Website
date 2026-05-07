/**
 * GET    /api/nexus/agents/[id]  → get a single DB agent
 * PATCH  /api/nexus/agents/[id]  → update a DB agent (not built-ins)
 * DELETE /api/nexus/agents/[id]  → delete a DB agent (not built-ins)
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { NEXUS_AGENTS } from '@/data/nexus-agents'

function makeSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase credentials not configured')
  return createClient(url, key)
}

/** Guard: built-in agents cannot be mutated via the API */
function isBuiltIn(id: string): boolean {
  return NEXUS_AGENTS.some((a) => a.id === id)
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  try {
    const supabase = makeSupabase()
    const { data, error } = await supabase
      .from('nexus_agents')
      .select('*')
      .eq('slug', id)
      .single()

    if (error?.code === 'PGRST116') {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 })
    }
    if (error) throw error

    return NextResponse.json({ agent: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (isBuiltIn(id)) {
    return NextResponse.json(
      { error: 'Agentes integrados não podem ser editados via API.' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()

    // Only allow safe field updates — never overwrite id/slug/created_at
    const allowed = [
      'name', 'description', 'provider', 'model', 'model_label', 'status',
      'agent_type', 'system_prompt', 'temperature', 'max_tokens', 'tools',
      'icon_bg', 'icon_txt', 'metadata',
    ] as const
    type Allowed = typeof allowed[number]

    const patch: Partial<Record<Allowed, unknown>> = {}
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        patch[key] = (body as Record<string, unknown>)[key]
      }
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para actualizar.' }, { status: 400 })
    }

    const supabase = makeSupabase()
    const { data, error } = await supabase
      .from('nexus_agents')
      .update(patch)
      .eq('slug', id)
      .select()
      .single()

    if (error?.code === 'PGRST116') {
      return NextResponse.json({ error: 'Agente não encontrado' }, { status: 404 })
    }
    if (error) throw error

    return NextResponse.json({ agent: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (isBuiltIn(id)) {
    return NextResponse.json(
      { error: 'Agentes integrados não podem ser eliminados.' },
      { status: 403 },
    )
  }

  try {
    const supabase = makeSupabase()
    const { error } = await supabase
      .from('nexus_agents')
      .delete()
      .eq('slug', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
