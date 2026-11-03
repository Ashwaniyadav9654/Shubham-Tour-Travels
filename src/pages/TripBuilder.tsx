import React, { useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CalendarDays, Car, Check, Hotel, Loader2, MapPin, Minus, Plus, Trash2, Users, MessageSquare,
} from 'lucide-react'
import { tourPackages, vehicles } from '@/data'
import { packageInclusions } from '@/data/packages'
import { activitiesByPackage } from '@/data/activities'
import type { TourPackage } from '@/types'
import { cn, whatsappLink, PHONE_HREF, PHONE_NUMBER } from '@/lib/utils'
import { btn, WhatsAppIcon } from '@/components/site/ui'
import { imgSet } from '@/lib/img'

type Stars = '3' | '4' | '5'
const STAR_OPTIONS: Stars[] = ['3', '4', '5']

interface Day {
  key: string
  title: string
  extra?: boolean
  activities: string[]
  /** Hotel class for the night after this day; undefined follows the trip default. */
  stars?: Stars
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const card = 'rounded-3xl border border-line bg-white p-6 md:p-7'
const label = 'block text-[11px] font-semibold uppercase tracking-wider text-navy-muted'
const input =
  'mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-navy outline-none focus:border-sea'

let keySeq = 0
const newKey = () => `x${++keySeq}`

function addDays(iso: string, n: number) {
  const d = new Date(iso)
  d.setDate(d.getDate() + n)
  return d
}
const fmt = (d: Date) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function TripBuilderPage() {
  const { id } = useParams<{ id: string }>()
  if (!id) return <PackagePicker />
  const pkg = tourPackages.find((p) => p.id === id)
  if (!pkg) return <Navigate to="/customize" replace />
  return <Builder key={pkg.id} pkg={pkg} />
}

/* ─── Step 0: choose a trip to start from ─────────────────────────── */

function PackagePicker() {
  return (
    <div className="bg-mist">
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 md:pt-24">
        <p className="text-sm font-medium text-sea">Build your own trip</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-navy md:text-5xl">
          Pick a trip to start from.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-navy-muted">
          Then change the days, hotels, activities and vehicle until it is exactly the trip you want.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tourPackages.map((p) => (
            <Link
              key={p.id}
              to={`/customize/${p.id}`}
              className="group flex items-center gap-4 rounded-3xl border border-line bg-white p-3 transition-colors hover:border-sea"
            >
              <img {...imgSet(p.image, [480])} sizes="96px" width={96} height={80} alt={p.title} loading="lazy" className="h-20 w-24 shrink-0 rounded-2xl object-cover" />
              <span className="min-w-0">
                <span className="block truncate font-display text-lg font-semibold text-navy group-hover:text-sea">
                  {p.title}
                </span>
                <span className="block text-sm text-navy-muted">{p.duration}</span>
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-navy-muted">
          Somewhere not listed?{' '}
          <Link to="/booking" className="font-semibold text-sea hover:underline">
            Tell us where you want to go
          </Link>{' '}
          and we will plan it.
        </p>
      </section>
    </div>
  )
}

/* ─── The builder ─────────────────────────────────────────────────── */

function Builder({ pkg }: { pkg: TourPackage }) {
  const [params] = useSearchParams()
  const catalog = activitiesByPackage[pkg.id] ?? []

  const [date, setDate] = useState(params.get('date') ?? '')
  const [adults, setAdults] = useState(Math.max(1, Number(params.get('adults')) || 2))
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState<number | null>(null)
  const [pickup, setPickup] = useState('Gurgaon')
  const [defaultStars, setDefaultStars] = useState<Stars>('3')
  const [days, setDays] = useState<Day[]>(() =>
    pkg.itinerary.map((title, i) => ({ key: `d${i}`, title, activities: [] }))
  )
  const [vehicleId, setVehicleId] = useState('')
  const [requests, setRequests] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const pax = adults + children
  const roomCount = rooms ?? Math.max(1, Math.ceil(adults / 2))
  const hasStays = !pkg.sameDay
  const nights = hasStays ? Math.max(0, days.length - 1) : 0

  const fitting = useMemo(
    () => vehicles.filter((v) => v.seats >= pax).sort((a, b) => a.seats - b.seats),
    [pax]
  )
  const vehicle = fitting.find((v) => v.id === vehicleId) ?? fitting[0]

  /* Day editing */
  const updateDay = (key: string, patch: Partial<Day>) =>
    setDays((ds) => ds.map((d) => (d.key === key ? { ...d, ...patch } : d)))
  const toggleActivity = (key: string, act: string) =>
    setDays((ds) =>
      ds.map((d) =>
        d.key === key
          ? { ...d, activities: d.activities.includes(act) ? d.activities.filter((x) => x !== act) : [...d.activities, act] }
          : d
      )
    )
  const addDayAfter = (i: number) =>
    setDays((ds) => [
      ...ds.slice(0, i + 1),
      { key: newKey(), title: 'Extra day: local sightseeing at leisure', extra: true, activities: [] },
      ...ds.slice(i + 1),
    ])
  const removeDay = (key: string) => setDays((ds) => (ds.length > 1 ? ds.filter((d) => d.key !== key) : ds))

  const starsFor = (d: Day) => d.stars ?? defaultStars
  const activityName = (id: string) => catalog.find((a) => a.id === id)?.name ?? id
  const totalActivities = days.reduce((n, d) => n + d.activities.length, 0)

  /* The plan as plain text — goes to email and WhatsApp unchanged. */
  const planText = useMemo(() => {
    const start = date ? fmt(new Date(date)) : 'Flexible'
    const end = date ? fmt(addDays(date, days.length - 1)) : ''
    const lines = [
      `CUSTOM TRIP: ${pkg.title}`,
      `${days.length} day${days.length > 1 ? 's' : ''}${hasStays ? ` / ${nights} night${nights === 1 ? '' : 's'}` : ''}`,
      `Dates: ${start}${end ? ` to ${end}` : ''}`,
      `Pickup from: ${pickup || 'Not specified'}`,
      `Travellers: ${adults} adult${adults > 1 ? 's' : ''}${children ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`,
      hasStays ? `Rooms: ${roomCount}` : null,
      `Vehicle: ${vehicle ? `${vehicle.name} (${vehicle.seats} seats)` : `Multiple vehicles for ${pax} travellers`}`,
      hasStays ? 'Meals: Breakfast & dinner included' : null,
      '',
      'DAY BY DAY',
      ...days.flatMap((d, i) => {
        const stay = hasStays && i < days.length - 1 ? ` | Hotel: ${starsFor(d)} Star` : ''
        return [
          `Day ${i + 1}: ${d.title}${stay}`,
          ...(d.activities.length ? [`   Activities: ${d.activities.map(activityName).join(', ')}`] : []),
        ]
      }),
      requests ? '' : null,
      requests ? `SPECIAL REQUESTS: ${requests}` : null,
    ]
    return lines.filter((l) => l !== null).join('\n')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg, date, days, pickup, adults, children, roomCount, vehicle, requests, defaultStars, hasStays, nights, pax])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please add your name and phone number so we can call you back.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email,
          subject: `Custom trip: ${pkg.title}`,
          from: pickup, to: pkg.destination, date, passengers: pax,
          message: planText,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data?.ok) setStatus('sent')
      else {
        setErrorMsg(data?.error || `Something went wrong. Please call us on ${PHONE_NUMBER}.`)
        setStatus('error')
      }
    } catch {
      setErrorMsg(`We could not reach the server. Please send it on WhatsApp or call ${PHONE_NUMBER}.`)
      setStatus('error')
    }
  }

