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
  // Paths are not origins (`/blog` would otherwise become https://blog).
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return undefined;
  }

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : trimmed.includes('://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    if (!isPlausibleHostname(url.hostname)) return undefined;
    return url.href.replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

/** @param {string} hostname */
function isPlausibleHostname(hostname) {
  if (!hostname) return false;
  const host = hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost') return true;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return true;
  return host.includes('.');
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
