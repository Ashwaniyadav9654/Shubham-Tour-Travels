// DIAGNOSTIC: zero imports. Proves the TS function runtime itself works.
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, probe: 'bare', node: process.version })
}