  const waHref = whatsappLink(
    `Hello Shubham Tour & Travels! I'd like a quote for this trip${name ? ` (${name})` : ''}:\n\n${planText}`
  )

  return (
    <div className="bg-mist">
      {/* Header */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="relative overflow-hidden rounded-[2rem]">
          <img src={pkg.image} alt={`${pkg.title}: customise your trip`} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />
          <div className="relative px-6 py-12 sm:px-10 md:px-14 md:py-16">
            <Link to={`/tours/${pkg.id}`} className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
              <ArrowLeft size={16} /> Back to {pkg.title}
            </Link>
            <p className="mt-6 text-sm font-medium text-sun">Customise your trip</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-white md:text-5xl">{pkg.title}</h1>
            <p className="mt-3 max-w-xl text-white/80">
              Change the days, hotels, activities and vehicle. When it looks right, send it to us and we will
              reply with a written quote.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* 1. Trip basics */}
          <div className={card}>
            <StepTitle n={1} icon={<CalendarDays size={18} />} title="Dates & travellers" />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label>
                <span className={label}>Start date</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={input} />
              </label>
              <label>
                <span className={label}>Pickup city</span>
                <input value={pickup} onChange={(e) => setPickup(e.target.value)} className={input} placeholder="e.g. Gurgaon" />
              </label>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Counter label="Adults" value={adults} min={1} onChange={setAdults} />
              <Counter label="Children" value={children} min={0} onChange={setChildren} />
              {hasStays && (
                <Counter label="Rooms" value={roomCount} min={1} onChange={(n) => setRooms(n)} />
              )}
            </div>
          </div>

          {/* 2. Hotels */}
          {hasStays && (
            <div className={card}>
              <StepTitle n={2} icon={<Hotel size={18} />} title="Hotel category" />
              <p className="mt-2 text-sm text-navy-muted">
                Applies to every night. You can change individual nights in the day-by-day plan below.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {STAR_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setDefaultStars(s)}
                    className={cn(
                      'rounded-2xl border px-4 py-4 text-center transition-colors',
                      defaultStars === s ? 'border-sea bg-sea-tint text-sea' : 'border-line text-navy hover:border-sea'
                    )}
                  >
                    <span className="block font-display text-2xl font-semibold">{s} ★</span>
                    <span className="block text-xs text-navy-muted">
                      {s === '3' ? 'Comfortable' : s === '4' ? 'Premium' : 'Luxury'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Day by day */}
          <div className={card}>
            <StepTitle n={hasStays ? 3 : 2} icon={<MapPin size={18} />} title="Day-by-day plan" />
            <p className="mt-2 text-sm text-navy-muted">
              Add local sightseeing to any day, add extra days, or remove the ones you do not need.
            </p>
            <ol className="mt-6 space-y-4">
              {days.map((d, i) => (
                <li key={d.key}>
                  <motion.div layout className="rounded-2xl border border-line bg-mist/60 p-4 md:p-5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sea text-sm font-semibold text-white">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-muted">
                          Day {i + 1}
                          {date && ` · ${fmt(addDays(date, i))}`}
                        </p>
                        {d.extra ? (
                          <input
                            value={d.title}
                            onChange={(e) => updateDay(d.key, { title: e.target.value })}
                            className={cn(input, 'mt-1')}
                          />
                        ) : (
                          <p className="mt-1 font-medium text-navy">{d.title}</p>
                        )}
                      </div>
                      {days.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDay(d.key)}
                          aria-label={`Remove day ${i + 1}`}
                          className="rounded-full p-2 text-navy-muted hover:bg-white hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {catalog.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 sm:pl-[52px]">
                        {catalog.map((act) => {
                          const on = d.activities.includes(act.id)
                          return (
                            <button
                              key={act.id}
                              type="button"
                              onClick={() => toggleActivity(d.key, act.id)}
                              title={act.duration}
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors',
                                on ? 'border-sea bg-sea text-white' : 'border-line bg-white text-navy-soft hover:border-sea hover:text-sea'
                              )}
                            >
                              {on ? <Check size={12} /> : <Plus size={12} />}
                              {act.name}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {hasStays && i < days.length - 1 && (
                      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3 text-sm">
                        <Hotel size={14} className="text-navy-muted" />
                        <span className="text-navy-muted">Tonight&rsquo;s hotel:</span>
                        {STAR_OPTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updateDay(d.key, { stars: s === defaultStars ? undefined : s })}
                            className={cn(
                              'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                              starsFor(d) === s ? 'bg-navy text-white' : 'bg-white text-navy-soft hover:text-navy'
                            )}
                          >
                            {s} ★
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  <button
                    type="button"
                    onClick={() => addDayAfter(i)}
                    className="mx-auto mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-sea hover:bg-sea-tint"
                  >
                    <Plus size={13} /> Add a day here
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* 4. Vehicle */}
          <div className={card}>
            <StepTitle n={hasStays ? 4 : 3} icon={<Car size={18} />} title="Vehicle" />
            <p className="mt-2 text-sm text-navy-muted">
              Showing vehicles that seat {pax} {pax === 1 ? 'traveller' : 'travellers'}.
            </p>
            {fitting.length === 0 ? (
              <p className="mt-5 rounded-2xl bg-sea-tint p-4 text-sm text-navy">
                For {pax} travellers we will arrange more than one vehicle. Mention any preference in your requests.
              </p>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {fitting.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleId(v.id)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors',
                      vehicle?.id === v.id ? 'border-sea bg-sea-tint' : 'border-line hover:border-sea'
                    )}
                  >
                    <img {...imgSet(v.images[0], [480])} sizes="80px" width={80} height={56} alt={v.name} loading="lazy" className="h-14 w-20 shrink-0 rounded-xl object-cover" />
                    <span>
                      <span className="block font-semibold text-navy">{v.name}</span>
                      <span className="block text-xs text-navy-muted">
                        {v.seats} seats · {v.fuelType}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Meals & requests */}
          <div className={card}>
            <StepTitle n={hasStays ? 5 : 4} icon={<MessageSquare size={18} />} title="Special requests" />
            {hasStays && <p className="mt-2 text-sm text-navy-muted">Breakfast and dinner are included at every hotel.</p>}
            <label className="mt-5 block">
              <span className={label}>Anything else?</span>
              <textarea
                rows={3}
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                placeholder="Honeymoon decoration, wheelchair access, a specific hotel, veg-only food…"
                className={input}
              />
            </label>
          </div>
        </div>

        {/* Summary + send */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form onSubmit={send} className="rounded-3xl border border-line bg-white p-6 shadow-xl shadow-navy/5">
            <h2 className="font-display text-2xl font-semibold text-navy">Your trip</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row k="Trip" v={pkg.title} />
              <Row
                k="Duration"
                v={`${days.length} day${days.length > 1 ? 's' : ''}${hasStays ? ` / ${nights} night${nights === 1 ? '' : 's'}` : ''}`}
              />
              <Row k="Dates" v={date ? `${fmt(new Date(date))} – ${fmt(addDays(date, days.length - 1))}` : 'Flexible'} />
              <Row k="Travellers" v={`${adults} adult${adults > 1 ? 's' : ''}${children ? `, ${children} child${children > 1 ? 'ren' : ''}` : ''}`} />
              {hasStays && <Row k="Hotels" v={hotelSummary(days.slice(0, -1).map(starsFor))} />}
              <Row k="Vehicle" v={vehicle?.name ?? 'Multiple vehicles'} />
              <Row k="Activities" v={totalActivities ? `${totalActivities} added` : 'None yet'} />
            </dl>

            <div className="mt-5 rounded-2xl bg-mist p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-navy-muted">Included</p>
              <ul className="mt-2 space-y-1.5 text-sm text-navy-soft">
                {packageInclusions(pkg).map((item) => (
                  <li key={item} className="flex gap-2">
                    <Check size={15} className="mt-0.5 shrink-0 text-sea" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {status === 'sent' ? (
              <div className="mt-6 rounded-2xl bg-sea-tint p-5 text-center">
                <p className="font-display text-xl font-semibold text-navy">Trip sent!</p>
                <p className="mt-1 text-sm text-navy-soft">
                  Our team will call you shortly with a written quote. Urgent? Call{' '}
                  <a href={PHONE_HREF} className="font-semibold text-sea">{PHONE_NUMBER}</a>.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-6 space-y-3">
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *" className={input} />
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number *" inputMode="tel" className={input} />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" type="email" className={input} />
                </div>
                {status === 'error' && errorMsg && <p className="mt-3 text-sm text-red-600">{errorMsg}</p>}
                <button type="submit" disabled={status === 'sending'} className={cn(btn.primary, 'mt-4 w-full py-3.5')}>
                  {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : null}
                  {status === 'sending' ? 'Sending…' : 'Send trip & get quote'}
                </button>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className={cn(btn.outline, 'mt-3 w-full')}>
                  <WhatsAppIcon /> Send on WhatsApp
                </a>
                <p className="mt-4 text-center text-xs text-navy-muted">
                  No payment now. We reply with a written quote; only 10% advance to confirm.
                </p>
              </>
            )}
          </form>
        </aside>
      </section>
    </div>
  )
}

function hotelSummary(stars: Stars[]) {
  if (stars.length === 0) return 'No overnight stay'
  const counts = STAR_OPTIONS.map((s) => [s, stars.filter((x) => x === s).length] as const).filter(([, n]) => n)
  if (counts.length === 1) return `${counts[0][0]} Star, all nights`
  return counts.map(([s, n]) => `${n}× ${s} Star`).join(', ')
}

function StepTitle({ n, icon, title }: { n: number; icon: React.ReactNode; title: string }) {
  return (
    <h2 className="flex items-center gap-3 font-display text-xl font-semibold text-navy">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sea-tint text-sea">{icon}</span>
      <span>
        <span className="mr-2 text-sm font-semibold text-sun-ink">{String(n).padStart(2, '0')}</span>
        {title}
      </span>
    </h2>
  )
}

function Counter({ label: text, value, min, onChange }: { label: string; value: number; min: number; onChange: (n: number) => void }) {
  return (
    <div>
      <span className={label}>{text}</span>
      <div className="mt-1.5 flex items-center justify-between rounded-xl border border-line px-2 py-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Fewer ${text.toLowerCase()}`}
          className="rounded-lg p-1.5 text-navy hover:bg-mist disabled:opacity-30"
          disabled={value <= min}
        >
          <Minus size={15} />
        </button>
        <span className="inline-flex items-center gap-1.5 font-semibold text-navy">
          {text === 'Rooms' ? <Hotel size={14} className="text-navy-muted" /> : <Users size={14} className="text-navy-muted" />}
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(60, value + 1))}
          aria-label={`More ${text.toLowerCase()}`}
          className="rounded-lg p-1.5 text-navy hover:bg-mist"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-navy-muted">{k}</dt>
      <dd className="text-right font-medium text-navy">{v}</dd>
    </div>
  )
}
