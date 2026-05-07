import { NextRequest, NextResponse } from 'next/server'

// Lazy-load ADK + agents so they don't break the Next.js build if optional deps
// are missing — they are only needed at runtime when the route is called.
async function runCycle(accountBalance: number) {
  // @google/adk needs this alias
  if (!process.env.GOOGLE_GENAI_API_KEY && process.env.GOOGLE_API_KEY) {
    process.env.GOOGLE_GENAI_API_KEY = process.env.GOOGLE_API_KEY
  }

  const { InMemoryRunner }    = await import('@google/adk')
  const { decisionHubAgent }  = await import('@/agent/crypto/agents/decision-hub')

  const runner = new InMemoryRunner({
    agent:   decisionHubAgent,
    appName: 'liquidity-flow-crypto-agent',
  })

  const session = await runner.sessionService.createSession({
    appName:   'liquidity-flow-crypto-agent',
    userId:    'nexus-ui',
    sessionId: `cycle-${Date.now()}`,
  })

  const timestamp = new Date().toISOString()
  const userMessage = `
    Run a full market analysis cycle.
    My trading account balance is ${accountBalance} USDC.
    Evaluate all current opportunities using the rotation framework:
    1. First assess macro phase (BTC.D + ETH/BTC)
    2. Scan altcoins for RVOL setups (Correlation Guard active)
    3. Size each position with Kelly Criterion (max 1.5% risk)
    4. Deliver final verdicts in the structured format
    Timestamp: ${timestamp}
  `.trim()

  let fullResponse  = ''
  let toolResultRaw: unknown = null

  for await (const event of runner.runAsync({
    userId:    'nexus-ui',
    sessionId: session.id,
    newMessage: { role: 'user', parts: [{ text: userMessage }] },
  })) {
    if (!event.content?.parts) continue
    for (const part of event.content.parts as unknown[]) {
      const p = part as Record<string, unknown>
      if (typeof p.text === 'string' && p.text.trim()) {
        fullResponse += p.text
      }
      if (p.functionResponse) {
        const fr = p.functionResponse as Record<string, unknown>
        if (fr.response) toolResultRaw = fr.response
      }
    }
  }

  const proposalCount = (fullResponse.match(/TRADE PROPOSAL/gi) ?? []).length
  const enterCount    = (fullResponse.match(/VERDICT:\s*ENTER/gi) ?? []).length

  let macroSummary: unknown = null
  let proposals: unknown[]  = []
  let scanBlocked           = false
  let blockedReason: string | null = null

  if (toolResultRaw && typeof toolResultRaw === 'object') {
    const tr = toolResultRaw as Record<string, unknown>
    macroSummary  = tr.macroSummary  ?? null
    proposals     = Array.isArray(tr.proposals) ? tr.proposals : []
    scanBlocked   = Boolean(tr.scanBlocked)
    blockedReason = typeof tr.blockedReason === 'string' ? tr.blockedReason : null
  }

  return {
    timestamp,
    accountBalance,
    llmOutput: fullResponse,
    macroSummary,
    proposals,
    proposalCount,
    enterCount,
    scanBlocked,
    blockedReason,
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const accountBalance = Number(body.accountBalance) || 1000

    const result = await runCycle(accountBalance)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[crypto/cycle]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
