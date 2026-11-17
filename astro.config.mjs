// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// TODO: define SITE_URL na Vercel (ou troca o valor por defeito) quando tiveres domínio.
const SITE_URL = process.env.SITE_URL ?? 'https://romeu-portfolio.vercel.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: false },
  },
  env: {
    schema: {
      // ID do formulário Formspree (a parte final de https://formspree.io/f/<ID>).
      PUBLIC_FORMSPREE_ID: envField.string({ context: 'client', access: 'public', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
});
