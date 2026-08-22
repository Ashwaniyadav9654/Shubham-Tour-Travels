// DIAGNOSTIC: imports from ../src (outside the api directory)
import { MIN_KM_PER_DAY } from '../src/lib/pricing'
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, probe: 'src import', minKm: MIN_KM_PER_DAY })
}
