import { useEffect, useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap'

type AnyRef = RefObject<HTMLElement | null>

/** Shared entry curve — long, decelerating, never bouncy. */
const ENTER = { duration: 1.05, ease: 'power3.out' } as const

/**
 * How far a masked line starts below (or exits above) its own box, as a
 * percentage of the line's height.
 *
 * `.line-mask` pads its window out by ~0.54em so descenders and ascenders
 * are never shaved. That padding also means a 100% offset no longer clears
 * the window — the top of the glyphs still pokes through. 175% clears the
 * padded window for every display size in the system.
 */
const MASK_TRAVEL = 175

/* ------------------------------------------------------------------ *
 * 1. Heading line reveal (masking)
 * ------------------------------------------------------------------ */

interface HeadingRevealOptions {
  delay?: number
  /**
   * Attach a ScrollTrigger instead of firing on mount. Required for any
   * heading below the fold — otherwise it animates while off-screen and
   * the visitor only ever sees the finished state.
   */
  scroll?: boolean
  start?: string
}

/**
 * Slides each `[data-line]` element up from behind its own overflow mask.
 * Line-level (not character-level) so a heading whose accent word carries
 * its own colour or italic stays visually continuous.
 *
 * Re-runs whenever `key` changes — used by the hero slider to swap titles.
 */
export function useHeadingReveal(
  ref: AnyRef,
  key: unknown = 0,
  options: HeadingRevealOptions = {}
) {
  const { delay = 0, scroll = false, start = 'top 86%' } = options
  const isFirst = useRef(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const lines = el.querySelectorAll<HTMLElement>('[data-line]')
    if (!lines.length) return

    if (prefersReducedMotion()) {
      gsap.set(lines, { yPercent: 0, opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        lines,
        { yPercent: MASK_TRAVEL, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.15,
          ease: 'power4.out',
          stagger: 0.09,
          delay: isFirst.current ? delay : 0,
          ...(scroll
            ? { scrollTrigger: { trigger: el, start, once: true } }
            : {}),
        }
      )
    }, el)

    isFirst.current = false
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

/** Slides the current lines out (upward) before the next slide swaps in. */
export function playHeadingExit(el: HTMLElement | null) {
  if (!el || prefersReducedMotion()) return
  const lines = el.querySelectorAll<HTMLElement>('[data-line]')
  gsap.to(lines, {
    yPercent: -MASK_TRAVEL,
    opacity: 0,
    duration: 0.55,
    ease: 'power3.in',
    stagger: 0.05,
  })
}

/* ------------------------------------------------------------------ *
 * 2. Page-load stagger (no scroll trigger)
 * ------------------------------------------------------------------ */

/** Fades + lifts every `[data-load]` child on mount, in DOM order. */
export function useLoadStagger(ref: AnyRef, delay = 0.35) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const items = el.querySelectorAll<HTMLElement>('[data-load]')
    if (!items.length) return

    if (prefersReducedMotion()) {
      gsap.set(items, { clearProps: 'all' })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, ...ENTER, stagger: 0.11, delay, clearProps: 'transform' }
      )
    }, el)

    return () => ctx.revert()
  }, [])
}

/* ------------------------------------------------------------------ *
 * 3. Scroll-triggered staggered reveal (fade-up + scale)
 * ------------------------------------------------------------------ */

interface RevealOptions {
  /** Child selector to stagger. Defaults to `[data-reveal]`. */
  selector?: string
  y?: number
  scale?: number
  stagger?: number
  /** ScrollTrigger start position. */
  start?: string
}

/**
 * Staggered fade-up + subtle scale as the container scrolls into view.
 * Fires once. Uses `once: true` rather than toggleActions so cards never
 * re-hide when scrolling back up.
 */
export function useScrollReveal(ref: AnyRef, options: RevealOptions = {}) {
  const {
    selector = '[data-reveal]',
    y = 56,
    scale = 0.96,
    stagger = 0.1,
    start = 'top 82%',
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const items = el.querySelectorAll<HTMLElement>(selector)
    if (!items.length) return

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, scale: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { y, scale, opacity: 0 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ...ENTER,
          stagger,
          // Drop inline transforms afterwards so hover tweens start clean.
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start, once: true },
        }
      )
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, y, scale, stagger, start])
}

