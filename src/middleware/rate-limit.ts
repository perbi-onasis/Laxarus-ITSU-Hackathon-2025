const rateLimitMap = new Map<string, { count: number; last: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, last: now };
  if (now - entry.last > windowMs) {
    entry.count = 1;
    entry.last = now;
  } else {
    entry.count++;
  }
  rateLimitMap.set(key, entry);
  if (entry.count > limit) {
    return false;
  }
  return true;
}
