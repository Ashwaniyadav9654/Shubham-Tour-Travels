import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { getSeo } from '@/lib/seo'

/**
 * Keeps <head> in sync on client-side navigation. The same tags are written
 * into each page's static HTML at build time (scripts/prerender.mjs), so this
 * only matters after the first page load.
 */

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export default function RouteSeo() {
  const { pathname } = useLocation()
  const firstLoad = useRef(true)

  useEffect(() => {
    const seo = getSeo(pathname)

    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('name', 'robots', seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1')
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', seo.canonical)
    setMeta('property', 'og:image', seo.image)
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    setMeta('name', 'twitter:image', seo.image)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
    }
    link.href = seo.canonical

    // Page-specific structured data; the business-wide blocks in index.html stay.
    document.head.querySelectorAll('script[data-page-ld]').forEach((n) => n.remove())
    for (const block of seo.jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.dataset.pageLd = ''
      s.textContent = JSON.stringify(block)
      document.head.appendChild(s)
    }

    // Google Analytics (added to each page at build time when
    // VITE_GA_MEASUREMENT_ID is set) counts the first load itself; report
    // later in-app navigations as page views.
    const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
    if (!firstLoad.current && gtag) {
      gtag('event', 'page_view', { page_location: window.location.href, page_title: seo.title })
    }
    firstLoad.current = false
  }, [pathname])

  return null
}
