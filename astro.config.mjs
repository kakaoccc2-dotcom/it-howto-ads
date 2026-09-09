import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { resolveSiteUrl } from './src/lib/resolve-site-url.mjs';

/**
 * Production URL used for canonical links, Open Graph, sitemap, and robots.txt.
 * Prefer PUBLIC_SITE_URL when it is a real absolute URL; otherwise use Vercel's
 * deployment host or https://example.com so `astro build` never sees an empty
 * or relative `site` value.
 */
const site = resolveSiteUrl();

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'weekly',
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'ja',
        locales: { ja: 'ja-JP' },
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
