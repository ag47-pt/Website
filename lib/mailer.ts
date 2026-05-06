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

interface LeadData {
  nome: string
  email: string
  servico_interesse: string
  descricao_projeto?: string
  orcamento_estimado?: string
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

  await transporter.sendMail({
    from: `"Agente 47 🤖" <${process.env.GMAIL_USER}>`,
    to: destinatario,
    subject: `🎯 Novo Lead: ${lead.nome} — ${servicoLabel[lead.servico_interesse] ?? lead.servico_interesse}`,
    html,
  })
}
