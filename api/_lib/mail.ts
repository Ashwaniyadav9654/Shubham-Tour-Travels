/**
 * Sends the itinerary PDF.
 *
 * EmailJS cannot do this — attachments there need a paid plan and the file
 * has to be bound to a template variable. So delivery moved server-side,
 * where a PDF is just bytes.
 *
 * Two transports, whichever is configured:
 *   RESEND_API_KEY              → Resend (simplest, free tier, no dep)
 *   SMTP_HOST/USER/PASS         → any SMTP, incl. Gmail with an App Password
 */

export interface Attachment {
  filename: string
  /** base64, no data: prefix */
  content: string
}

export interface Mail {
  to: string
  subject: string
  text: string
  attachments?: Attachment[]
}

export type MailResult = { sent: boolean; provider: string; error?: string }

function fromAddress() {
  return process.env.MAIL_FROM || 'Shubham Tour & Travels <onboarding@resend.dev>'
}

/* ── Resend ──────────────────────────────────────────────────────── */

async function viaResend(mail: Mail, key: string): Promise<MailResult> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      attachments: (mail.attachments || []).map(a => ({
        filename: a.filename,
        content: a.content,
      })),
    }),
  })

  if (res.ok) return { sent: true, provider: 'resend' }
  return { sent: false, provider: 'resend', error: `${res.status}: ${(await res.text()).slice(0, 220)}` }
}

/* ── SMTP ────────────────────────────────────────────────────────── */

async function viaSmtp(mail: Mail): Promise<MailResult> {
  const { default: nodemailer } = await import('nodemailer')

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await transport.sendMail({
    from: fromAddress(),
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    attachments: (mail.attachments || []).map(a => ({
      filename: a.filename,
      content: Buffer.from(a.content, 'base64'),
    })),
  })

  return { sent: true, provider: 'smtp' }
}

/* ── Entry ───────────────────────────────────────────────────────── */

export function mailConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY ||
    (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
  )
}

export async function sendMail(mail: Mail): Promise<MailResult> {
  const resendKey = process.env.RESEND_API_KEY
  try {
    if (resendKey) return await viaResend(mail, resendKey)
    if (process.env.SMTP_HOST) return await viaSmtp(mail)
    return { sent: false, provider: 'none', error: 'No mail transport configured' }
  } catch (err: any) {
    return { sent: false, provider: resendKey ? 'resend' : 'smtp', error: err?.message || 'send failed' }
  }
}
