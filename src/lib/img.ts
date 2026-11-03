/**
 * Responsive image sources. Cards get an ~800px file and a srcset so phones
 * and desktops each download a size close to what they display.
 *  - Unsplash URLs: resized server-side via the w/h query params.
 *  - Local /images/packages and /images/cars WebPs: a pre-built "-800" variant.
 */
export function imgSet(src: string, widths: number[] = [480, 800, 1200]): { src: string; srcSet?: string } {
  if (src.includes('images.unsplash.com')) {
    const base = new URL(src)
    const w0 = Number(base.searchParams.get('w')) || 1200
    const h0 = Number(base.searchParams.get('h')) || 0
    const at = (w: number) => {
      const u = new URL(src)
      u.searchParams.set('w', String(w))
      if (h0) u.searchParams.set('h', String(Math.round((w * h0) / w0)))
      return u.toString()
    }
    return { src: at(800), srcSet: widths.map((w) => `${at(w)} ${w}w`).join(', ') }
  }
  const local = src.match(/^(\/images\/(?:packages|cars|dest)\/.+?)(-800)?\.webp$/)
  if (local) return { src: `${local[1]}-800.webp`, srcSet: `${local[1]}-800.webp 800w, ${local[1]}.webp 1600w` }
  return { src }
}

/** `sizes` for a card in a 1/2/3-column responsive grid. */
export const CARD_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
