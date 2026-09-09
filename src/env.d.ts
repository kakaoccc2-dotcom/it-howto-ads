/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_AMAZON_ASSOCIATE_TAG?: string;
  readonly PUBLIC_SITE_URL?: string;
  /** AdSense client. Unset uses DEFAULT_ADSENSE_CLIENT (ca-pub-3011430865071926). */
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ADSENSE_SLOT_TOP?: string;
  readonly PUBLIC_ADSENSE_SLOT_MID?: string;
  readonly PUBLIC_ADSENSE_SLOT_BOTTOM?: string;
}

interface Window {
  adsbygoogle?: unknown[];
}
