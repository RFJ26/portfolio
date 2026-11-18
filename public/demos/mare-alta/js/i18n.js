// i18n.js: traduções em ficheiros JSON (i18n/pt.json, en.json, es.json).
//
// No HTML:
//   data-i18n="chave"                 -> textContent
//   data-i18n-html="chave"            -> innerHTML (só para textos nossos com <em>)
//   data-i18n-attr="aria-label:chave" -> atributos (vários separados por ";")
//
// O idioma escolhido fica em localStorage e o <html lang> é atualizado.
// Outros módulos ouvem o evento "idioma:mudou" para voltar a desenhar o conteúdo.

export const IDIOMAS = ['pt', 'en', 'es'];
const HTML_LANG = { pt: 'pt-PT', en: 'en', es: 'es' };
const LOCALE = { pt: 'pt-PT', en: 'en-GB', es: 'es-ES' };
const CHAVE_STORAGE = 'mare-alta:idioma';

const cache = new Map();
let atual = 'pt';
let dicionario = {};

/** Idioma inicial: o guardado, senão o do navegador, senão português. */
function idiomaInicial() {
  try {
    const guardado = localStorage.getItem(CHAVE_STORAGE);
    if (IDIOMAS.includes(guardado)) return guardado;
  } catch { /* localStorage bloqueado: segue em frente */ }
  for (const l of navigator.languages ?? [navigator.language]) {
    const base = l.slice(0, 2).toLowerCase();
    if (IDIOMAS.includes(base)) return base;
  }
  return 'pt';
}

async function carregar(lang) {
  if (!cache.has(lang)) {
    const res = await fetch(`i18n/${lang}.json`);
    if (!res.ok) throw new Error(`Não foi possível carregar i18n/${lang}.json (${res.status})`);
    cache.set(lang, await res.json());
  }
  return cache.get(lang);
}

/** Traduz uma chave. Aceita variáveis: t('x', { n: 2 }) troca "{n}" por 2. */
export function t(chave, vars = {}) {
  let texto = dicionario[chave] ?? chave;
  for (const [k, v] of Object.entries(vars)) texto = texto.replaceAll(`{${k}}`, String(v));
  return texto;
}

export const idioma = () => atual;
export const locale = () => LOCALE[atual];

function aplicar(raiz = document) {
  raiz.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  raiz.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  raiz.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    for (const par of el.dataset.i18nAttr.split(';')) {
      const [attr, chave] = par.split(':').map((s) => s.trim());
      if (attr && chave) el.setAttribute(attr, t(chave));
    }
  });
}

export async function mudarIdioma(lang) {
  if (!IDIOMAS.includes(lang)) lang = 'pt';
  dicionario = await carregar(lang);
  atual = lang;

  document.documentElement.lang = HTML_LANG[lang];
  document.title = t('meta.titulo');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.descricao'));
  aplicar();

  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
  try { localStorage.setItem(CHAVE_STORAGE, lang); } catch { /* ignora */ }

  document.dispatchEvent(new CustomEvent('idioma:mudou', { detail: { lang } }));
}

export async function iniciarI18n() {
  document.querySelectorAll('[data-lang]').forEach((b) => {
    b.addEventListener('click', () => mudarIdioma(b.dataset.lang));
  });
  await mudarIdioma(idiomaInicial());
}
