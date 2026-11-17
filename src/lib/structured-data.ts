import { site } from '../data/site';

/** Dados estruturados schema.org/Person para a página inicial. */
export function personJsonLd(siteUrl: URL, lang: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': new URL('/#person', siteUrl).href,
    name: site.fullName,
    jobTitle: lang === 'en' ? 'Web developer' : site.role,
    description,
    url: siteUrl.href,
    image: new URL('/og-default.png', siteUrl).href,
    email: `mailto:${site.email}`,
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Algarve',
      addressCountry: 'PT',
    },
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'Universidade do Algarve',
      url: 'https://www.ualg.pt',
    },
    knowsAbout: ['Desenvolvimento web', 'Astro', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PHP', 'MySQL', 'SEO', 'Acessibilidade web'],
    knowsLanguage: ['pt', 'en'],
    sameAs: Object.values(site.social),
    mainEntityOfPage: new URL(lang === 'pt' ? '/' : `/${lang}/`, siteUrl).href,
  };
}

export function projectJsonLd(opts: { url: URL; title: string; description: string; image: URL; date: Date; keywords: string[]; siteUrl: URL; lang: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: opts.title,
    headline: opts.title,
    description: opts.description,
    url: opts.url.href,
    image: opts.image.href,
    dateCreated: opts.date.toISOString().slice(0, 10),
    keywords: opts.keywords.join(', '),
    inLanguage: opts.lang,
    author: { '@id': new URL('/#person', opts.siteUrl).href },
  };
}
