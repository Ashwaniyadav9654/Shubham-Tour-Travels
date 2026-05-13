import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { whatsappLink, PHONE_NUMBER, PHONE_HREF, EMAIL } from '@/lib/utils'
import { sendBookingEmail } from '@/lib/emailjs'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    const result = await sendBookingEmail({
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      pickup_location: 'N/A',
      destination: 'N/A',
      travel_date: 'N/A',
      subject: form.subject || 'Contact Form Enquiry',
      message: form.message,
    })
    if (result.success) {
      setStatus('success')
      setForm({ name: '', phone: '', email: '', subject: '', message: '' })
    } else {
      setStatus('error')
    }
  }

  return (
    <div>
      <section className="bg-obsidian-950 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-gold-500" />
              <span className="text-gold-400 text-xs tracking-[0.25em] uppercase">Get In Touch</span>
            </div>
            <h1 className="font-display text-white text-5xl md:text-6xl mb-4">Contact Us</h1>
            <p className="text-obsidian-400 max-w-lg">
              Available 24 hours, 7 days a week. Call, WhatsApp, or fill the form — we respond within minutes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-pad bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="bg-obsidian-950 p-8">
                <h3 className="font-display text-white text-xl mb-6">Reach Us Directly</h3>
                {[
                  { icon: Phone, label: 'Phone', value: PHONE_NUMBER, href: PHONE_HREF },
                  { icon: Mail, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
                  { icon: MapPin, label: 'Office', value: '5, Ashok Vihar Phase 3 Extn, Gurugram – 122001', href: '#' },
                ].map((item) => (
                  <a key={item.label} href={item.href}
                    className="flex items-start gap-4 mb-5 group">
                    <div className="w-9 h-9 border border-gold-500/30 flex items-center justify-center shrink-0 group-hover:border-gold-500 transition-colors">
                      <item.icon size={14} className="text-gold-500" />
                    </div>
                    <div>
                      <div className="text-obsidian-500 text-[10px] tracking-widest uppercase mb-0.5">{item.label}</div>
                      <div className="text-obsidian-300 text-sm group-hover:text-gold-400 transition-colors">{item.value}</div>
                    </div>
                  </a>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="bg-white border border-obsidian-100 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-gold-500" />
                  <h3 className="font-display text-obsidian-950 text-lg">Operating Hours</h3>
                </div>
                <div className="space-y-2 text-sm text-obsidian-500">
                  <div className="flex justify-between"><span>Bookings</span><span className="text-gold-600 font-medium">24 / 7</span></div>
                  <div className="flex justify-between"><span>Office</span><span>9 AM – 9 PM</span></div>
                  <div className="flex justify-between"><span>WhatsApp</span><span className="text-gold-600 font-medium">Always On</span></div>
                </div>
              </motion.div>

              <motion.a
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                href={whatsappLink('Hello! I need assistance from Shubham Tour & Travels.')}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] text-white p-5 hover:bg-[#22c55e] transition-colors"
              >
                <MessageCircle size={22} />
                <div>
                  <div className="font-semibold text-sm">WhatsApp Us Now</div>
                  <div className="text-green-100 text-xs">Fastest response — usually under 5 min</div>
                </div>
              </motion.a>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="lg:col-span-3 bg-white border border-obsidian-100 p-8 md:p-10">

              {status === 'success' ? (
                <div className="text-center py-12">
                  <CheckCircle size={48} className="text-gold-500 mx-auto mb-4" />
                  <h3 className="font-display text-obsidian-950 text-2xl mb-3">Message Sent!</h3>
                  <p className="text-obsidian-500 mb-6">We've received your message at <strong>{EMAIL}</strong> and will respond shortly.</p>
                  <button onClick={() => setStatus('idle')} className="btn-luxury text-xs">Send Another</button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-obsidian-950 text-2xl mb-2">Send a Message</h2>
                  <p className="text-obsidian-400 text-sm mb-8">Your message will be sent directly to <span className="text-gold-600">{EMAIL}</span></p>

                  {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
                      <AlertCircle size={16} />
                      Failed to send email. Please try WhatsApp or call us directly.
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
                      <div>
                        <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Name *</label>
                        <input required type="text" className="input-luxury" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Phone *</label>
                        <input required type="tel" className="input-luxury" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Email</label>
                        <input type="email" className="input-luxury" placeholder="email@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Subject</label>
                        <input type="text" className="input-luxury" placeholder="How can we help?" value={form.subject} onChange={e => update('subject', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Message *</label>
                      <textarea required rows={5} className="input-luxury resize-none" placeholder="Tell us about your travel needs..." value={form.message} onChange={e => update('message', e.target.value)} />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="btn-gold w-full justify-center flex items-center gap-2 disabled:opacity-60"
                    >
                      {status === 'sending' ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
