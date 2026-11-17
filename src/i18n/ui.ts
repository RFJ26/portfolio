export const languages = { pt: 'Português' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'pt';

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
    'footer.rights': 'Feito com Astro e Tailwind CSS.',
    'footer.location': 'Algarve, Portugal',
  },
} as const;

export type UIKey = keyof (typeof ui)['pt'];

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => (ui[lang] as Record<UIKey, string>)[key] ?? ui[defaultLang][key];
}
