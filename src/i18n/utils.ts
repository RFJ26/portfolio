import { defaultLang, languages, type Lang } from './ui';

/**
 * Segmentos de URL traduzidos. A chave é o segmento em português (idioma por defeito).
 * Ex.: /projetos/kanban/ (pt) <-> /en/projects/kanban/ (en)
 */
const segments: Record<string, Partial<Record<Lang, string>>> = {
  projetos: { en: 'projects' },
  sobre: { en: 'about' },
  contacto: { en: 'contact' },
};

/** Converte um caminho escrito em português para o idioma pedido (com prefixo /en/). */
export function localizePath(lang: Lang, path: string): string {
  const [pathname, query = ''] = path.split('?');
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const translated = clean
    .split('/')
    .map((seg) => segments[seg]?.[lang] ?? seg)
    .join('/');
  const prefixed = lang === defaultLang ? translated : `/${lang}${translated === '/' ? '/' : translated}`;
  return query ? `${prefixed}?${query}` : prefixed;
}

/** Descobre o idioma de um URL a partir do prefixo. */
export function getLangFromPath(pathname: string): Lang {
  const first = pathname.split('/')[1];
  return first in languages ? (first as Lang) : defaultLang;
}

/** Devolve o caminho equivalente, em português, de qualquer URL do site. */
export function toDefaultPath(pathname: string): string {
  const lang = getLangFromPath(pathname);
  const withoutPrefix = lang === defaultLang ? pathname : pathname.slice(lang.length + 1) || '/';
  return withoutPrefix
    .split('/')
    .map((seg) => Object.entries(segments).find(([, tr]) => tr[lang] === seg)?.[0] ?? seg)
    .join('/');
}

/** Caminho da página atual noutro idioma (para o seletor de idioma e hreflang). */
export function translatePath(pathname: string, target: Lang): string {
  return localizePath(target, toDefaultPath(pathname));
}
