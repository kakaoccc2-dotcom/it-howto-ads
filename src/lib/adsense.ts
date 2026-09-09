export type AdPlacement = 'top' | 'mid' | 'bottom';

/** Default AdSense client. Override with PUBLIC_ADSENSE_CLIENT (empty → this value). */
export const DEFAULT_ADSENSE_CLIENT = 'ca-pub-3011430865071926';

/** Official AdSense client form. Placeholders like ca-pub-xxxxxxxx never match. */
const CLIENT_RE = /^ca-pub-\d{8,}$/;
/** Display ad unit IDs from the AdSense UI are numeric. */
const SLOT_RE = /^\d{6,}$/;

const SLOT_ENV = {
  top: 'PUBLIC_ADSENSE_SLOT_TOP',
  mid: 'PUBLIC_ADSENSE_SLOT_MID',
  bottom: 'PUBLIC_ADSENSE_SLOT_BOTTOM',
} as const satisfies Record<AdPlacement, keyof ImportMetaEnv>;

/**
 * Shared Google certification authority ID for AdSense ads.txt lines.
 * This value is public and the same for every publisher; it is not an account ID.
 * @see https://support.google.com/adsense/answer/12171612
 */
export const ADSENSE_CERT_AUTHORITY_ID = 'f08c47fec0942fa0';

function looksLikePlaceholder(value: string): boolean {
  if (/x{3,}|placeholder|example|your[-_]?id|changeme|dummy/i.test(value)) return true;
  if (/^ca-pub-0+$/i.test(value)) return true;
  if (/^0+$/.test(value)) return true;
  return false;
}

function readPublicEnv(name: keyof ImportMetaEnv): string | undefined {
  const raw = import.meta.env[name];
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (!trimmed || looksLikePlaceholder(trimmed)) return undefined;
  return trimmed;
}

/**
 * Returns a live AdSense client (`ca-pub-` + digits) or `undefined`.
 * Unset / empty env uses {@link DEFAULT_ADSENSE_CLIENT}. An explicit
 * placeholder or non-`ca-pub-` value disables the script (preview override).
 */
export function getAdsenseClient(
  envClient: string | undefined = import.meta.env.PUBLIC_ADSENSE_CLIENT,
): string | undefined {
  const trimmed = envClient?.trim();
  const value = trimmed ? trimmed : DEFAULT_ADSENSE_CLIENT;
  if (looksLikePlaceholder(value) || !CLIENT_RE.test(value)) {
    return undefined;
  }
  return value;
}

export function getAdsenseSlotId(
  placement: AdPlacement,
  explicit?: string,
  envSlot: string | undefined = readPublicEnv(SLOT_ENV[placement]),
): string | undefined {
  for (const candidate of [explicit, envSlot]) {
    const value = candidate?.trim();
    if (!value || looksLikePlaceholder(value) || !SLOT_RE.test(value)) continue;
    return value;
  }
  return undefined;
}

export function adsenseScriptSrc(client: string): string {
  return `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
}

/**
 * Build the ads.txt record from a `ca-pub-…` client id.
 * ads.txt uses `pub-…` (the `ca-` prefix is stripped). Official AdSense format:
 * `google.com, pub-…, DIRECT, f08c47fec0942fa0`.
 */
export function adsTxtLine(client: string | undefined): string | undefined {
  const resolved = getAdsenseClient(client);
  if (!resolved) return undefined;
  const publisher = resolved.replace(/^ca-/, '');
  return `google.com, ${publisher}, DIRECT, ${ADSENSE_CERT_AUTHORITY_ID}`;
}
