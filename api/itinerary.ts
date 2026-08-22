/**
 * POST /api/itinerary
 *
 * Real-time only. There is deliberately NO offline fallback: if Groq or the
 * routing lookup fails, this returns an error and the page says so. A quote
 * built from a template would look identical to a real one and we would have
 * no way of telling the customer which they got.
 *
 * Pipeline
 *   1. Real driving distance   (Google Distance Matrix, else Nominatim+OSRM)
 *   2. Day-by-day plan          (Groq — prose only, never prices)
 *   3. Pricing                  (src/lib/pricing.ts — plain arithmetic)
 *   4. PDF                      (jsPDF)
 *   5. Email the PDF            (Resend or SMTP) to customer AND team
 *
 * Env: GROQ_API_KEY (required), GROQ_MODEL, GOOGLE_MAPS_API_KEY (optional),
 *      RESEND_API_KEY or SMTP_*, MAIL_FROM, TEAM_EMAIL
 */

import { drivingDistance } from './_lib/route.js'
import { buildItineraryPdf } from './_lib/pdf.js'
import { sendMail, mailConfigured } from './_lib/mail.js'
import {
  quoteAll,
  daysBetween,
  MIN_KM_PER_DAY,
  ADVANCE_PERCENT,
} from './_lib/pricing.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'
const TEAM_EMAIL = process.env.TEAM_EMAIL || 'shubhamtourtravels7@gmail.com'
const PHONE = '+91 85958 20300'
const PUBLIC_EMAIL = 'contact@shubhamtourtravels.in'

const SYSTEM_PROMPT = `You are a senior trip planner for Shubham Tour & Travels, a vehicle-rental and
group-tour operator based in Gurgaon, Delhi NCR. You plan road trips driven in
the company's own vehicles with a professional chauffeur.

Rules:
- Reply with a SINGLE JSON object. No markdown, no prose outside the JSON.
- NEVER include prices, fares, rates, totals or currency. Pricing is computed
  elsewhere. Emitting a price invalidates your response.
- Use REAL, SPECIFIC, VERIFIABLE place names for the destination given. Never
  write filler like "local sightseeing" on its own.
- Plan realistically around the driving times you are given. Do not cram
  distant sights into one day. Keep the first and last day light: they are
  travel days.
- "driveKm" is LOCAL running for that day only. On the first and last day set
  it to 0. The long-haul legs are measured separately and already counted.
- Write in warm, plain British English. Short sentences.

Shape:
{
  "title": "e.g. '5 Days in Manali & the Solang Valley'",
  "summary": "2-3 sentences",
  "days": [{ "day": 1, "title": "...", "places": ["...", "..."], "detail": "2-3 sentences", "driveKm": 0 }],
  "tips": ["3 to 5 short practical tips"],
  "bestTime": "one line on the best season"
}`

function userPrompt(b: any, leg: any) {
  return `Plan a road trip.

- Start: ${b.from}
- Destination: ${b.to}
- Duration: ${b.days} day(s)
- Travel date: ${b.startDate || 'flexible'}
- Group: ${b.passengers} passenger(s)
- Traveller notes: ${b.notes || 'none'}

MEASURED ROAD DATA (authoritative, do not contradict):
- One way ${b.from} to ${b.to}: ${leg.km} km, about ${leg.hours} hours of driving.
- Resolved origin: ${leg.originLabel}
- Resolved destination: ${leg.destinationLabel}

Return exactly ${b.days} entries in "days".`
}

