/**
 * Canonical origin for Astro `site` (sitemap, robots.txt, OG, canonical tags).
 * Vercel often injects PUBLIC_SITE_URL as empty or as a hostname without a
 * scheme (VERCEL_URL). Astro's config schema requires a real absolute URL.
 */
export const FALLBACK_SITE_URL = 'https://example.com';

const SKIP_VALUES = new Set(['', 'undefined', 'null']);

/**
 * @param {unknown} value
 * @returns {string | undefined}
 */
export function toAbsoluteHttpUrl(value) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (SKIP_VALUES.has(trimmed)) return undefined;

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : trimmed.includes('://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    if (!url.hostname) return undefined;
    return url.href.replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

/**
 * @param {NodeJS.ProcessEnv} [env]
 * @returns {string}
 */
export function resolveSiteUrl(env = process.env) {
  const candidates = [
    env.PUBLIC_SITE_URL,
    env.SITE,
    env.VERCEL_PROJECT_PRODUCTION_URL,
    env.VERCEL_BRANCH_URL,
    env.VERCEL_URL,
  ];

  for (const candidate of candidates) {
    const resolved = toAbsoluteHttpUrl(candidate);
    if (resolved) return resolved;
  }

  return FALLBACK_SITE_URL;
}
