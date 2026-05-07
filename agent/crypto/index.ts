// ─── Liquidity-Flow Crypto Agent — Main Orchestrator ─────────────────────────
// Entry point for the multi-agent trading system.
// Run: npx ts-node agent/crypto/index.ts
//
// Required environment variables:
//   BINANCE_API_KEY        — Binance read-only API key
//   BINANCE_API_SECRET     — Binance API secret
//   GOOGLE_API_KEY         — Gemini API key (from Google AI Studio)
//   BINANCE_TESTNET=true   — (optional) use Binance testnet
//   ACCOUNT_BALANCE=1000   — USDC balance for sizing (default: 1000)
//   GEMINI_MODEL           — (optional) override model (default: gemini-2.0-flash)

import { config as loadEnv } from 'dotenv'
loadEnv({ path: '.env.local' })
// @google/adk requires GOOGLE_GENAI_API_KEY or GEMINI_API_KEY
if (!process.env.GOOGLE_GENAI_API_KEY && process.env.GOOGLE_API_KEY) {
  process.env.GOOGLE_GENAI_API_KEY = process.env.GOOGLE_API_KEY
}
import { InMemoryRunner } from '@google/adk'
import { decisionHubAgent } from './agents/decision-hub'
import { INTERVALS }        from './config'

const ACCOUNT_BALANCE = parseFloat(process.env.ACCOUNT_BALANCE ?? '1000')

// ── Validate Required Environment Variables ────────────────────────────────────
function validateEnv(): void {
  const required = ['GOOGLE_API_KEY'] as const
  const missing  = required.filter(k => !process.env[k])
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
    console.warn(
      '[WARN] BINANCE_API_KEY / BINANCE_API_SECRET not set. ' +
      'Using public endpoints only (rate limits apply).'
    )
  }
}

// ── Single Decision Cycle ─────────────────────────────────────────────────────

async function runDecisionCycle(runner: InMemoryRunner): Promise<void> {
  const timestamp = new Date().toISOString()
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`  LIQUIDITY-FLOW AGENT  |  ${timestamp}`)
  console.log(`${'═'.repeat(60)}\n`)

  // Create a fresh session per cycle to avoid state accumulation
  const session = await runner.sessionService.createSession({
    appName:   'liquidity-flow-crypto-agent',
    userId:    'system',
    sessionId: `cycle-${Date.now()}`,
  })

  const userMessage = `
    Run a full market analysis cycle.
    My trading account balance is ${ACCOUNT_BALANCE} USDC.
    
    Evaluate all current opportunities using the rotation framework:
    1. First assess macro phase (BTC.D + ETH/BTC)
    2. Scan altcoins for RVOL setups (Correlation Guard active)
    3. Size each position with Kelly Criterion (max 1.5% risk)
    4. Deliver final verdicts in the structured format
    
    Timestamp: ${timestamp}
  `.trim()

  // Collect all events
  let fullResponse = ''
  let toolResultJson: string | null = null

  for await (const event of runner.runAsync({
    userId:    'system',
    sessionId: session.id,
    newMessage: {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  })) {
    if (!event.content?.parts) continue

    for (const part of event.content.parts) {
      // LLM text output
      if ('text' in part && typeof part.text === 'string' && part.text.trim()) {
        process.stdout.write(part.text)
        fullResponse += part.text
      }
      // Tool response — capture for stats
      if ('functionResponse' in part && part.functionResponse) {
        const resp = (part.functionResponse as { response?: unknown }).response
        if (resp) toolResultJson = JSON.stringify(resp, null, 2)
      }
    }
  }

  console.log('\n')

  // Parse proposal count from tool result (more reliable than regex on LLM text)
  let proposalCount = (fullResponse.match(/TRADE PROPOSAL/gi) ?? []).length
  let enterCount    = (fullResponse.match(/VERDICT:\s*ENTER/gi) ?? []).length

  if (toolResultJson) {
    try {
      const toolResult = JSON.parse(toolResultJson)
      if (typeof toolResult?.proposals?.length === 'number') {
        proposalCount = toolResult.proposals.length
        console.log(`[TOOL RESULT] Phase: ${toolResult.macroSummary?.phase ?? 'unknown'} | BTC.D: ${toolResult.macroSummary?.btcDominance ?? 'N/A'} | Scan blocked: ${toolResult.scanBlocked ?? false}`)
        if (toolResult.scanBlocked) {
          console.log(`[SCAN BLOCKED] ${toolResult.blockedReason ?? ''}`)
        }
      }
    } catch { /* ignore */ }
  }

  if (!fullResponse.trim()) {
    console.log('[WARN] No text response from LLM — check ADK event structure')
  }

  console.log(`[CYCLE COMPLETE] ${proposalCount} proposals evaluated | ${enterCount} ENTER verdicts`)
}

// ── Polling Loop ──────────────────────────────────────────────────────────────

async function startPollingLoop(): Promise<void> {
  validateEnv()

  const runner = new InMemoryRunner({
    agent:   decisionHubAgent,
    appName: 'liquidity-flow-crypto-agent',
  })

  console.log(`
  ┌─────────────────────────────────────────────────────┐
  │       LIQUIDITY-FLOW CRYPTO ROTATION AGENT          │
  │                                                     │
  │  Strategy : BTC.D → ETH/BTC → Altcoin Rotation     │
  │  Universe : Top 50 USDT pairs                       │
  │  Risk Cap : 1.5% max per trade (Kelly Criterion)    │
  │  Cycle    : Every ${(INTERVALS.decisionCycleMs / 60000).toString().padStart(2, ' ')} minutes                       │
  │  Balance  : ${ACCOUNT_BALANCE.toFixed(2).padStart(10, ' ')} USDC                          │
  └─────────────────────────────────────────────────────┘
  `)

  // Immediate first run
  await runDecisionCycle(runner)

  // Schedule subsequent cycles
  const interval = setInterval(async () => {
    try {
      await runDecisionCycle(runner)
    } catch (err) {
      console.error('[ERROR] Decision cycle failed:', err)
      // Don't stop the loop on transient errors
    }
  }, INTERVALS.decisionCycleMs)

  // Graceful shutdown
  process.on('SIGINT',  () => { clearInterval(interval); console.log('\n[SHUTDOWN] Agent stopped.'); process.exit(0) })
  process.on('SIGTERM', () => { clearInterval(interval); console.log('\n[SHUTDOWN] Agent stopped.'); process.exit(0) })
}

// ── CLI Entrypoint ────────────────────────────────────────────────────────────

if (require.main === module) {
  startPollingLoop().catch(err => {
    console.error('[FATAL]', err)
    process.exit(1)
  })
}

export type { }  // keep module clean
export { startPollingLoop }
