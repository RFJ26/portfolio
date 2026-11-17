import { defaultLang, type Lang } from './ui';

/** Prefixa um caminho com o idioma (o idioma por defeito não tem prefixo). */
export function localizePath(lang: Lang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}
