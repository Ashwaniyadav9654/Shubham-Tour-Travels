import { jsPDF } from 'jspdf'

/**
 * Renders the itinerary as a PDF and returns it base64-encoded, ready to
 * attach to an email.
 *
 * NOTE ON CURRENCY: jsPDF's built-in fonts are WinAnsi-encoded and have no
 * glyph for the rupee sign — "₹" renders as a black box. Everything here
 * uses "Rs." instead. Do not "fix" this by pasting ₹ back in without also
 * embedding a Unicode font.
 */

export interface PdfDay {
  day: number
  title: string
  places: string[]
  detail: string
  driveKm: number
}

export interface PdfQuote {
  name: string
  ratePerKm: number
  minimumKm: number
  baseFare: number
  extraKm: number
  extraFare: number
  total: number
  advance: number
}

export interface PdfInput {
  customerName: string
  from: string
  to: string
  dates: string
  days: number
  passengers: number
  title: string
  summary: string
  itineraryDays: PdfDay[]
  tips: string[]
  oneWayKm: number
  totalKm: number
  drivingHours: number
  quotes: PdfQuote[]
  /** True when the group exceeds a single vehicle and the team will quote. */
  quoteOnRequest?: boolean
  advancePercent: number
  minKmPerDay: number
  phone: string
  email: string
}

const INK: [number, number, number] = [11, 11, 12]
const BRASS: [number, number, number] = [176, 138, 74]
const GREY: [number, number, number] = [110, 108, 104]
const RULE: [number, number, number] = [214, 210, 202]

const money = (n: number) => 'Rs. ' + n.toLocaleString('en-IN')

