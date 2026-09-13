import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { sendInvitationNotification } from '@/lib/invitations/mailer'
import fs from 'fs'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      slug = 'laura',
      recipient = 'Laura',
      eventType = 'started',
      responses = {},
      ctaChosen,
    } = body

    const userAgent = req.headers.get('user-agent') || 'unknown'
    const nowLisbon = new Date().toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' })
    const isoTimestamp = new Date().toISOString()

    const eventRecord = {
      id: `${slug}_${Date.now()}`,
      slug,
      recipient,
      eventType,
      responses,
      ctaChosen: ctaChosen || null,
      userAgent,
      createdAtLisbon: nowLisbon,
      createdAtIso: isoTimestamp,
    }

    // 1. Persist to local JSON database storage (data/private_invitations.json) immediately
    try {
      const dataDir = path.join(process.cwd(), 'data')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      const filePath = path.join(dataDir, 'private_invitations.json')
      let existingLogs = []
      if (fs.existsSync(filePath)) {
        try {
          existingLogs = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        } catch {
          existingLogs = []
        }
      }
      existingLogs.unshift(eventRecord)
      fs.writeFileSync(filePath, JSON.stringify(existingLogs, null, 2), 'utf-8')
    } catch (fsErr) {
      console.warn('⚠️ Erro ao salvar log local de convite:', fsErr)
    }

    // 2. Webhook support (if INVITATION_WEBHOOK_URL is configured)
    const webhookUrl = process.env.INVITATION_WEBHOOK_URL
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventRecord),
      }).catch((err) => console.warn('⚠️ Erro ao disparar webhook de convite:', err))
    }

    // 3. Persist to Firebase Firestore collection 'private_invitations' (with 1.5s timeout safeguard)
    let firestoreId: string | null = null
    try {
      const firestoreTask = addDoc(collection(db, 'private_invitations'), {
        ...eventRecord,
        serverTimestamp: serverTimestamp(),
      })
      const timeoutTask = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Firestore operation timeout')), 1500)
      )
      const docRef = (await Promise.race([firestoreTask, timeoutTask])) as { id: string }
      firestoreId = docRef.id
    } catch (firestoreError) {
      console.warn('⚠️ Firebase Firestore gravado em fallback local:', firestoreError)
    }

    // 4. Dispatch instant email notification to ag47.pt@gmail.com
    const emailResult = await sendInvitationNotification({
      slug,
      recipient,
      eventType,
      responses,
      ctaChosen,
      userAgent,
    })

    return NextResponse.json({
      success: true,
      firestoreId,
      emailSent: emailResult.success,
      timestamp: nowLisbon,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('API /api/invitations/track Error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
