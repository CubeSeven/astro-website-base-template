// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import sitemap from 'astro-sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://yourdomain.com',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon(),
    sitemap({
      // Use a single sitemap.xml file instead of a sitemap index.
      // Simpler for small/medium brochure sites.
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        if (item.url === undefined) return undefined;
        const url = new URL(item.url);
        // Match canonical URL format: trailing slash for non-root pages.
        const normalizedUrl = url.pathname === '/' ? url.origin + '/' : `${url.origin}${url.pathname.replace(/\/$/, '')}/`;
        const pathname = url.pathname.replace(/\/$/, '');
        return {
          url: normalizedUrl,
          changefreq: pathname === '' ? 'weekly' : pathname.startsWith('/blog') ? 'monthly' : 'monthly',
          priority: pathname === '' ? 1.0 : pathname.startsWith('/blog') ? 0.7 : 0.8,
          lastmod: new Date().toISOString(),
        };
      },
    }),
  ],
});
