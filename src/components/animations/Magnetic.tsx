import React from 'react'
import { useMagnetic } from '@/hooks/useGsapAnimations'

interface MagneticProps {
  children: React.ReactNode
  /** Fraction of the cursor offset the element travels. */
  strength?: number
  className?: string
  /** `inline-block` by default; use `block` for full-width CTAs. */
  as?: 'inline-block' | 'block'
}

/**
 * Wraps an existing interactive element in a magnetic container.
 *
 * Deliberately a WRAPPER, never a replacement — the child <button>, <a> or
 * <Link> keeps its own attributes, handlers and form wiring untouched.
 */
export default function Magnetic({
  children,
  strength = 0.3,
  className = '',
  as = 'inline-block',
}: MagneticProps) {
  const ref = useMagnetic<HTMLSpanElement>(strength)

  return (
    <span
      ref={ref}
      className={`magnetic ${as === 'block' ? 'block w-full' : 'inline-block'} ${className}`}
    >
      {children}
    </span>
  )
}
