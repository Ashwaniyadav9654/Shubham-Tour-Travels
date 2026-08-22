/**
 * POST /api/contact
 *
 * General enquiry form. Goes out through the same Resend/SMTP transport as
 * the itinerary, so there is exactly one mail path in the codebase.
 * Replaces the old EmailJS call, which could not attach files and needed a
 * separate template per recipient.
 */

import { sendMail, mailConfigured } from './_lib/mail'

const TEAM_EMAIL = process.env.TEAM_EMAIL || 'shubhamtourandtravels9@gmail.com'
const PHONE = '+91 85958 20300'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  body = body || {}

  const { name, phone, email, subject, message, from, to, date, passengers } = body

  if (!name || !phone) {
    res.status(400).json({ error: 'Please give us your name and a phone number.' })
    return
  }

  if (!mailConfigured()) {
    res.status(503).json({
      error: `Our contact form is not connected just now. Please call us on ${PHONE} or message us on WhatsApp.`,
    })
    return
  }

  const lines = [
    'New enquiry from the website.',
    '',
    `Name:       ${name}`,
    `Phone:      ${phone}`,
    `Email:      ${email || 'not provided'}`,
    subject ? `Subject:    ${subject}` : null,
    from ? `From:       ${from}` : null,
    to ? `To:         ${to}` : null,
    date ? `Date:       ${date}` : null,
    passengers ? `Passengers: ${passengers}` : null,
    '',
    'Message:',
    message || 'No additional message.',
  ].filter(Boolean)

  const team = await sendMail({
    to: TEAM_EMAIL,
    subject: `ENQUIRY: ${subject || name}`,
    text: lines.join('\n'),
  })

  if (!team.sent) {
    res.status(502).json({
      error: `We could not send your message (${team.error}). Please call us on ${PHONE}.`,
    })
    return
  }

  // Courtesy acknowledgement, best effort. Never fail the request for it.
  let acknowledged = false
  if (email) {
    const ack = await sendMail({
      to: email,
      subject: 'We have your enquiry | Shubham Tour & Travels',
      text:
        `Hello ${name},\n\n` +
        `Thank you for getting in touch. We have your enquiry and one of our\n` +
        `team will call you shortly.\n\n` +
        (message ? `What you told us:\n${message}\n\n` : '') +
        `If it is urgent, call us any time on ${PHONE}.\n\n` +
        `Warm regards,\nShubham Tour & Travels`,
    })
    acknowledged = ack.sent
  }

  res.status(200).json({ ok: true, acknowledged })
}
