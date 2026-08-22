/**
 * Pricing lives in api/_lib so the serverless functions can import it
 * reliably (files outside api/ are not guaranteed to be traced into the
 * function bundle). This re-export keeps `@/lib/pricing` working for the
 * client, with one source of truth for the money.
 */
export * from '../../api/_lib/pricing'
