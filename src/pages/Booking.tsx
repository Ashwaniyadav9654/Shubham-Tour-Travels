import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react'
import { whatsappBookingLink, PHONE_HREF, PHONE_NUMBER, EMAIL } from '@/lib/utils'
import { sendBookingEmail } from '@/lib/emailjs'

const serviceOptions = [
  '12+2 Maharaja Luxury Tempo Traveller',
  '40 Seater AC Bus',
  'Hyundai Aura',
  'Maruti Baleno',
  'Toyota Innova Crysta (₹22/km)',
  'Maruti Grand Vitara (SUV)',
  'Honda City ZX (Sedan)',
  'Maruti Ciaz (Corporate)',
  'Maruti Ertiga (Family)',
  'Corporate Cab Service',
  'Airport Transfer',
  'Wedding Transportation',
  'Luxury Group Tour',
  'Other',
]

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', service: '',
    from: '', to: '', date: '', returnDate: '', passengers: '', message: '',
  })
  const [status, setStatus] = useState<Status>('idle')

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const isValid = form.name && form.phone && form.service && form.from && form.date

  const handleSubmit = async () => {
    if (!isValid) return
    setStatus('sending')
    const result = await sendBookingEmail({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      pickup_location: form.from,
      destination: form.to,
      travel_date: form.date + (form.returnDate ? ` → ${form.returnDate}` : ''),
      passengers: form.passengers,
      vehicle: form.service,
      message: form.message,
      subject: `Booking Inquiry – ${form.service}`,
    })
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  const handleWhatsApp = () => {
    const msg = `*New Booking Inquiry – Shubham Tour & Travels*\n\n` +
      `👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n📧 Email: ${form.email || 'N/A'}\n\n` +
      `🚗 Service: ${form.service}\n📍 From: ${form.from}\n📍 To: ${form.to || 'N/A'}\n` +
      `📅 Date: ${form.date}${form.returnDate ? `\n🔄 Return: ${form.returnDate}` : ''}\n` +
      `👥 Passengers: ${form.passengers || 'N/A'}\n\n` +
      `📝 Message: ${form.message || 'No additional message.'}`
    window.open(`https://wa.me/918595820300?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-obsidian-950 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <CheckCircle size={56} className="text-gold-500 mx-auto mb-6" />
          <h2 className="font-display text-white text-3xl mb-4">Booking Received!</h2>
          <p className="text-obsidian-400 mb-2">
            Your booking details have been sent to <strong className="text-gold-400">{EMAIL}</strong>
          </p>
          <p className="text-obsidian-500 text-sm mb-8">Our team will contact you within minutes to confirm your booking.</p>
          <div className="flex flex-col gap-3">
            <button onClick={handleWhatsApp} className="btn-gold text-xs flex items-center justify-center gap-2">
              <MessageCircle size={14} /> Also Send via WhatsApp
            </button>
            <button onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', email: '', service: '', from: '', to: '', date: '', returnDate: '', passengers: '', message: '' }) }} className="btn-luxury text-xs">
              New Booking
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-obsidian-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Reservations</span>
            </div>
            <h1 className="font-display text-white text-5xl">Book Your Journey</h1>
            <p className="text-obsidian-400 mt-3">Fill the form — your details go directly to <span className="text-gold-400">{EMAIL}</span></p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white border border-obsidian-100 p-8 md:p-10">
                <h2 className="font-display text-obsidian-950 text-2xl mb-8">Booking Details</h2>

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
                    <AlertCircle size={16} />
                    Email failed to send. Please try WhatsApp below or call us directly.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Full Name *</label>
                    <input type="text" className="input-luxury" placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Phone Number *</label>
                    <input type="tel" className="input-luxury" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Email</label>
                    <input type="email" className="input-luxury" placeholder="email@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Service Required *</label>
                    <select className="input-luxury" value={form.service} onChange={e => update('service', e.target.value)}>
                      <option value="">Select a service</option>
                      {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">From (Pickup Location) *</label>
                    <input type="text" className="input-luxury" placeholder="City / Area" value={form.from} onChange={e => update('from', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">To (Destination)</label>
                    <input type="text" className="input-luxury" placeholder="Destination" value={form.to} onChange={e => update('to', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Travel Date *</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="input-luxury" value={form.date} onChange={e => update('date', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Return Date (optional)</label>
                    <input type="date" className="input-luxury" value={form.returnDate} onChange={e => update('returnDate', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Number of Passengers</label>
                    <input type="number" min="1" max="50" className="input-luxury" placeholder="e.g. 12" value={form.passengers} onChange={e => update('passengers', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Additional Requirements</label>
                    <textarea rows={3} className="input-luxury resize-none" placeholder="Special requests, preferred vehicle, itinerary details..." value={form.message} onChange={e => update('message', e.target.value)} />
                  </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleSubmit}
                    disabled={!isValid || status === 'sending'}
                    className="btn-gold flex items-center gap-3 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Sending...' : '✉ Send Booking Email'}
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    disabled={!isValid}
                    className="flex items-center gap-3 justify-center bg-[#25D366] text-white px-6 py-3 text-xs font-medium tracking-widest uppercase hover:bg-[#22c55e] transition-colors disabled:opacity-50"
                  >
                    <MessageCircle size={15} />
                    Book via WhatsApp
                  </button>
                  <a href={PHONE_HREF} className="btn-luxury flex items-center gap-3 justify-center text-xs">
                    <Phone size={15} />
                    Call Now
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-obsidian-950 p-8">
                <h3 className="font-display text-white text-xl mb-6">Why Book With Us?</h3>
                {[
                  'Email & WhatsApp confirmation',
                  'Zero advance for most bookings',
                  'Professional, uniformed chauffeurs',
                  'GPS tracked, sanitized vehicles',
                  '24/7 customer support',
                  'Transparent pricing — no hidden charges',
                  'GST invoices available',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 shrink-0" />
                    <span className="text-obsidian-300 text-sm">{point}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-obsidian-900 border border-gold-500/15 p-8">
                <h3 className="font-display text-white text-lg mb-4">Pricing Reference</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-obsidian-300">
                    <span>Outstation (Tempo)</span>
                    <span className="text-gold-400 font-medium">₹30/km</span>
                  </div>
                  <div className="flex justify-between text-obsidian-300">
                    <span>Local NCR (Tempo)</span>
                    <span className="text-gold-400 font-medium">₹28/km</span>
                  </div>
                  <div className="flex justify-between text-obsidian-300">
                    <span>Min. Outstation</span>
                    <span className="text-obsidian-400">250 km/day</span>
                  </div>
                  <div className="border-t border-obsidian-800 pt-3 text-obsidian-500 text-xs">
                    Toll · Parking · State Tax · Driver Allowance extra
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white border border-obsidian-100 p-8">
                <h3 className="font-display text-obsidian-950 text-lg mb-4">Direct Contact</h3>
                <a href={PHONE_HREF} className="flex items-center gap-3 text-obsidian-700 hover:text-gold-600 transition-colors mb-3">
                  <Phone size={14} className="text-gold-500" />
                  {PHONE_NUMBER}
                </a>
                <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-obsidian-700 hover:text-gold-600 transition-colors text-sm">
                  <span className="text-gold-500 text-xs">✉</span>
                  {EMAIL}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
