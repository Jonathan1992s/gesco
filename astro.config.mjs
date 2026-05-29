import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://gescovirtual.com',
  output: 'server',
  adapter: netlify(),
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith('/gracias/') && !page.includes('/api/'),
      serialize(item) {
        // Prioridades diferenciadas por importancia de página
        if (item.url === 'https://gescovirtual.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (
          item.url.includes('/preuniversitario/') ||
          item.url.includes('/universidades-publicas/') ||
          item.url.includes('/universidades-privadas/') ||
          item.url.includes('/blog/')
        ) {
          item.priority = 0.9;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/universidades/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (item.url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else if (
          item.url.includes('/verificar/') ||
          item.url.includes('/convenios/')
        ) {
          item.priority = 0.4;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