export function buildItineraryPdf(d: PdfInput): string {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()
  const M = 48
  const CW = W - M * 2
  let y = 0

  /* Page-break helper: reserve `need` points, start a new page if short. */
  const room = (need: number) => {
    if (y + need > H - 60) {
      footer()
      doc.addPage()
      y = M
    }
  }

  const footer = () => {
    doc.setDrawColor(...RULE)
    doc.setLineWidth(0.5)
    doc.line(M, H - 44, W - M, H - 44)
    doc.setFont('helvetica', 'normal').setFontSize(7.5).setTextColor(...GREY)
    doc.text('Shubham Tour & Travels  ·  Gurgaon, Delhi NCR', M, H - 30)
    doc.text(`${d.phone}  ·  ${d.email}`, W - M, H - 30, { align: 'right' })
  }

  /* ── Cover band ───────────────────────────────────────────────── */
  doc.setFillColor(...INK)
  doc.rect(0, 0, W, 150, 'F')

  doc.setFont('helvetica', 'bold').setFontSize(9).setTextColor(...BRASS)
  doc.text('SHUBHAM TOUR & TRAVELS', M, 46)

  doc.setFont('times', 'normal').setFontSize(26).setTextColor(245, 243, 238)
  doc.text(doc.splitTextToSize(d.title, CW).slice(0, 2), M, 84)

  doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(170, 166, 158)
  doc.text(`Prepared for ${d.customerName}`, M, 130)

  y = 190

  /* ── Trip facts ───────────────────────────────────────────────── */
  const facts: [string, string][] = [
    ['ROUTE', `${d.from}  to  ${d.to}`],
    ['DATES', d.dates],
    ['DURATION', `${d.days} day${d.days > 1 ? 's' : ''}`],
    ['GROUP', `${d.passengers} passenger${d.passengers > 1 ? 's' : ''}`],
    ['ONE WAY', `${d.oneWayKm} km  (approx ${d.drivingHours} hrs driving)`],
    ['TOTAL DISTANCE', `${d.totalKm} km  (return + local sightseeing)`],
  ]

  facts.forEach(([k, v]) => {
    room(24)
    doc.setFont('helvetica', 'bold').setFontSize(7.5).setTextColor(...GREY)
    doc.text(k, M, y)
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(...INK)
    doc.text(v, M + 110, y)
    y += 20
  })

  y += 10
  doc.setDrawColor(...RULE); doc.setLineWidth(0.5); doc.line(M, y, W - M, y); y += 26

  /* ── Summary ──────────────────────────────────────────────────── */
  if (d.summary) {
    const lines = doc.splitTextToSize(d.summary, CW)
    room(lines.length * 13 + 20)
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(70, 68, 65)
    doc.text(lines, M, y)
    y += lines.length * 13 + 22
  }

  /* ── Day by day ───────────────────────────────────────────────── */
  room(40)
  doc.setFont('times', 'normal').setFontSize(16).setTextColor(...INK)
  doc.text('Day by day', M, y); y += 24

  d.itineraryDays.forEach(day => {
    const detail = doc.splitTextToSize(day.detail || '', CW - 14)
    const places = day.places.length
      ? doc.splitTextToSize('Places: ' + day.places.join('  ·  '), CW - 14)
      : []
    room(38 + detail.length * 12 + places.length * 12)

    doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...BRASS)
    doc.text(`DAY ${day.day}`, M, y)
    if (day.driveKm > 0) {
      doc.setTextColor(...GREY)
      doc.text(`${day.driveKm} km`, W - M, y, { align: 'right' })
    }
    y += 15

    doc.setFont('times', 'normal').setFontSize(13).setTextColor(...INK)
    doc.text(day.title, M, y); y += 16

    if (detail.length) {
      doc.setFont('helvetica', 'normal').setFontSize(9.5).setTextColor(70, 68, 65)
      doc.text(detail, M, y); y += detail.length * 12 + 3
    }
    if (places.length) {
      doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...GREY)
      doc.text(places, M, y); y += places.length * 12
    }

    y += 8
    doc.setDrawColor(...RULE); doc.line(M, y, W - M, y); y += 18
  })

  /* ── Pricing ──────────────────────────────────────────────────── */
  room(60)
  y += 6
  doc.setFont('times', 'normal').setFontSize(16).setTextColor(...INK)
  doc.text('Your estimate', M, y); y += 12

  if (d.quoteOnRequest) {
    const msg = doc.splitTextToSize(
      `Your group of ${d.passengers} needs more than one vehicle. We will arrange the ` +
      `required vehicles for you, and our team will get back to you with the rates and ` +
      `a full quotation for this itinerary.`,
      CW
    )
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(70, 68, 65)
    doc.text(msg, M, y + 14)
    y += msg.length * 13 + 30
  } else {
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...GREY)
    doc.text(
      `Minimum ${d.minKmPerDay} km billed per day  ·  ${d.days} x ${d.minKmPerDay} = ${d.days * d.minKmPerDay} km`,
      M, y + 12
    )
    y += 34
  }

  d.quotes.forEach((q, i) => {
    room(96)

    if (i === 0) {
      doc.setFillColor(250, 248, 243)
      doc.rect(M - 8, y - 16, CW + 16, 88, 'F')
      doc.setFont('helvetica', 'bold').setFontSize(7).setTextColor(...BRASS)
      doc.text('RECOMMENDED', M, y - 4)
    }

    doc.setFont('times', 'normal').setFontSize(13).setTextColor(...INK)
    doc.text(q.name, M, y + 14)
    doc.setFont('helvetica', 'normal').setFontSize(9).setTextColor(...GREY)
    doc.text(`Rs. ${q.ratePerKm} / km`, W - M, y + 14, { align: 'right' })

    const rows: [string, string][] = [
      [`Base  ·  ${q.minimumKm} km`, money(q.baseFare)],
    ]
    if (q.extraKm > 0) rows.push([`Extra  ·  ${q.extraKm} km beyond minimum`, money(q.extraFare)])
    rows.push(['Estimated total', money(q.total)])
    rows.push([`${d.advancePercent}% advance to confirm`, money(q.advance)])

    let ry = y + 32
    rows.forEach(([k, v], ri) => {
      const bold = ri >= rows.length - 2
      doc.setFont('helvetica', bold ? 'bold' : 'normal').setFontSize(9.5)
      doc.setTextColor(...(ri === rows.length - 1 ? BRASS : bold ? INK : GREY))
      doc.text(k, M, ry)
      doc.text(v, W - M, ry, { align: 'right' })
      ry += 14
    })

    y = ry + 16
  })

  /* ── Terms + tips ─────────────────────────────────────────────── */
  room(70)
  doc.setDrawColor(...RULE); doc.line(M, y, W - M, y); y += 18

  const terms = [
    'Fuel, driver allowance, tolls and state tax are included. Parking is extra.',
    'Distances are measured door to door; final billing is on actual kilometres run.',
    `Only ${d.advancePercent}% advance confirms the vehicle. Balance is settled at the end of the trip.`,
    'Our team will call you to personalise hotels, meals, pace and stops.',
  ]
  doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...GREY)
  terms.forEach(t => {
    const l = doc.splitTextToSize('•  ' + t, CW)
    room(l.length * 11 + 4)
    doc.text(l, M, y); y += l.length * 11 + 3
  })

  if (d.tips.length) {
    y += 12
    room(30)
    doc.setFont('helvetica', 'bold').setFontSize(8).setTextColor(...INK)
    doc.text('GOOD TO KNOW', M, y); y += 14
    doc.setFont('helvetica', 'normal').setFontSize(8.5).setTextColor(...GREY)
    d.tips.forEach(t => {
      const l = doc.splitTextToSize('•  ' + t, CW)
      room(l.length * 11 + 4)
      doc.text(l, M, y); y += l.length * 11 + 3
    })
  }

  footer()
  return doc.output('datauristring').split(',')[1]  // base64 only
}
