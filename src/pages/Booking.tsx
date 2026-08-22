import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Phone, MessageCircle, AlertCircle, Sparkles, Users,
  RotateCcw, Mail, Loader2, Car, MailCheck, Check,
} from 'lucide-react'
import { whatsappLink, PHONE_HREF, PHONE_NUMBER, EMAIL } from '@/lib/utils'
import { requestItinerary, type ItineraryReceipt } from '@/lib/itinerary'
import { formatINR, MIN_KM_PER_DAY, ADVANCE_PERCENT, vehiclesFor } from '@/lib/pricing'
import Magnetic from '@/components/animations/Magnetic'

/**
 * Service types only — no vehicle names.
 *
 * The vehicle is not something the customer should have to pick: it falls out
 * of the passenger count, and we suggest it live under that field instead.
 */
const serviceOptions = [
  'Airport Transfer',
  'Corporate Cab Service',
  'Wedding Transportation',
  'Luxury Group Tour',
]

type Status = 'idle' | 'generating' | 'ready' | 'error'

const emptyForm = {
  name: '', phone: '', email: '', service: '',
  from: '', to: '', date: '', returnDate: '', passengers: '', message: '',
}

export default function BookingPage() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<Status>('idle')
  const [receipt, setReceipt] = useState<ItineraryReceipt | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  /* Vehicles that fit the party, recomputed on every keystroke. */
  const paxCount = Number(form.passengers) || 0
  const suggested = paxCount > 0 ? vehiclesFor(paxCount) : []

  /* Itinerary needs a destination, a date and a party size on top of the
     contact details the old form already required. */
  const isValid = Boolean(form.name && form.phone && form.to && form.date && form.passengers)

  const handleGenerate = async () => {
    if (!isValid || status === 'generating') return
    setStatus('generating')
    setErrorMsg('')

    try {
      const r = await requestItinerary({
        name: form.name,
        phone: form.phone,
        email: form.email,
        from: form.from || 'Gurgaon, Delhi NCR',
        to: form.to,
        startDate: form.date,
        endDate: form.returnDate,
        passengers: Number(form.passengers) || 1,
        service: form.service,
        notes: form.message,
      })
      setReceipt(r)
      setStatus('ready')
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      )
    } catch (err: any) {
      setErrorMsg(err?.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const whatsappText = () =>
    `*Itinerary request | Shubham Tour & Travels*

` +
    `Name: ${form.name || '-'}
Phone: ${form.phone || '-'}
` +
    `Trip: ${form.from || 'Gurgaon'} → ${form.to || '-'}
` +
    `Dates: ${form.date || '-'}${form.returnDate ? ` to ${form.returnDate}` : ''}
` +
    `Passengers: ${form.passengers || '-'}
` +
    (form.service ? `Service: ${form.service}
` : '') +
    `
Please help me plan this.`

  const reset = () => {
    setForm(emptyForm)
    setReceipt(null)
    setErrorMsg('')
    setStatus('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="bg-bone">

      {/* ══════════════════════════════════════════════════════════
          HEADER — the promise
          ══════════════════════════════════════════════════════════ */}
      <section className="relative bg-ink py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/cars/maharaja-interior.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.24) contrast(1.12) saturate(1.05)' }}
            onError={(e) => { (e.currentTarget.style.display = 'none') }}
          />
          <div className="absolute inset-0 bg-ink/84" />
        </div>

        <div className="relative z-10 shell">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-5 mb-8">
              <span className="eyebrow text-brass">Free · No obligation</span>
              <span className="h-px w-16 bg-hairline" />
              <span className="eyebrow text-obsidian-400">Takes 60 seconds</span>
            </div>

            <h1 className="display-lg text-bone max-w-[18ch]">
              Generate your<br />
              <em className="text-brass" style={{ fontStyle: 'italic' }}>itinerary.</em>
            </h1>

            <p className="lede text-obsidian-300 mt-10 max-w-2xl">
              Tell us where you want to go and how many of you there are. We&rsquo;ll build
              a day-by-day plan with the places worth stopping for, work out the distance,
              and give you a clear base price for the right vehicle.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-hairline border border-hairline max-w-3xl">
              {[
                { n: '01', t: 'Share your trip', d: 'Destination, dates, group size.' },
                { n: '02', t: 'Get your plan', d: 'Emailed to you as a PDF within a minute.' },
                { n: '03', t: 'We personalise it', d: 'Our team calls you to tune the stay, food and pace.' },
              ].map(s => (
                <div key={s.n} className="bg-ink p-6">
                  <div className="eyebrow text-[9px] text-brass mb-3">{s.n}</div>
                  <div className="font-display text-bone text-[17px] tracking-tighter mb-2">{s.t}</div>
                  <div className="text-obsidian-500 text-[13px] font-light leading-relaxed">{s.d}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          FORM
          ══════════════════════════════════════════════════════════ */}
      <section className="section-pad">
        <div className="shell">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">

            <div className="lg:col-span-8">
              <div className="bg-white border border-obsidian-950/10 p-8 md:p-12">
                <div className="flex items-center gap-5 mb-10">
                  <span className="eyebrow text-gold-600">Your Trip</span>
                  <span className="h-px flex-1 bg-obsidian-950/10" />
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 text-red-700 text-sm mb-8">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>
                      {errorMsg || 'Something went wrong building your itinerary.'}{' '}
                      You can also reach us on WhatsApp and we&rsquo;ll plan it with you directly.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Full Name *</label>
                    <input type="text" className="input-luxury" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Phone Number *</label>
                    <input type="tel" className="input-luxury" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Email</label>
                    <input type="email" className="input-luxury" placeholder="email@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                    <p className="text-obsidian-400 text-[11px] mt-2 font-light">We&rsquo;ll email the itinerary here.</p>
                  </div>
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Preferred Service</label>
                    <select className="input-luxury" value={form.service} onChange={e => update('service', e.target.value)}>
                      <option value="">Select a service</option>
                      {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">From (Pickup Location)</label>
                    <input type="text" className="input-luxury" placeholder="Gurgaon, Delhi NCR" value={form.from} onChange={e => update('from', e.target.value)} />
                  </div>
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Destination *</label>
                    <input type="text" className="input-luxury" placeholder="Manali, Jaipur, Shimla…" value={form.to} onChange={e => update('to', e.target.value)} />
                  </div>
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Travel Date *</label>
                    <input type="date" min={today} className="input-luxury" value={form.date} onChange={e => update('date', e.target.value)} />
                  </div>
                  <div>
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Return Date</label>
                    <input type="date" min={form.date || today} className="input-luxury" value={form.returnDate} onChange={e => update('returnDate', e.target.value)} />
                    <p className="text-obsidian-400 text-[11px] mt-2 font-light">Sets the number of days in your plan.</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Number of Passengers *</label>
                    <input type="number" min="1" max="50" className="input-luxury" placeholder="e.g. 12" value={form.passengers} onChange={e => update('passengers', e.target.value)} />

                    {/* ── Live vehicle suggestion ──────────────────────
                        Fires the moment a passenger count is entered, so the
                        customer sees what they'd travel in before committing
                        to generating anything. */}
                    {paxCount > 0 && (
                      <motion.div
                        key={suggested.length ? suggested.map(v => v.id).join() : 'none'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-6 border border-obsidian-950/10 bg-bone p-6"
                      >
                        {suggested.length > 0 ? (
                          <>
                            <div className="flex items-center gap-2.5 mb-5">
                              <Car size={13} strokeWidth={1.6} className="text-gold-600" />
                              <span className="eyebrow text-[9px] text-gold-600">
                                Available for {paxCount} {paxCount === 1 ? 'guest' : 'guests'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {suggested.map((v, i) => (
                                <div
                                  key={v.id}
                                  className={`p-5 border bg-white ${
                                    i === 0 ? 'border-gold-500/50' : 'border-obsidian-950/10'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <div className="font-display text-obsidian-950 text-[17px] tracking-tighter leading-tight">
                                      {v.name}
                                    </div>
                                    <div className="eyebrow text-[8px] text-obsidian-400 shrink-0 pt-1">
                                      {v.minPax}–{v.maxPax}
                                    </div>
                                  </div>
                                  {i === 0 && (
                                    <div className="eyebrow text-[8px] text-gold-600 mb-2">Recommended</div>
                                  )}
                                  <p className="text-obsidian-500 text-[12px] font-light leading-relaxed">
                                    {v.blurb}
                                  </p>
                                </div>
                              ))}
                            </div>

                            <p className="text-obsidian-400 text-[11px] mt-5 font-light leading-relaxed">
                              Your full quotation is included in the itinerary we email you.
                            </p>
                          </>
                        ) : (
                          <div className="flex items-start gap-3">
                            <Users size={14} strokeWidth={1.6} className="text-gold-600 shrink-0 mt-0.5" />
                            <p className="text-obsidian-600 text-[13px] font-light leading-relaxed">
                              For {paxCount} guests we will arrange the required vehicles for
                              you. Generate your itinerary and our team will get back to you
                              with the rates and a full quotation.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="eyebrow text-[9px] text-obsidian-400 block mb-3">Anything else we should know?</label>
                    <textarea rows={3} className="input-luxury resize-none" placeholder="Elderly travellers, food preferences, must-see places, budget…" value={form.message} onChange={e => update('message', e.target.value)} />
                  </div>
                </div>

                {/* ── Primary action ───────────────────────────── */}
                <div className="mt-12 pt-10 border-t border-obsidian-950/10">
                  <Magnetic strength={0.24} as="block">
                    <button
                      onClick={handleGenerate}
                      disabled={!isValid || status === 'generating'}
                      className="btn-gold w-full py-5 text-[11px] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {status === 'generating' ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Building your itinerary…
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} strokeWidth={1.6} />
                          Generate My Itinerary
                        </>
                      )}
                    </button>
                  </Magnetic>
                  <p className="text-obsidian-400 text-[12px] mt-4 text-center font-light">
                    We&rsquo;ll email your plan as a PDF, with the route and a full quotation.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Sidebar: separate ways to reach us ─────────────── */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-ink p-8">
                <div className="eyebrow text-[9px] text-brass mb-5">Rather just talk?</div>
                <h3 className="font-display text-bone text-[21px] tracking-tighter leading-tight mb-3">
                  Skip the form.
                </h3>
                <p className="text-obsidian-400 text-[13px] font-light leading-relaxed mb-7">
                  Our team plans routes all day. Message or call and we&rsquo;ll put
                  something together with you in minutes.
                </p>

                <div className="flex flex-col gap-3">
                  <a
                    href={whatsappLink(whatsappText())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-6 py-4 text-[10px] font-semibold tracking-widest uppercase hover:bg-[#20b858] transition-colors"
                  >
                    <MessageCircle size={15} strokeWidth={1.8} />
                    Chat on WhatsApp
                  </a>
                  <a href={PHONE_HREF} className="btn-luxury on-dark w-full">
                    <Phone size={14} strokeWidth={1.8} />
                    {PHONE_NUMBER}
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center justify-center gap-3 text-obsidian-400 hover:text-brass transition-colors text-[12px] pt-2"
                  >
                    <Mail size={13} strokeWidth={1.6} />
                    {EMAIL}
                  </a>
                </div>
              </div>

              {/* What every booking includes */}
              <div className="bg-white border border-obsidian-950/10 p-8">
                <div className="eyebrow text-[9px] text-obsidian-400 mb-6">Every Booking Includes</div>
                <ul className="space-y-3.5">
                  {[
                    'Fuel, driver allowance, tolls and state tax',
                    'Professional, uniformed chauffeur',
                    'GPS tracked, sanitised vehicle',
                    'GST invoice on request',
                    '24/7 support for the whole trip',
                  ].map(item => (
                    <li key={item} className="flex items-start gap-3 text-[13px] text-obsidian-600 font-light leading-relaxed">
                      <Check size={12} strokeWidth={2.2} className="text-gold-600 shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 pt-6 border-t border-obsidian-950/10 space-y-2 text-[11px] text-obsidian-500 font-light leading-relaxed">
                  <p>Outstation trips are billed on a minimum of {MIN_KM_PER_DAY} km per day. Parking is extra.</p>
                  <p className="text-gold-600">Only {ADVANCE_PERCENT}% advance to confirm.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONFIRMATION
          The itinerary itself is never rendered here — it goes out as a
          PDF attachment. Showing it twice invites the customer to compare
          the page against the document and spot cosmetic differences.
          ══════════════════════════════════════════════════════════ */}
      {status === 'ready' && receipt && (
        <section ref={resultRef} className="section-pad bg-ink scroll-mt-24">
          <div className="shell max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 border border-brass/40 mb-10">
                <MailCheck size={26} strokeWidth={1.3} className="text-brass" />
              </div>

              <div className="eyebrow text-brass mb-6">Itinerary sent</div>

              <h2 className="display-lg text-bone mb-8">
                {receipt.emailedTo ? (
                  <>Check your<br /><em className="text-brass" style={{ fontStyle: 'italic' }}>inbox.</em></>
                ) : (
                  <>We&rsquo;re on<br /><em className="text-brass" style={{ fontStyle: 'italic' }}>it.</em></>
                )}
              </h2>

              <p className="lede text-obsidian-300 mx-auto">
                {receipt.emailedTo ? (
                  <>
                    Your {receipt.days}-day plan for <strong className="text-bone">{form.to}</strong> has
                    been emailed to <strong className="text-bone">{receipt.emailedTo}</strong> as a PDF,
                    with the day-by-day route and a full price breakdown.
                  </>
                ) : (
                  <>
                    Your {receipt.days}-day plan for <strong className="text-bone">{form.to}</strong> is
                    ready and our team has it. We&rsquo;ll send it across and call you shortly.
                  </>
                )}
              </p>

              {/* Just enough to prove it's real, without reprinting the plan */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-hairline border border-hairline text-left">
                {[
                  ['Duration', `${receipt.days} day${receipt.days > 1 ? 's' : ''}`],
                  ['Distance', `~${receipt.totalKm} km`],
                  ['Vehicle', receipt.vehicle ?? 'Multiple vehicles'],
                  receipt.quoteOnRequest || receipt.advance === null
                    ? ['Quotation', 'Team will confirm']
                    : [`${ADVANCE_PERCENT}% advance`, formatINR(receipt.advance)],
                ].map(([label, value]) => (
                  <div key={label} className="bg-ink p-5">
                    <div className="eyebrow text-[9px] text-obsidian-600 mb-2">{label}</div>
                    <div className="text-bone text-[15px] font-light">{value}</div>
                  </div>
                ))}
              </div>

              {/* ── Estimated base price ──────────────────────────────
                  Sits below the advance so the customer can see what the
                  10% is 10% OF. Suppressed entirely above 20 passengers:
                  no single vehicle covers the group, so any figure we put
                  here would be one we could not stand behind. */}
              {!receipt.quoteOnRequest && receipt.total !== null && (
                <div className="border border-hairline border-t-0 p-6 flex flex-wrap items-end justify-between gap-4 text-left">
                  <div>
                    <div className="eyebrow text-[9px] text-brass mb-2">Estimated base price</div>
                    <div className="text-obsidian-500 text-[12px] font-light">
                      {receipt.vehicle} &middot; {receipt.days} day
                      {receipt.days > 1 ? 's' : ''} &middot; approx {receipt.totalKm} km
                    </div>
                  </div>
                  <div className="font-display text-bone text-[2rem] tracking-tighter leading-none">
                    {formatINR(receipt.total)}
                  </div>
                </div>
              )}

              {!receipt.emailedTo && receipt.mailError && (
                <div className="flex items-start gap-3 mt-8 p-5 border border-hairline text-left">
                  <AlertCircle size={15} className="text-brass shrink-0 mt-0.5" />
                  <p className="text-obsidian-400 text-[13px] font-light leading-relaxed">
                    The email didn&rsquo;t go out ({receipt.mailError}). Send us a message on
                    WhatsApp and we&rsquo;ll get the PDF to you right away.
                  </p>
                </div>
              )}

              {receipt.quoteOnRequest && (
                <p className="text-obsidian-400 text-[13px] font-light leading-relaxed mt-8 max-w-lg mx-auto">
                  Your group needs more than one vehicle. We will arrange the required
                  vehicles for you, and our team will get back to you with the rates and
                  a full quotation.
                </p>
              )}

              <p className="text-obsidian-500 text-[13px] font-light leading-relaxed mt-10 max-w-lg mx-auto">
                Next, one of our team will call you to personalise it: hotels, meal
                preferences, pace, and any stops you want added or dropped. Nothing is
                confirmed until you&rsquo;re happy.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
                <a
                  href={whatsappLink(whatsappText())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 bg-[#25D366] text-white px-7 py-4 text-[10px] font-semibold tracking-widest uppercase hover:bg-[#20b858] transition-colors"
                >
                  <MessageCircle size={15} strokeWidth={1.8} />
                  Message us
                </a>
                <a href={PHONE_HREF} className="btn-luxury on-dark">
                  <Phone size={14} strokeWidth={1.8} />
                  {PHONE_NUMBER}
                </a>
              </div>

              <button
                onClick={reset}
                className="inline-flex items-center gap-2.5 text-obsidian-500 hover:text-bone transition-colors text-[11px] tracking-widest uppercase mt-10"
              >
                <RotateCcw size={12} />
                Plan another trip
              </button>
            </motion.div>
          </div>
        </section>
      )}

    </div>
  )
}
