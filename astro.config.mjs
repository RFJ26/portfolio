// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: define SITE_URL na Vercel (ou troca o valor por defeito) quando tiveres domínio.
const SITE_URL = process.env.SITE_URL ?? 'https://romeu-portfolio.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
