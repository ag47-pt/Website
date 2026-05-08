import { Type } from '@google/genai'
import type { Tool } from '@google/genai'
import { KNOWLEDGE_BASE } from './knowledge-base'
import { supabase } from '@/config/supabase'
import { sendLeadNotification } from '@/lib/mailer'

export interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

// ---------------------------------------------------------------------------
// Tool declarations (enviadas ao Gemini)
// ---------------------------------------------------------------------------
export const AG47_TOOLS: Tool[] = [
  {
    functionDeclarations: [
      {
        name: 'get_company_info',
        description:
          'Retorna a base de conhecimento completa da Agência 47 — serviços, preços, planos, políticas e FAQs. Usa sempre esta ferramenta antes de responder sobre qualquer detalhe da empresa.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            topic: {
              type: Type.STRING,
              description:
                'Tópico específico: preços, serviços, websites, saas, social-media, trafego-pago, planos, políticas, contacto, geral',
            },
          },
        },
      },
      {
        name: 'qualify_lead',
        description:
          'Regista um lead qualificado para follow-up da equipa comercial. Usa quando o visitante mostrar interesse claro num serviço. Calcula automaticamente o score e temperatura com base na qualidade da conversa.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING, description: 'Nome completo do potencial cliente' },
            email: { type: Type.STRING, description: 'Email de contacto' },
            servico_interesse: {
              type: Type.STRING,
              description: 'Serviço de interesse: websites, saas, social-media, trafego-pago, planos',
            },
            descricao_projeto: {
              type: Type.STRING,
              description: 'Descrição breve do projeto ou necessidade do cliente',
            },
            orcamento_estimado: {
              type: Type.STRING,
              description: 'Orçamento estimado disponível (opcional)',
            },
            urgencia: {
              type: Type.STRING,
              description: 'Urgência percebida: alta, normal, baixa',
            },
            lead_score: {
              type: Type.NUMBER,
              description:
                'Score de qualidade do lead de 0 a 100. Base: 20 pts por ter nome, 20 por email, 20 por descrever o projeto, 20 por indicar orçamento, 20 por urgência alta. Subtrai 10 se mensagens muito curtas ou vagas.',
            },
            lead_temperature: {
              type: Type.STRING,
              description:
                'Temperatura do lead baseada no score: "hot" (score ≥ 80), "warm" (score 50-79), "cold" (score < 50)',
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description:
                'Tags de qualificação derivadas do serviço e da conversa. Ex: ["website", "ecommerce", "urgente", "sem-orcamento", "portugal", "seo"]. Máximo 6 tags.',
            },
            conversation_summary: {
              type: Type.STRING,
              description:
                'Resumo de qualificação estruturado com: Score, Tag (HOT/WARM/COLD), Urgência, Orçamento detetado, Objetivos principais (lista), Dores/problemas mencionados. Formato: "Score: X/100\\n- Tag: Y\\n- Urgência: Z\\n- Orçamento detetado: W\\n- Objetivos: ...\\n- Dores: ..."',
            },
          },
          required: ['nome', 'email', 'servico_interesse', 'lead_score', 'lead_temperature', 'conversation_summary'],
        },
      },
      {
        name: 'schedule_free_consultation',
        description:
          'Solicita o agendamento de uma sessão de diagnóstico gratuita. Usa quando o visitante quiser falar com a equipa.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING, description: 'Nome do potencial cliente' },
            email: { type: Type.STRING, description: 'Email para confirmação' },
            preferencia_horario: {
              type: Type.STRING,
              description: 'Preferência de horário: manhã, tarde, noite, qualquer',
            },
          },
          required: ['nome', 'email'],
        },
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Tool executor (corre server-side na API route)
// ---------------------------------------------------------------------------
export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  conversationHistory: HistoryMessage[] = []
): Promise<unknown> {
  switch (name) {
    case 'get_company_info':
      return { info: KNOWLEDGE_BASE }

    case 'qualify_lead': {
      const {
        nome,
        email,
        servico_interesse,
        descricao_projeto = '',
        orcamento_estimado = '',
        urgencia = 'normal',
        lead_score = 0,
        lead_temperature = 'cold',
        tags = [],
        conversation_summary = '',
      } = args as Record<string, unknown>

      // Build the chat transcript to persist (last 20 exchanges max)
      const recentHistory = conversationHistory.slice(-20)
      const chatHistoryJson = recentHistory.map((m) => ({ role: m.role, content: m.content }))

      const { error: insertError } = await supabase.from('leads').insert({
        name: nome as string,
        email: email as string,
        source: 'chatbot',
        servico_interesse: servico_interesse as string,
        descricao_projeto: (descricao_projeto as string) || null,
        orcamento_estimado: (orcamento_estimado as string) || null,
        urgencia: urgencia as string,
        lead_score: Number(lead_score),
        lead_temperature: lead_temperature as string,
        tags: Array.isArray(tags) ? tags : [],
        conversation_summary: (conversation_summary as string) || null,
        chat_history: chatHistoryJson,
      })

      if (insertError) {
        // Fallback: minimal insert (schema may be outdated — run leads_v2_migration.sql)
        const { error: fallbackError } = await supabase.from('leads').insert({
          name: nome as string,
          email: email as string,
        })
        if (fallbackError) {
          console.error('[ag47-agent] supabase insert error:', fallbackError.message)
          return {
            status: 'error',
            message:
              'Não consegui registar o lead agora. Podes confirmar os teus dados e tentar novamente em instantes?',
          }
        }
      }

      // Enviar email de notificação rico
      try {
        await sendLeadNotification({
          nome: nome as string,
          email: email as string,
          servico_interesse: servico_interesse as string,
          descricao_projeto: descricao_projeto as string,
          orcamento_estimado: orcamento_estimado as string,
          urgencia: urgencia as string,
          lead_score: Number(lead_score),
          lead_temperature: lead_temperature as string,
          tags: Array.isArray(tags) ? (tags as string[]) : [],
          conversation_summary: conversation_summary as string,
          chat_history: chatHistoryJson,
        })
      } catch (mailErr) {
        console.error('[ag47-agent] email send error:', mailErr)
      }

      return {
        status: 'success',
        message: `Lead registado! A nossa equipa irá contactar ${nome as string} em ${email as string} em menos de 24 horas.`,
      }
    }

    case 'schedule_free_consultation': {
      const { nome, email } = args as Record<string, string>
      return {
        status: 'success',
        message: `Perfeito, ${nome}! Acede a https://ag47.pt e clica em "Agendar Diagnóstico". Confirmaremos por email em ${email}.`,
        duration: '15-30 minutos',
        cost: 'Gratuito, sem compromisso',
      }
    }

    default:
      return { error: `Ferramenta desconhecida: ${name}` }
  }
}
