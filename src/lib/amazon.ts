/** Default Amazon Associates Japan tracking ID (associate tag). */
export const DEFAULT_AMAZON_ASSOCIATE_TAG = 'wasshoi22451-22';

export const AMAZON_JP_ORIGIN = 'https://www.amazon.co.jp';

/** Use on outbound affiliate anchors. */
export const AMAZON_AFFILIATE_REL = 'nofollow sponsored noopener noreferrer';

/** Official Amazon Associates Japan site-wide disclosure. */
export const AMAZON_ASSOCIATE_DISCLOSURE =
  'Amazonのアソシエイトとして、手順ナビは適格販売により収入を得ています。';

export function resolveAmazonAssociateTag(
  envTag: string | undefined = import.meta.env.PUBLIC_AMAZON_ASSOCIATE_TAG,
): string {
  const trimmed = envTag?.trim();
  return trimmed ? trimmed : DEFAULT_AMAZON_ASSOCIATE_TAG;
}

function applyTag(url: URL, tag: string): string {
  url.searchParams.set('tag', tag);
  return url.href;
}

function isAmazonJpHost(hostname: string): boolean {
  const host = hostname.replace(/^www\./i, '').toLowerCase();
  return host === 'amazon.co.jp';
}

/**
 * Search-style affiliate URL on amazon.co.jp.
 * Prefer this when a specific ASIN has not been verified.
 */
export function amazonSearchUrl(
  keywords: string,
  tag: string = resolveAmazonAssociateTag(),
): string {
  const query = keywords.trim();
  if (!query) {
    throw new Error('amazonSearchUrl requires non-empty keywords');
  }
  const url = new URL('/s', AMAZON_JP_ORIGIN);
  url.searchParams.set('k', query);
  return applyTag(url, tag);
}

/** Product page URL. Only call with a known, verified ASIN. */
export function amazonProductUrl(
  asin: string,
  tag: string = resolveAmazonAssociateTag(),
): string {
  const clean = asin.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(clean)) {
    throw new Error(`Invalid ASIN: ${asin}`);
  }
  const url = new URL(`/dp/${clean}`, AMAZON_JP_ORIGIN);
  return applyTag(url, tag);
}

/** Append or replace `tag` on amazon.co.jp URLs. Other hosts are left unchanged. */
export function withAmazonTag(
  href: string,
  tag: string = resolveAmazonAssociateTag(),
): string {
  const url = new URL(href);
  if (!isAmazonJpHost(url.hostname)) {
    return href;
  }
  return applyTag(url, tag);
}

export function amazonAffiliateHref(options: {
  search?: string;
  asin?: string;
  href?: string;
  tag?: string;
}): string {
  const tag = options.tag ?? resolveAmazonAssociateTag();
  if (options.href) {
    return withAmazonTag(options.href, tag);
  }
  if (options.asin) {
    return amazonProductUrl(options.asin, tag);
  }
  if (options.search) {
    return amazonSearchUrl(options.search, tag);
  }
  throw new Error('amazonAffiliateHref requires search, asin, or href');
}
