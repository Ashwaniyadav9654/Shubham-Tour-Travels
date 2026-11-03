/**
 * Build step 3 of 3 (see package.json "build").
 *
 * Renders every route of the app to static HTML with its own <title>,
 * description, canonical, Open Graph tags and structured data, so search
 * engines and link previews get full content without running JavaScript.
 * Also writes 404.html and a sitemap generated from the package/fleet data.
 *
 * Vercel serves dist/tours/kashmir-valley.html at /tours/kashmir-valley
 * (cleanUrls in vercel.json); the browser then hydrates the same markup.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = resolve(import.meta.dirname, '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')
const { render, getSeo, allRoutes } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)

// Preload the Latin font file so headings don't repaint late when it arrives.
const fontFile = readdirSync(join(dist, 'assets')).find((f) => /^plus-jakarta-sans-latin-wght-normal-.*\.woff2$/.test(f))
const fontPreload = fontFile
  ? `<link rel="preload" href="/assets/${fontFile}" as="font" type="font/woff2" crossorigin />\n    `
  : ''
const template = readFileSync(join(dist, 'index.html'), 'utf8').replace('</title>', `</title>\n    ${fontPreload}`.trimEnd())
const GA_ID = process.env.VITE_GA_MEASUREMENT_ID?.trim()

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender: template is missing ${pattern}`)
  return html.replace(pattern, replacement)
}

function page(path, { status } = {}) {
  const seo = getSeo(path)
  let html = template
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(seo.description)}" />`)
  html = setTag(html, /<meta name="robots" content="[^"]*" \/>/,
    `<meta name="robots" content="${seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />`)
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${esc(seo.canonical)}" />`)
  for (const [attr, key, val] of [
    ['property', 'og:title', seo.title],
    ['property', 'og:description', seo.description],
    ['property', 'og:url', seo.canonical],
    ['property', 'og:image', seo.image],
    ['name', 'twitter:title', seo.title],
    ['name', 'twitter:description', seo.description],
    ['name', 'twitter:image', seo.image],
  ]) {
    html = setTag(html, new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`), `<meta ${attr}="${key}" content="${esc(val)}" />`)
  }
  // og:image size tags only describe the default 1200×630 card
  if (seo.image !== 'https://shubhamtourtravels.in/og-image.jpg') {
    html = html.replace(/\s*<meta property="og:image:(width|height)" content="\d+" \/>/g, '')
  }

  const ld = seo.jsonLd
    .map((b) => `<script type="application/ld+json" data-page-ld>${JSON.stringify(b).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ')
  const ga = GA_ID
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');</script>`
    : ''
  // Home page: start fetching the hero photo (the largest element) immediately.
  const preload = path === '/'
    ? '<link rel="preload" as="image" href="/images/hero-960.webp" imagesrcset="/images/hero-640.webp 640w, /images/hero-960.webp 960w, /images/hero-1920.webp 1920w" imagesizes="100vw" fetchpriority="high" />'
    : ''
  html = html.replace('</head>', `    ${preload}\n    ${ld}\n    ${ga}\n  </head>`)

  const body = render(path)
  html = setTag(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`)
  return { html, seo, status }
}

function write(file, html) {
  const out = join(dist, file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
}

const routes = allRoutes()
const problems = []
for (const r of routes) {
  const { html, seo } = page(r.path)
  write(r.path === '/' ? 'index.html' : `${r.path.slice(1)}.html`, html)
  if (r.index && seo.title.length > 60) problems.push(`title ${seo.title.length} chars: ${r.path}`)
  if (r.index && seo.description.length > 160) problems.push(`description ${seo.description.length} chars: ${r.path}`)
}
write('404.html', page('/__not-found__').html)

// Sitemap from the same route list, so new packages appear automatically.
const today = new Date().toISOString().slice(0, 10)
const urls = routes
  .filter((r) => r.index)
  .map((r) => `  <url>\n    <loc>https://shubhamtourtravels.in${r.path === '/' ? '/' : r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r.priority.toFixed(1)}</priority>\n  </url>`)
writeFileSync(join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)

rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: ${routes.length} pages + 404.html, sitemap with ${urls.length} URLs${GA_ID ? `, GA ${GA_ID}` : ', no GA id set'}`)
if (problems.length) {
  console.warn('prerender: SEO length warnings:\n  ' + problems.join('\n  '))
}
