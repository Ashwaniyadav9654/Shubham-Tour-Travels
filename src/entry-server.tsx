/**
 * Build-time renderer used by scripts/prerender.mjs. Renders one route to an
 * HTML string so every page ships real content and tags to search engines.
 */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { AppRoutes } from './App'

export { getSeo, allRoutes } from './lib/seo'

export function render(url: string): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </React.StrictMode>,
  )
}
