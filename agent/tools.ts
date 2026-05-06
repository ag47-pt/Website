import { Type } from '@google/genai'
import type { Tool } from '@google/genai'
import { KNOWLEDGE_BASE } from './knowledge-base'
import { supabase } from '@/config/supabase'
import { sendLeadNotification } from '@/lib/mailer'

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
          'Regista um lead qualificado para follow-up da equipa comercial. Usa quando o visitante mostrar interesse claro num serviço.',
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
              description: 'Descrição breve do projeto ou necessidade',
            },
            orcamento_estimado: {
              type: Type.STRING,
              description: 'Orçamento estimado disponível (opcional)',
            },
          },
          required: ['nome', 'email', 'servico_interesse'],
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
export async function executeTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'get_company_info':
      return { info: KNOWLEDGE_BASE }

    case 'qualify_lead': {
      const { nome, email, servico_interesse, descricao_projeto = '', orcamento_estimado = '' } =
        args as Record<string, string>

      // Guardar no Supabase
      const { error: dbError } = await supabase.from('leads').insert({
        name: nome,
        email,
        source: 'chatbot',
        servico_interesse,
        descricao_projeto: descricao_projeto || null,
        orcamento_estimado: orcamento_estimado || null,
      })
      if (dbError) console.error('[ag47-agent] supabase insert error:', dbError.message)

      // Enviar email de notificação
      try {
        await sendLeadNotification({ nome, email, servico_interesse, descricao_projeto, orcamento_estimado })
      } catch (mailErr) {
        console.error('[ag47-agent] email send error:', mailErr)
      }

      return {
        status: 'success',
        message: `Lead registado! A nossa equipa irá contactar ${nome} em ${email} em menos de 24 horas.`,
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
