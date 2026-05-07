import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { Content, Part } from '@google/genai'
import { AG47_TOOLS, executeTool } from '@/agent/tools'
import { SYSTEM_INSTRUCTION } from '@/agent/config'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
const DEFAULT_MODEL = 'gemini-2.5-flash'
const ALLOWED_MODELS = new Set([
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-3-flash',
  'gemini-3.1-pro-preview',
])
const MAX_TOOL_ROUNDS = 5
const MAX_RETRIES = 3

async function generateWithRetry(params: Parameters<typeof ai.models.generateContent>[0]) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await ai.models.generateContent(params)
    } catch (err: unknown) {
      const isRetryable =
        err instanceof Error &&
        (err.message.includes('503') || err.message.includes('UNAVAILABLE') || err.message.includes('high demand'))
      if (isRetryable && attempt < MAX_RETRIES - 1) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }
      throw err
    }
  }
  throw new Error('Max retries exceeded')
}

interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history, model } = body as { message: unknown; history: unknown; model: unknown }
    const selectedModel = (typeof model === 'string' && ALLOWED_MODELS.has(model)) ? model : DEFAULT_MODEL

    if (typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'message obrigatória' }, { status: 400 })
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Mensagem demasiado longa' }, { status: 400 })
    }

    // Converter histórico do cliente para formato Gemini
    const contents: Content[] = []

    if (Array.isArray(history)) {
      for (const msg of history as HistoryMessage[]) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })
        }
      }
    }

    // Adicionar a mensagem actual
    contents.push({ role: 'user', parts: [{ text: message.trim() }] })

    // Loop agêntico: modelo → ferramentas → modelo → resposta final
    let rounds = 0
    while (rounds < MAX_TOOL_ROUNDS) {
      rounds++

      const result = await generateWithRetry({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          tools: AG47_TOOLS,
          temperature: 0.7,
        },
      })

      const candidate = result.candidates?.[0]
      if (!candidate?.content) break

      const parts: Part[] = candidate.content.parts ?? []
      const functionCallParts = parts.filter((p) => p.functionCall)

      // Se não há tool calls, temos a resposta final
      if (functionCallParts.length === 0) {
        const text = parts
          .filter((p) => p.text)
          .map((p) => p.text)
          .join('')
        return NextResponse.json({ response: text })
      }

      // Adicionar resposta do modelo ao histórico
      contents.push({ role: 'model', parts })

      // Executar ferramentas e devolver resultados
      const responseParts: Part[] = await Promise.all(
        functionCallParts.map(async (p) => {
          const toolResult = await executeTool(
            p.functionCall!.name!,
            p.functionCall!.args as Record<string, unknown>
          )

          // Gemini expects functionResponse.response as an object.
          const responsePayload: Record<string, unknown> =
            toolResult && typeof toolResult === 'object'
              ? (toolResult as Record<string, unknown>)
              : { value: toolResult }

          return {
            functionResponse: {
              name: p.functionCall!.name!,
              response: responsePayload,
            },
          }
        })
      )
      contents.push({ role: 'user', parts: responseParts })
    }

    return NextResponse.json({ response: 'Não consegui processar o pedido. Tenta novamente.' })
  } catch (err) {
    console.error('[ag47-agent] error:', err)
    return NextResponse.json({ error: 'Erro interno. Tenta novamente mais tarde.' }, { status: 500 })
  }
}
