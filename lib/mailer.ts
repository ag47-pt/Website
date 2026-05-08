import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface LeadData {
  nome: string
  email: string
  servico_interesse: string
  descricao_projeto?: string
  orcamento_estimado?: string
  urgencia?: string
  lead_score?: number
  lead_temperature?: string
  tags?: string[]
  conversation_summary?: string
  chat_history?: ChatMessage[]
}

export async function sendLeadNotification(lead: LeadData): Promise<void> {
  const destinatario = process.env.LEADS_EMAIL ?? 'ag47.pt@gmail.com'

  const servicoLabel: Record<string, string> = {
    websites: '🌐 Website',
    saas: '⚙️ SaaS / App',
    'social-media': '📱 Social Media',
    'trafego-pago': '📈 Tráfego Pago',
    planos: '📦 Planos',
  }

  const score = lead.lead_score ?? 0
  const temperature = (lead.lead_temperature ?? 'cold').toLowerCase()

  const tempLabel: Record<string, string> = {
    hot: 'HOT',
    warm: 'WARM',
    cold: 'COLD',
  }
  const tempColor: Record<string, string> = {
    hot: '#ef4444',
    warm: '#f97316',
    cold: '#3b82f6',
  }
  const tagLabel = tempLabel[temperature] ?? 'COLD'
  const tagColor = tempColor[temperature] ?? '#3b82f6'

  // Build conversation transcript HTML
  const recentHistory = (lead.chat_history ?? []).slice(-12)
  let conversationHtml = ''
  if (recentHistory.length > 0) {
    conversationHtml = recentHistory
      .map((m) => {
        const label = m.role === 'user' ? 'USER' : 'ASSISTANT'
        const escaped = m.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br />')
        return `<strong>${label}:</strong> ${escaped}`
      })
      .join('<br />')
  }

  // Build tags HTML
  const tagsHtml = (lead.tags ?? [])
    .map((t) => `<span style="display:inline-block;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);color:#a855f7;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;margin:2px;">${t}</span>`)
    .join(' ')

  const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #f0f0f0; margin: 0; padding: 24px; }
    .card { background: #111; border: 1px solid #222; border-radius: 16px; max-width: 560px; margin: 0 auto; overflow: hidden; }
    .header { background: linear-gradient(135deg, #a855f7, #ec4899); padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 20px; color: white; }
    .header p { margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.75); }
    .body { padding: 24px 28px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #a855f7; font-weight: 600; margin-bottom: 4px; }
    .value { font-size: 15px; color: #f0f0f0; }
    .badge { display: inline-block; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.4); color: #a855f7; border-radius: 8px; padding: 4px 12px; font-size: 13px; font-weight: 600; }
    .score-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 18px; }
    .score-card { border: 1px solid #2a2a2a; border-radius: 12px; padding: 10px 14px; background: #0c0c0c; }
    .score-card strong { display: block; font-size: 20px; color: #fff; }
    .footer { padding: 16px 28px; border-top: 1px solid #222; font-size: 12px; color: #555; }
    .cta { display: inline-block; margin-top: 16px; background: linear-gradient(135deg, #a855f7, #ec4899); color: white; text-decoration: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🎯 Novo Lead Qualificado</h1>
      <p>Capturado pelo Agente 47 • ${new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })}</p>
    </div>
    <div class="body">

      <div class="score-row">
        <div class="score-card">
          <div class="label">Lead Score</div>
          <strong>${score}/100</strong>
        </div>
        <div class="score-card">
          <div class="label">Tag</div>
          <strong style="color:${tagColor}">${tagLabel}</strong>
        </div>
        ${lead.urgencia ? `
        <div class="score-card">
          <div class="label">Urgência</div>
          <strong style="font-size:14px;color:#f0f0f0">${lead.urgencia}</strong>
        </div>` : ''}
      </div>

      <div class="field">
        <div class="label">Nome</div>
        <div class="value">${lead.nome}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${lead.email}" style="color:#a855f7">${lead.email}</a></div>
      </div>
      <div class="field">
        <div class="label">Serviço de Interesse</div>
        <div class="value"><span class="badge">${servicoLabel[lead.servico_interesse] ?? lead.servico_interesse}</span></div>
      </div>
      ${lead.descricao_projeto ? `
      <div class="field">
        <div class="label">Descrição do Projeto</div>
        <div class="value">${lead.descricao_projeto}</div>
      </div>` : ''}
      ${lead.orcamento_estimado ? `
      <div class="field">
        <div class="label">Orçamento Estimado</div>
        <div class="value">${lead.orcamento_estimado}</div>
      </div>` : ''}
      ${(lead.tags ?? []).length > 0 ? `
      <div class="field">
        <div class="label">Tags</div>
        <div class="value">${tagsHtml}</div>
      </div>` : ''}
      ${lead.conversation_summary ? `
      <div class="field">
        <div class="label">Resumo de Qualificação</div>
        <div class="value">Resumo de Qualificação (auto):<br />${lead.conversation_summary.replace(/\n/g, '<br />')}</div>
      </div>` : ''}
      ${conversationHtml ? `
      <div class="field">
        <div class="label">Histórico Recente da Conversa</div>
        <div class="value" style="font-size:13px;line-height:1.5;color:#bdbdbd;max-height:260px;overflow:auto;border:1px solid #2a2a2a;border-radius:10px;padding:10px;background:#0c0c0c;">${conversationHtml}</div>
      </div>` : ''}

      <a class="cta" href="mailto:${lead.email}?subject=AG47 — A sua proposta está a caminho, ${lead.nome.split(' ')[0]}!">
        ✉️ Responder ao Lead
      </a>
    </div>
    <div class="footer">
      Este email foi gerado automaticamente pelo chatbot da AG47.
    </div>
  </div>
</body>
</html>
`

  const subjectPrefix = `[${tagLabel} ${score}]`
  await transporter.sendMail({
    from: `"Agente 47 🤖" <${process.env.GMAIL_USER}>`,
    to: destinatario,
    subject: `${subjectPrefix} 🎯 Novo Lead: ${lead.nome} — ${servicoLabel[lead.servico_interesse] ?? lead.servico_interesse}`,
    html,
  })
}

