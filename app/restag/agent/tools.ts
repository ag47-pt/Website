import { Type } from '@google/genai'
import type { Tool } from '@google/genai'
import { RESTAG_KNOWLEDGE_BASE } from './knowledge-base'

export interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export const RESTAG_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'get_restag_info',
        description:
          'Retorna a base de conhecimento completa da RESTAG — módulos, preços para restaurantes, benefícios para clientes e FAQs. Usa sempre esta ferramenta para responder sobre o negócio.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description:
                'Tópico específico: mensalidades, reservas, menu-digital, ads, gratuito, restaurante, cliente, geral',
            },
          },
        },
      },
    ],
  },
]

export async function executeRestagTool(
  name: string,
  args: Record<string, unknown>,
  _history: HistoryMessage[] = []
): Promise<unknown> {
  switch (name) {
    case 'get_restag_info':
      return { info: RESTAG_KNOWLEDGE_BASE }
    default:
      return { error: `Ferramenta desconhecida: ${name}` }
  }
}
