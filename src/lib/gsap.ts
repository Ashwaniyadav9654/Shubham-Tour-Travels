import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Signature luxury easing — matches the cubic-bezier already used across the design. */
export const LUXURY_EASE = 'power3.out'
export const LUXURY_CUBIC = [0.22, 1, 0.36, 1] as const

/** Honour the OS "reduce motion" setting — animations collapse to instant states. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

gsap.defaults({ ease: LUXURY_EASE, duration: 1 })

/**
 * Flags the document so CSS can pre-hide animated elements.
 * Runs at import time (before first paint) so there is no flash of
 * un-animated content — and if the bundle ever fails to load, the class is
 * never added and everything renders fully visible.
 */
if (typeof document !== 'undefined' && !prefersReducedMotion()) {
  document.documentElement.classList.add('gsap-init')
}

export { gsap, ScrollTrigger }
