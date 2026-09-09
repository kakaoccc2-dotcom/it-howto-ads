import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

/**
 * Production URL used for canonical links, Open Graph, sitemap, and robots.txt.
 * Change this before deploying (Vercel project URL or custom domain).
 */
const site = process.env.PUBLIC_SITE_URL ?? 'https://tejun-navi.example.com';

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
