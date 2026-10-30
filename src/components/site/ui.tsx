import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/** Fade-and-rise on first scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  sub?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn('flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14', className)}>
      <div className="max-w-2xl">
        <p className="text-sea font-medium text-sm mb-3">{eyebrow}</p>
        <h2 className="font-display font-semibold text-navy text-3xl md:text-[2.75rem] leading-[1.08] tracking-tight">
          {title}
        </h2>
        {sub && <p className="text-navy-muted mt-4 text-base md:text-lg leading-relaxed">{sub}</p>}
      </div>
      {action}
    </Reveal>
  )
}

/** Small uppercase "ALL PACKAGES ↗" style link. */
export function ArrowLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-navy hover:text-sea transition-colors',
        className
      )}
    >
      {children}
      <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full bg-sea px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sea-dark',
  outline:
    'inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:border-sea hover:text-sea',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-sea-tint hover:text-sea',
  light:
    'inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy transition-colors hover:bg-sea-tint',
}

/** Horizontal scroll strip with prev/next buttons, used for carousels. */
export function Carousel({ children, className }: { children: React.ReactNode; className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: 1 | -1) => {
    const el = track.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className={className}>
      <div
        ref={track}
        data-lenis-prevent-wheel
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="flex justify-end gap-2 mt-6">
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => scroll(dir)}
            aria-label={dir < 0 ? 'Previous' : 'Next'}
            className="w-10 h-10 rounded-full border border-line bg-white text-navy flex items-center justify-center hover:border-sea hover:text-sea transition-colors"
          >
            {dir < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        ))}
      </div>
    </div>
  )
}

export function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
