import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

/**
 * Serves the files in /api during `vite dev`.
 *
 * In production Vercel runs those files as Functions automatically, but the
 * Vite dev server knows nothing about them — without this the itinerary
 * endpoint would 404 locally and only ever exercise the offline fallback.
 */
function apiRoutes(env: Record<string, string>): Plugin {
  return {
    name: 'local-api-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        const route = req.url.split('?')[0].replace(/^\/api\//, '')
        const file = path.resolve(__dirname, 'api', `${route}.ts`)

        try {
          // Mirror the env the Function would see on Vercel
          Object.assign(process.env, env)

          const mod = await server.ssrLoadModule(file)
          const handler = mod.default

          const chunks: Buffer[] = []
          for await (const c of req) chunks.push(c as Buffer)
          const rawBody = Buffer.concat(chunks).toString('utf8')

          // Minimal Vercel-compatible req/res shims
          ;(req as any).body = rawBody ? JSON.parse(rawBody) : {}
          ;(res as any).status = (code: number) => {
            res.statusCode = code
            return res as any
          }
          ;(res as any).json = (payload: unknown) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
          }

          await handler(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: (err as Error).message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' prefix loads every var, not just VITE_* — the API key must stay
  // server-side, so it is deliberately never exposed to client code.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), apiRoutes(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
