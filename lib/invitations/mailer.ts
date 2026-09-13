import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER || 'ag47.pt@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export interface InvitationEventData {
  slug: string
  recipient: string
  eventType: 'started' | 'completed'
  responses?: Record<string, string | undefined>
  ctaChosen?: string
  userAgent?: string
}

export async function sendInvitationNotification(data: InvitationEventData): Promise<{ success: boolean; error?: string }> {
  const recipientEmail = 'ag47.pt@gmail.com'
  const nowLisbon = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })

  const isStarted = data.eventType === 'started'
  const subject = isStarted
    ? `🌹 [${data.recipient} Iniciou o Convite] A experiência privada foi aberta agora`
    : `✨ [${data.recipient} Respondeu ao Convite!] Confirmação recebida`

  // Format responses nicely
  const responses = data.responses || {}
  const responseLabels: Record<string, string> = {
    day: '🗓️ Dia Escolhido',
    time: '⏰ Período do Dia',
    environment: '📍 Atmosfera / Cenário',
    control: '🔍 Nível de Controle',
    vibe: '🎲 Dinâmica do Date',
  }

  const responseValues: Record<string, string> = {
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    outra_semana: 'Melhor escolhermos outra semana',
    almoco_tarde: 'Almoço + tarde',
    fim_tarde_noite: 'Fim de tarde + noite',
    noite: 'Noite',
    mar: 'MAR (vento, horizonte e nenhuma pressa)',
    cidade: 'CIDADE (luzes, movimento e alguma coisa acontecendo)',
    surpresa: 'Prefiro ser surpreendida',
    pistas: 'Quero algumas pistas',
    plano: 'Seguimos o plano',
    improviso: 'Improvisamos',
    ambos: 'Um pouco dos dois',
  }

  let responsesTableHtml = ''
  if (!isStarted && Object.keys(responses).length > 0) {
    responsesTableHtml = `
      <div style="margin: 20px 0; border: 1px solid rgba(190, 18, 60, 0.3); border-radius: 12px; overflow: hidden; background: #121214;">
        <div style="background: rgba(190, 18, 60, 0.15); padding: 12px 18px; border-bottom: 1px solid rgba(190, 18, 60, 0.25);">
          <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #fb7185; font-weight: 600;">
            Resumo das Escolhas de ${data.recipient}
          </span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          ${Object.entries(responses)
            .map(([key, val]) => {
              const label = responseLabels[key] || key
              const displayVal = val ? (responseValues[val] || val) : 'Não respondido'
              return `
                <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                  <td style="padding: 12px 18px; color: #a1a1aa; font-weight: 500; width: 40%; font-size: 13px;">${label}</td>
                  <td style="padding: 12px 18px; color: #f4f4f5; font-weight: 600;">${displayVal}</td>
                </tr>
              `
            })
            .join('')}
          ${
            data.ctaChosen
              ? `
                <tr style="background: rgba(190, 18, 60, 0.08);">
                  <td style="padding: 12px 18px; color: #fb7185; font-weight: 600; font-size: 13px;">💬 Decisão Final (CTA)</td>
                  <td style="padding: 12px 18px; color: #ffffff; font-weight: 700;">${data.ctaChosen}</td>
                </tr>
              `
              : ''
          }
        </table>
      </div>
    `
  }

  const html = `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050505; color: #f4f4f5; margin: 0; padding: 32px 16px;">
  <div style="max-width: 560px; margin: 0 auto; background: #0c0c0e; border: 1px solid rgba(190, 18, 60, 0.35); border-radius: 20px; overflow: hidden; box-shadow: 0 0 35px rgba(190, 18, 60, 0.18);">
    
    <!-- Top Crimson Editorial Banner -->
    <div style="background: linear-gradient(135deg, #881337 0%, #be123c 60%, #e11d48 100%); padding: 28px; text-align: left;">
      <span style="display: inline-block; font-family: monospace; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255, 255, 255, 0.85); background: rgba(0, 0, 0, 0.25); padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px;">
        ${isStarted ? '⚡ ALERTA DE ACESSO' : '🎯 CONVITE CONCLUÍDO'}
      </span>
      <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: #ffffff; letter-spacing: -0.02em;">
        ${isStarted ? `🌹 ${data.recipient} iniciou o convite!` : `✨ ${data.recipient} respondeu ao convite!`}
      </h1>
      <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255, 255, 255, 0.85);">
        Horário: ${nowLisbon} (Fuso horário de Lisboa)
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8; margin-top: 0;">
        ${
          isStarted
            ? `A <strong>${data.recipient}</strong> acabou de clicar em <em>“Começar”</em> na página privada <code>/${data.slug}</code>.`
            : `A <strong>${data.recipient}</strong> completou todas as etapas e selecionou a confirmação final.`
        }
      </p>

      ${responsesTableHtml}

      <div style="margin-top: 24px; padding: 14px 18px; background: #16161a; border-radius: 10px; border: 1px solid #27272a; font-size: 12px; color: #71717a;">
        <strong style="color: #a1a1aa;">Detalhes Técnicos:</strong><br />
        • Dispositivo: <span style="color: #e4e4e7;">${data.userAgent || 'Navegador Web / Mobile'}</span><br />
        • Experiência: <span style="color: #e4e4e7;">/${data.slug}</span><br />
        • Persistência: <span style="color: #4ade80;">Registrado na Collection Firebase <code>private_invitations</code></span>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 16px 28px; background: #070709; border-top: 1px solid #1f1f23; font-size: 11px; color: #52525b; text-align: center; font-family: monospace;">
      AG47 Private Experience Engine • Notificação Automática
    </div>
  </div>
</body>
</html>
`

  try {
    await transporter.sendMail({
      from: `"AG47 Invitation Bot 🌹" <${process.env.GMAIL_USER || 'ag47.pt@gmail.com'}>`,
      to: recipientEmail,
      subject,
      html,
    })
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('Erro ao enviar e-mail de notificação de convite:', errorMsg)
    return { success: false, error: errorMsg }
  }
}