/* ------------------------------------------------------------------ *
 * 4. Blur reveal (forms / panels)
 * ------------------------------------------------------------------ */

/** Soft slide-in with a focus-pull blur — used for the Quick Inquiry panel. */
export function useBlurReveal(ref: AnyRef, options: { x?: number; y?: number; delay?: number } = {}) {
  const { x = 0, y = 48, delay = 0 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, filter: 'none' })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x, y, filter: 'blur(14px)' },
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.25,
          ease: 'power3.out',
          delay,
          // `filter` must be explicitly set to none, never cleared — a
          // cleared inline value falls back to the CSS pre-hide blur.
          // The transform is safe to clear (no CSS transform pre-hide).
          onComplete: () => gsap.set(el, { filter: 'none', clearProps: 'transform' }),
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      )
    })

    return () => ctx.revert()
  }, [])
}

/* ------------------------------------------------------------------ *
 * 5. Parallax
 * ------------------------------------------------------------------ */

/** Scrubbed vertical parallax, scoped to the trigger section. */
export function useParallax(
  ref: AnyRef,
  options: { trigger?: AnyRef; amount?: number } = {}
) {
  const { trigger, amount = 18 } = options

  useEffect(() => {
    const el = ref.current
    const triggerEl = trigger?.current ?? el
    if (!el || !triggerEl) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: 0 },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerEl,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [amount])
}

/* ------------------------------------------------------------------ *
 * 6. Magnetic buttons
 * ------------------------------------------------------------------ */

/**
 * Pulls the element toward the cursor and eases it back on exit.
 * Attach the returned ref directly to an existing button — no wrapper
 * element and no markup change required.
 *
 * `strength` is the fraction of the cursor offset the element travels.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.32) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Pointer-precision only — magnetism is meaningless on touch.
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' })
    const scaleTo = gsap.quickTo(el, 'scale', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onEnter = () => scaleTo(1.045)
    const onLeave = () => {
      xTo(0)
      yTo(0)
      scaleTo(1)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [strength])

  return ref
}

/* ------------------------------------------------------------------ *
 * 7. Card hover — lift, scale and gold glow
 * ------------------------------------------------------------------ */

interface HoverOptions {
  /** Child selector to bind. Defaults to `[data-hover-card]`. */
  selector?: string
  lift?: number
  scale?: number
  /** rgba glow colour. Ignored when `useHue` is on. */
  glow?: string
  glowSize?: number
  /**
   * Take the glow colour from the card's own `--hue` custom property
   * instead of the fixed `glow` value, so every card glows in its own
   * accent. Falls back to `glow` if the card never set one.
   */
  useHue?: boolean
  /** Max degrees of 3D tilt toward the cursor. 0 disables it. */
  tilt?: number
}

/**
 * JS-driven hover for cards: lift + scale + an expanding gold glow,
 * all on one timeline so an interrupted hover reverses smoothly instead
 * of snapping the way competing CSS transitions do.
 */
