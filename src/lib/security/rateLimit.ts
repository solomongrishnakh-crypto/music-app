/**
 * Einfaches In-Memory-Rate-Limiting pro IP und Route, um die API-Routen vor
 * Missbrauch/automatisierten Anfragen zu schützen. Für Produktionsbetrieb
 * mit mehreren Server-Instanzen sollte das durch einen externen Store
 * (z. B. Redis) ersetzt werden — reicht für einen einzelnen Server aber
 * gut aus.
 */
const requestLog = new Map<string, number[]>();

export function isRateLimited(
  key: string,
  windowMs: number,
  maxRequests: number
): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter(
    (t) => now - t < windowMs
  );
  timestamps.push(now);
  requestLog.set(key, timestamps);

  // Verhindert, dass die Map bei vielen verschiedenen IPs unbegrenzt wächst.
  if (requestLog.size > 5000) {
    const cutoff = now - windowMs;
    for (const [k, v] of requestLog) {
      if (v.every((t) => t < cutoff)) requestLog.delete(k);
    }
  }

  return timestamps.length > maxRequests;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
