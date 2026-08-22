// DIAGNOSTIC: imports jsPDF, which can touch browser globals at load time
import { jsPDF } from 'jspdf'
export default function handler(_req: any, res: any) {
  res.status(200).json({ ok: true, probe: 'jspdf', type: typeof jsPDF })
}