export function useCardHover(ref: AnyRef, options: HoverOptions = {}) {
  const {
    selector = '[data-hover-card]',
    lift = -8,
    scale = 1.018,
    glow = 'rgba(192,161,114,0.30)',
    glowSize = 44,
    useHue = false,
    tilt = 0,
  } = options

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (!cards.length) return

    const cleanups = cards.map((card) => {
      const reduced = prefersReducedMotion()

      // Resolve this card's own accent once, at bind time
      const hue = useHue
        ? getComputedStyle(card).getPropertyValue('--hue').trim()
        : ''
      const glowColor = hue ? `rgb(${hue} / 0.42)` : glow
      const ringColor = hue ? `rgb(${hue} / 0.38)` : 'rgba(192,161,114,0.22)'

      const yTo = gsap.quickTo(card, 'y', { duration: 0.5, ease: 'power3.out' })
      const sTo = gsap.quickTo(card, 'scale', { duration: 0.5, ease: 'power3.out' })
      const rxTo = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' })
      const ryTo = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' })

      if (tilt && !reduced) gsap.set(card, { transformPerspective: 900 })

      const glowOn = () =>
        gsap.to(card, {
          boxShadow: `0 ${glowSize / 2}px ${glowSize}px -10px ${glowColor}, 0 0 0 1px ${ringColor}`,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      const glowOff = () =>
        gsap.to(card, {
          boxShadow: '0 0px 0px -10px rgba(0,0,0,0), 0 0 0 0px rgba(0,0,0,0)',
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto',
        })

      const onMove = (e: MouseEvent) => {
        if (!tilt || reduced) return
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        ryTo(px * tilt * 2)
        rxTo(-py * tilt * 2)
      }

      const onEnter = () => {
        if (!reduced) {
          yTo(lift)
          sTo(scale)
        }
        glowOn()
      }
      const onLeave = () => {
        if (!reduced) {
          yTo(0)
          sTo(1)
          if (tilt) {
            rxTo(0)
            ryTo(0)
          }
        }
        glowOff()
      }

      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)

      return () => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
        gsap.killTweensOf(card)
      }
    })

    return () => cleanups.forEach((fn) => fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector, lift, scale, glow, glowSize, useHue, tilt])
}

/* ------------------------------------------------------------------ *
 * 8. Clip reveal — media wipes open
 * ------------------------------------------------------------------ */

/**
 * Wipes `[data-clip]` elements open from the bottom edge while the inner
 * image counter-scales, so the frame opens over a settling photograph
 * rather than a static one.
 */
export function useClipReveal(ref: AnyRef, options: { start?: string; stagger?: number } = {}) {
  const { start = 'top 84%', stagger = 0.12 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.matches?.('[data-clip]')
      ? [el]
      : Array.from(el.querySelectorAll<HTMLElement>('[data-clip]'))
    if (!targets.length) return

    if (prefersReducedMotion()) {
      gsap.set(targets, { clipPath: 'none' })
      return
    }

    const ctx = gsap.context(() => {
      targets.forEach((target, i) => {
        const inner = target.querySelector<HTMLElement>('img, video, [data-clip-inner]')

        const tl = gsap.timeline({
          scrollTrigger: { trigger: target, start, once: true },
          delay: i * stagger,
        })

        // NOTE: no `clearProps` here. Clearing the inline clip-path would
        // hand control back to the `html.gsap-init [data-clip]` pre-hide
        // rule, which re-clips the element to nothing the instant the
        // reveal finishes. The resolved inset(0%) must stay inline.
        tl.fromTo(
          target,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.35,
            ease: 'expo.out',
          }
        )

        if (inner) {
          tl.fromTo(
            inner,
            { scale: 1.32 },
            { scale: 1, duration: 1.7, ease: 'expo.out', clearProps: 'transform' },
            0
          )
        }
      })
    }, el)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, stagger])
}

/* ------------------------------------------------------------------ *
 * 9. Horizontal scroll — pin + translate
 * ------------------------------------------------------------------ */

/**
 * Pins `sectionRef` and drives `trackRef` horizontally for exactly the
 * width that overflows the viewport.
 *
 * Pinning is applied only at >=1024px via gsap.matchMedia. Below that the
 * track falls back to a native swipe rail (see `.h-track` in index.css) —
 * hijacking vertical scroll on a phone is hostile, not premium.
 */
export function useHorizontalScroll(
  sectionRef: AnyRef,
  trackRef: AnyRef,
  progressRef?: AnyRef
) {
  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    if (prefersReducedMotion()) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      // Recomputed on every refresh so resizes and late-loading images
      // never leave the pin measured against a stale width.
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef?.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
          },
        },
      })

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(track, { clearProps: 'transform' })
      }
    })

    return () => mm.revert()
  }, [])
}

/* ------------------------------------------------------------------ *
 * 10. Number counter
 * ------------------------------------------------------------------ */

/**
 * Counts every `[data-counter]` child up to the numeric part of its own
 * text, preserving any prefix/suffix ("12+", "50,000+", "4.9★").
 */
