import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import type { Content, Part } from '@google/genai'
import { RESTAG_TOOLS, executeRestagTool, type HistoryMessage } from '@/app/restag/agent/tools'
import { RESTAG_SYSTEM_INSTRUCTION } from '@/app/restag/agent/config'

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
const DEFAULT_MODEL = 'gemini-2.5-flash'
const MAX_TOOL_ROUNDS = 5

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history, model } = body as { message: string; history: HistoryMessage[]; model?: string }
    const selectedModel = model || DEFAULT_MODEL

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Mensagem obrigatória' }, { status: 400 })
    }

    const contents: Content[] = []
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })
      }
    }
    contents.push({ role: 'user', parts: [{ text: message.trim() }] })

    // Loop agêntico
    let rounds = 0
    while (rounds < MAX_TOOL_ROUNDS) {
      rounds++

      const result = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction: RESTAG_SYSTEM_INSTRUCTION,
          tools: RESTAG_TOOLS,
          temperature: 0.7,
        },
      })

      const candidate = result.candidates?.[0]
      if (!candidate?.content) break

      const parts: Part[] = candidate.content.parts ?? []
      const functionCallParts = parts.filter((p) => p.functionCall)

      if (functionCallParts.length === 0) {
        const text = parts
          .filter((p) => p.text)
          .map((p) => p.text)
          .join('')
        return NextResponse.json({ response: text })
      }

      contents.push({ role: 'model', parts })

      const responseParts: Part[] = await Promise.all(
        functionCallParts.map(async (p) => {
          const toolResult = await executeRestagTool(
            p.functionCall!.name!,
            p.functionCall!.args as Record<string, unknown>,
            history
          )

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
    console.error('[restag-agent] error:', err)
    return NextResponse.json({ error: 'Erro interno. Tenta novamente mais tarde.' }, { status: 500 })
  }
}
