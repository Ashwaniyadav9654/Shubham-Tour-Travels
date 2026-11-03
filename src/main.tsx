import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import './index.css'

const root = document.getElementById('root')!
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Pages are prerendered at build time; take over that HTML instead of
// re-drawing it. Falls back to a normal render (e.g. in `vite dev`).
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