export function useCounter(ref: AnyRef) {
  useEffect(() => {
    const root = ref.current
    if (!root) return

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-counter]'))
    if (!nodes.length) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      nodes.forEach((node) => {
        const raw = node.textContent ?? ''
        const match = raw.match(/[\d,.]+/)
        if (!match) return

        const numeric = parseFloat(match[0].replace(/,/g, ''))
        if (!Number.isFinite(numeric)) return

        const decimals = (match[0].split('.')[1] || '').length
        const grouped = match[0].includes(',')
        const prefix = raw.slice(0, match.index)
        const suffix = raw.slice((match.index ?? 0) + match[0].length)

        const counter = { value: 0 }

        gsap.to(counter, {
          value: numeric,
          duration: 2.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          onUpdate: () => {
            const shown = grouped
              ? Math.round(counter.value).toLocaleString('en-IN')
              : counter.value.toFixed(decimals)
            node.textContent = `${prefix}${shown}${suffix}`
          },
          onComplete: () => {
            node.textContent = raw
          },
        })
      })
    }, root)

    return () => ctx.revert()
  }, [])
}

/* ------------------------------------------------------------------ *
 * 11. Spotlight — cursor-tracked colour glow
 * ------------------------------------------------------------------ */

/**
 * Publishes the cursor position into each `.spotlight` element as
 * `--mx` / `--my`, which the CSS radial-gradient reads. The colour itself
 * comes from whatever `--hue` the component already set.
 */
export function useSpotlight(ref: AnyRef, selector = '.spotlight') {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const cards = Array.from(root.querySelectorAll<HTMLElement>(selector))
    if (!cards.length) return

    const cleanups = cards.map((card) => {
      let frame = 0
      const onMove = (e: MouseEvent) => {
        if (frame) return
        // Throttle to one write per frame — mousemove fires far faster
        frame = requestAnimationFrame(() => {
          const r = card.getBoundingClientRect()
          card.style.setProperty('--mx', `${e.clientX - r.left}px`)
          card.style.setProperty('--my', `${e.clientY - r.top}px`)
          frame = 0
        })
      }
      card.addEventListener('mousemove', onMove)
      return () => {
        card.removeEventListener('mousemove', onMove)
        if (frame) cancelAnimationFrame(frame)
      }
    })

    return () => cleanups.forEach((fn) => fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector])
}

/* ------------------------------------------------------------------ *
 * 12. Marquee — infinite ticker that reacts to scroll
 * ------------------------------------------------------------------ */

/**
 * Duplicates nothing and assumes the caller rendered the row twice.
 * Loops the track by exactly half its width, so the seam is invisible.
 * Scroll velocity briefly stretches the speed, which makes the strip feel
 * physically attached to the page rather than decoratively looping.
 */
export function useMarquee(
  ref: AnyRef,
  options: { speed?: number; reverse?: boolean } = {}
) {
  const { speed = 55, reverse = false } = options

  useEffect(() => {
    const track = ref.current
    if (!track) return
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const half = () => track.scrollWidth / 2
      const dir = reverse ? 1 : -1

      const tween = gsap.fromTo(
        track,
        { x: reverse ? -half() : 0 },
        {
          x: reverse ? 0 : -half(),
          duration: () => half() / speed,
          ease: 'none',
          repeat: -1,
        }
      )

      // Nudge playback rate from scroll velocity, then settle back
      const st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 260)
          gsap.to(tween, {
            timeScale: 1 + Math.abs(v),
            duration: 0.25,
            overwrite: true,
            onComplete: () => gsap.to(tween, { timeScale: 1, duration: 0.9 }),
          })
          void dir
        },
      })

      return () => st.kill()
    }, track)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed, reverse])
}

/* ------------------------------------------------------------------ *
 * 13. Section header reveal
 * ------------------------------------------------------------------ */

/** One-shot fade-up for a section header block as it enters view. */
export function useHeaderReveal(ref: AnyRef, y = 34) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      )
    })

    return () => ctx.revert()
  }, [y])
}

export { ScrollTrigger, gsap }
