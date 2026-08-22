import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

/** Shared instance so any component can programmatically scroll. */
let lenisInstance: Lenis | null = null
export const getLenis = () => lenisInstance

/**
 * Global fluid smooth-scrolling, wired into GSAP's ticker so ScrollTrigger
 * stays perfectly in sync with the interpolated scroll position.
 * Renders nothing — purely a side-effect provider.
 */
export default function SmoothScroll() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.15,
      // Exponential ease-out: fast pickup, long luxurious glide to rest.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native momentum on touch feels better than interpolated scrolling.
      syncTouch: false,
    })
    lenisInstance = lenis

    // Drive Lenis from GSAP's ticker (single RAF loop for the whole app).
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ScrollTrigger.update)

    // Images/fonts settling late would leave triggers measured at wrong offsets.
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const settleTimer = window.setTimeout(refresh, 600)

    return () => {
      window.clearTimeout(settleTimer)
      window.removeEventListener('load', refresh)
      lenis.off('scroll', ScrollTrigger.update)
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  // On route change: jump to top instantly, then re-measure every trigger.
  useEffect(() => {
    lenisInstance?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [pathname])

  return null
}
