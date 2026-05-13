import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      let ok = false
      if (tab === 'login') {
        ok = await login(email, password)
      } else {
        ok = await register(name, email, password)
      }
      if (ok) navigate('/')
      else setError('Invalid credentials. Please try again.')
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-obsidian-900 border border-gold-500/30 flex items-center justify-center">
            <span className="font-display text-gold-500 text-xl font-bold">S</span>
          </div>
          <div>
            <div className="text-white font-display font-semibold">Shubham Tour & Travels</div>
            <div className="text-gold-600 text-[10px] tracking-widest uppercase">Est. 2012</div>
          </div>
        </Link>

        <div className="bg-obsidian-900 border border-obsidian-800 p-8 md:p-10">
          {/* Tabs */}
          <div className="flex border-b border-obsidian-800 mb-8">
            {(['login', 'register'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 pb-3 text-xs tracking-widest uppercase font-medium transition-colors border-b-2 -mb-px ${
                  tab === t ? 'border-gold-500 text-gold-400' : 'border-transparent text-obsidian-500 hover:text-obsidian-300'
                }`}>
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {tab === 'register' && (
              <div>
                <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Full Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent border-b border-obsidian-700 pb-2 text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-gold-500 transition-colors" />
              </div>
            )}
            <div>
              <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Email</label>
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-transparent border-b border-obsidian-700 pb-2 text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div className="relative">
              <label className="text-[10px] tracking-widest uppercase text-obsidian-500 block mb-2">Password</label>
              <input required type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" minLength={6}
                className="w-full bg-transparent border-b border-obsidian-700 pb-2 text-sm text-white placeholder:text-obsidian-600 focus:outline-none focus:border-gold-500 transition-colors pr-8" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-0 top-7 text-obsidian-500 hover:text-gold-400 transition-colors">
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button type="submit" disabled={loading}
              className="btn-gold w-full justify-center flex text-xs disabled:opacity-60">
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-obsidian-600 text-xs text-center mt-6">
            Admin? Email: admin@shubhamtravels.com · Password: admin@2024
          </p>
        </div>
      </motion.div>
    </div>
  )
}