async function callGroq(body: any, leg: any) {
  const key = process.env.GROQ_API_KEY
  if (!key) throw new Error('GROQ_API_KEY is not configured on the server.')

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || DEFAULT_MODEL,
      temperature: 0.6,
      max_tokens: 2600,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt(body, leg) },
      ],
    }),
  })

  if (!res.ok) {
    throw new Error(`Groq error ${res.status}: ${(await res.text()).slice(0, 200)}`)
  }

  const data: any = await res.json()
  const raw = data?.choices?.[0]?.message?.content
  if (!raw) throw new Error('Groq returned an empty completion.')

  let plan: any
  try { plan = JSON.parse(raw) } catch { throw new Error('Groq returned malformed JSON.') }

  const days = Array.isArray(plan.days) ? plan.days : []
  if (!days.length) throw new Error('Groq returned no days.')

  return {
    title: String(plan.title || `${body.days} Days in ${body.to}`),
    summary: String(plan.summary || ''),
    days: days.map((d: any, i: number) => ({
      day: Number(d.day) || i + 1,
      title: String(d.title || `Day ${i + 1}`),
      places: Array.isArray(d.places) ? d.places.map(String).slice(0, 8) : [],
      detail: String(d.detail || ''),
      driveKm: Math.max(0, Math.min(400, Math.round(Number(d.driveKm) || 0))),
    })),
    tips: Array.isArray(plan.tips) ? plan.tips.map(String).slice(0, 6) : [],
    bestTime: String(plan.bestTime || ''),
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  body = body || {}

  const { name, email, phone, to } = body
  if (!name || !phone || !to || !body.startDate || !body.passengers) {
    res.status(400).json({ error: 'Missing required trip details.' })
    return
  }

  const from = body.from || 'Gurgaon, Delhi NCR'
  const days = daysBetween(body.startDate, body.endDate)
  const passengers = Number(body.passengers) || 1

  try {
    /* 1 ── Real distance ------------------------------------------------ */
    const leg = await drivingDistance(from, to)

    /* 2 ── Real itinerary ----------------------------------------------- */
    const plan = await callGroq({ ...body, from, days, passengers }, leg)

    /* 3 ── Distance total: both long-haul legs + local running ----------
       The model tends to under-report local running (it returned 34 km for
       two days in Manali, where Solang Valley alone is ~50 km return). An
       under-quote is worse than a slightly high one: the customer is billed
       on actual kilometres, so a low estimate turns into a bill dispute.
       Floor the sightseeing days at a realistic minimum. */
    const LOCAL_KM_FLOOR_PER_DAY = 60
    const sightseeingDays = Math.max(0, days - 2)
    const modelLocalKm = plan.days.reduce((s: number, d: any) => s + d.driveKm, 0)
    const localKm = Math.max(modelLocalKm, sightseeingDays * LOCAL_KM_FLOOR_PER_DAY)
    const totalKm = leg.km * 2 + localKm

    /* 4 ── Pricing ------------------------------------------------------ */
    /* Above the largest single vehicle we still produce the full itinerary.
       We simply do not price it here: the team arranges the required
       vehicles and sends the quotation. Refusing the request outright would
       lose the lead. */
    const quotes = quoteAll(passengers, days, totalKm)
    const quoteOnRequest = quotes.length === 0

    /* 5 ── PDF ---------------------------------------------------------- */
    const dates = body.endDate ? `${body.startDate} to ${body.endDate}` : body.startDate
    const pdfBase64 = buildItineraryPdf({
      customerName: name,
      from: leg.originLabel,
      to: leg.destinationLabel,
      dates,
      days,
      passengers,
      title: plan.title,
      summary: plan.summary,
      itineraryDays: plan.days,
      tips: plan.tips,
      oneWayKm: leg.km,
      totalKm,
      drivingHours: leg.hours,
      quoteOnRequest,
      quotes: quotes.map(q => ({
        name: q.vehicle.name,
        ratePerKm: q.vehicle.ratePerKm,
        minimumKm: q.minimumKm,
        baseFare: q.baseFare,
        extraKm: q.extraKm,
        extraFare: q.extraFare,
        total: q.total,
        advance: q.advance,
      })),
      advancePercent: ADVANCE_PERCENT,
      minKmPerDay: MIN_KM_PER_DAY,
      phone: PHONE,
      email: PUBLIC_EMAIL,
    })

    const fileName = `Itinerary-${String(to).replace(/[^\w]+/g, '-')}-${days}days.pdf`
    const best = quotes[0] || null

    /* 6 ── Deliver ------------------------------------------------------ */
    /* Default reason must reflect the real cause. Saying "no email address"
       when one was supplied but no transport is configured sends the reader
       hunting for the wrong problem. */
    const noTransport = 'email delivery is not configured on the server yet'
    let customerMail = {
      sent: false,
      provider: 'none',
      error: mailConfigured() ? 'no email address given' : noTransport,
    }
    let teamMail = { sent: false, provider: 'none', error: noTransport }

    if (mailConfigured()) {
      if (email) {
        customerMail = await sendMail({
          to: email,
          subject: `Your ${to} itinerary | Shubham Tour & Travels`,
          text:
            `Hello ${name},\n\n` +
            `Thank you for your enquiry. Your ${days}-day itinerary for ${to} is attached as a PDF.\n\n` +
            `Route:      ${from} to ${to}\n` +
            `Dates:      ${dates}\n` +
            `Distance:   approx ${totalKm} km return, including local sightseeing\n` +
            (best
              ? `Vehicle:    ${best.vehicle.name}\n` +
                `Estimate:   Rs. ${best.total.toLocaleString('en-IN')}\n` +
                `Advance:    Rs. ${best.advance.toLocaleString('en-IN')} (${ADVANCE_PERCENT}%)\n\n`
              : `Vehicles:   We will arrange the required vehicles for your group of ${passengers}.\n` +
                `            Our team will get back to you with the rates and a full quotation.\n\n`) +
            `One of our team will call you shortly to personalise this: hotels, meal\n` +
            `preferences, pace, and any stops you would like added or dropped.\n\n` +
            `Warm regards,\nShubham Tour & Travels\n${PHONE}`,
          attachments: [{ filename: fileName, content: pdfBase64 }],
        })
      }

      teamMail = await sendMail({
        to: TEAM_EMAIL,
        subject: `${quoteOnRequest ? 'NEW LEAD (needs quote)' : 'NEW LEAD'}: ${to} · ${days}d · ${passengers}pax · ${name}`,
        text:
          `New itinerary request from the website.\n\n` +
          `Name:       ${name}\nPhone:      ${phone}\nEmail:      ${email || 'not provided'}\n\n` +
          `Route:      ${from} to ${to}\nDates:      ${dates} (${days} days)\n` +
          `Passengers: ${passengers}\nService:    ${body.service || 'not specified'}\n\n` +
          `Distance:   ${leg.km} km one way (${leg.provider}), ${totalKm} km total\n` +
          (best
            ? `Quoted:     ${best.vehicle.name} @ Rs.${best.vehicle.ratePerKm}/km = Rs. ${best.total.toLocaleString('en-IN')}\n` +
              `Advance:    Rs. ${best.advance.toLocaleString('en-IN')}\n\n`
            : `Quoted:     NONE. ${passengers} passengers exceeds a single vehicle, NEEDS MANUAL QUOTE.\n\n`) +
          `Notes:      ${body.notes || 'none'}\n\n` +
          `Customer copy sent: ${customerMail.sent ? 'yes' : 'NO: ' + customerMail.error}\n` +
          `PDF attached below.`,
        attachments: [{ filename: fileName, content: pdfBase64 }],
      })
    }

    /* 7 ── Confirmation only. The plan itself is not returned to the page. */
    res.status(200).json({
      ok: true,
      emailedTo: customerMail.sent ? email : null,
      teamNotified: teamMail.sent,
      mailConfigured: mailConfigured(),
      mailError: customerMail.sent ? undefined : customerMail.error,
      days,
      totalKm,
      oneWayKm: leg.km,
      distanceProvider: leg.provider,
      quoteOnRequest,
      vehicle: best ? best.vehicle.name : null,
      total: best ? best.total : null,
      advance: best ? best.advance : null,
    })
  } catch (err: any) {
    res.status(502).json({ error: err?.message || 'Could not generate your itinerary.' })
  }
}
