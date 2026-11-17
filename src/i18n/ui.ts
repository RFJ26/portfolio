export const languages = { pt: 'Português', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pt';
export const langs = Object.keys(languages) as Lang[];

/** Códigos BCP 47 usados em <html lang>, hreflang e Open Graph. */
export const locales: Record<Lang, { html: string; og: string; intl: string }> = {
  pt: { html: 'pt-PT', og: 'pt_PT', intl: 'pt-PT' },
  en: { html: 'en', og: 'en_GB', intl: 'en-GB' },
};

export const ui = {
  pt: {
    'skip': 'Saltar para o conteúdo',
    'nav.home': 'Início',
    'nav.projects': 'Projetos',
    'nav.about': 'Sobre',
    'nav.contact': 'Contacto',
    'nav.menu': 'Menu',
    'nav.main': 'Navegação principal',
    'theme.toggle': 'Alternar tema claro/escuro',
    'lang.switch': 'Read in English',
    'footer.rights': 'Feito com Astro e Tailwind CSS.',
    'footer.location': 'Algarve, Portugal',
    'site.role': 'Programador web júnior',
  },
  en: {
    'skip': 'Skip to content',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.menu': 'Menu',
    'nav.main': 'Main navigation',
    'theme.toggle': 'Toggle light/dark theme',
    'lang.switch': 'Ler em português',
    'footer.rights': 'Built with Astro and Tailwind CSS.',
    'footer.location': 'Algarve, Portugal',
    'site.role': 'Junior web developer',
  },
} as const;

export type UIKey = keyof (typeof ui)['pt'];

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => (ui[lang] as Record<UIKey, string>)[key] ?? ui[defaultLang][key];
}
