// menu.js: carrega data/menu.json, desenha os pratos e aplica os filtros.
//
// Filtros:
//  - categoria: um de cada vez ("todos" mostra tudo, agrupado por categoria)
//  - alérgenos: por exclusão; marcar "crustáceos" esconde os pratos que os contêm
// O estado fica no URL (?cat=mariscos&sem=gluten,leite) para se poder partilhar.

import { t, idioma, locale } from './i18n.js';

let dados = null;
const estado = { categoria: 'todos', sem: new Set() };
const el = {};

function lerUrl() {
  const p = new URLSearchParams(location.search);
  const cat = p.get('cat');
  if (cat && dados.categorias.includes(cat)) estado.categoria = cat;
  const sem = (p.get('sem') ?? '').split(',').filter((a) => dados.alergenos.includes(a));
  estado.sem = new Set(sem);
}

function escreverUrl() {
  const url = new URL(location.href);
  if (estado.categoria === 'todos') url.searchParams.delete('cat');
  else url.searchParams.set('cat', estado.categoria);
  if (estado.sem.size) url.searchParams.set('sem', [...estado.sem].join(','));
  else url.searchParams.delete('sem');
  history.replaceState(null, '', url);
}

/** Cria um elemento com classe e texto, para não montar HTML com strings. */
function criar(tag, classe, texto) {
  const n = document.createElement(tag);
  if (classe) n.className = classe;
  if (texto != null) n.textContent = texto;
  return n;
}

function formatarPreco(prato) {
  const valor = new Intl.NumberFormat(locale(), { style: 'currency', currency: dados.moeda }).format(prato.preco);
  if (prato.unidade === 'kg') return `${valor} ${t('menu.por_kg')}`;
  if (prato.unidade === 'un') return `${valor} ${t('menu.por_un')}`;
  return valor;
}

function desenharFiltros() {
  // Categorias: grupo de botões com aria-pressed
  el.categorias.replaceChildren(
    ...['todos', ...dados.categorias].map((cat) => {
      const b = criar('button', 'filtro', cat === 'todos' ? t('menu.todos') : t(`cat.${cat}`));
      b.type = 'button';
      b.dataset.cat = cat;
      b.setAttribute('aria-pressed', String(estado.categoria === cat));
      return b;
    }),
  );

  // Alérgenos: checkboxes verdadeiras, estilizadas como chips
  el.alergenos.replaceChildren(
    ...dados.alergenos.map((a) => {
      const label = criar('label', 'chip');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = a;
      input.checked = estado.sem.has(a);
      label.append(input, criar('span', null, t(`alerg.${a}`)));
      return label;
    }),
  );
}

function cartaoPrato(prato) {
  const lang = idioma();
  const li = criar('li', 'prato');

  const topo = criar('div', 'prato__topo');
  topo.append(criar('h4', 'prato__nome', prato.nome[lang] ?? prato.nome.pt));
  topo.append(criar('span', 'prato__linha'));
  topo.append(criar('span', 'prato__preco', formatarPreco(prato)));
  li.append(topo);

  li.append(criar('p', 'prato__desc', prato.descricao[lang] ?? prato.descricao.pt));

  const rodape = criar('div', 'prato__rodape');
  if (prato.tags.length) {
    const tags = criar('ul', 'prato__tags');
    tags.setAttribute('aria-label', t('menu.etiquetas'));
    prato.tags.forEach((tag) => tags.append(criar('li', `tag tag--${tag}`, t(`tag.${tag}`))));
    rodape.append(tags);
  }
  const alerg = prato.alergenos.length
    ? `${t('menu.contem')}: ${prato.alergenos.map((a) => t(`alerg.${a}`).toLowerCase()).join(', ')}`
    : t('menu.sem_alergenos');
  rodape.append(criar('p', 'prato__alergenos', alerg));
  li.append(rodape);
  return li;
}

function desenharPratos() {
  const visiveis = dados.pratos.filter(
    (p) =>
      (estado.categoria === 'todos' || p.categoria === estado.categoria) &&
      !p.alergenos.some((a) => estado.sem.has(a)),
  );

  const blocos = [];
  const cats = estado.categoria === 'todos' ? dados.categorias : [estado.categoria];
  for (const cat of cats) {
    const daCat = visiveis.filter((p) => p.categoria === cat);
    if (!daCat.length) continue;
    const bloco = criar('section', 'menu__categoria');
    bloco.setAttribute('aria-labelledby', `cat-${cat}`);
    const h3 = criar('h3', 'menu__cat-titulo', t(`cat.${cat}`));
    h3.id = `cat-${cat}`;
    const ul = criar('ul', 'menu__lista');
    daCat.forEach((p) => ul.append(cartaoPrato(p)));
    bloco.append(h3, ul);
    blocos.push(bloco);
  }

  el.pratos.replaceChildren(...blocos);
  el.vazio.hidden = visiveis.length > 0;
  el.estado.textContent = t(visiveis.length === 1 ? 'menu.contagem_1' : 'menu.contagem', { n: visiveis.length });
  el.limpar.hidden = estado.categoria === 'todos' && estado.sem.size === 0;
  el.badge.hidden = estado.sem.size === 0;
  el.badge.textContent = String(estado.sem.size);
}

function atualizar() {
  desenharFiltros();
  desenharPratos();
  escreverUrl();
}

export async function iniciarMenu() {
  const raiz = document.querySelector('[data-menu]');
  if (!raiz) return;
  Object.assign(el, {
    categorias: raiz.querySelector('[data-menu-categorias]'),
    alergenos: raiz.querySelector('[data-menu-alergenos]'),
    pratos: raiz.querySelector('[data-menu-pratos]'),
    vazio: raiz.querySelector('[data-menu-vazio]'),
    estado: raiz.querySelector('[data-menu-estado]'),
    limpar: raiz.querySelector('[data-menu-limpar]'),
    badge: raiz.querySelector('[data-menu-badge]'),
    detalhes: raiz.querySelector('[data-menu-detalhes]'),
  });

  // Painel de alérgenos: aberto em ecrãs largos ou se já houver filtros no URL
  const largo = window.matchMedia('(min-width: 768px)');

  try {
    const res = await fetch('data/menu.json');
    if (!res.ok) throw new Error(res.status);
    dados = await res.json();
  } catch (erro) {
    console.error('Menu indisponível:', erro);
    el.pratos.replaceChildren(criar('p', 'menu__erro', t('menu.erro')));
    return;
  }

  lerUrl();
  el.detalhes.open = largo.matches || estado.sem.size > 0;

  el.categorias.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-cat]');
    if (!b) return;
    estado.categoria = b.dataset.cat;
    atualizar();
    // Mantém o foco no botão escolhido depois de redesenhar
    el.categorias.querySelector(`[data-cat="${estado.categoria}"]`)?.focus();
  });

  el.alergenos.addEventListener('change', (e) => {
    const input = e.target;
    if (input.checked) estado.sem.add(input.value);
    else estado.sem.delete(input.value);
    // Só redesenha os pratos: as checkboxes já estão certas e o foco não salta
    desenharPratos();
    escreverUrl();
  });

  el.limpar.addEventListener('click', () => {
    estado.categoria = 'todos';
    estado.sem.clear();
    atualizar();
  });

  document.addEventListener('idioma:mudou', atualizar);
  atualizar();
}
