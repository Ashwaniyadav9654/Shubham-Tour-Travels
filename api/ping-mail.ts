// DIAGNOSTIC: imports a file from api/_lib
import { mailConfigured } from './_lib/mail'
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, probe: '_lib import', mailConfigured: mailConfigured() })
}
