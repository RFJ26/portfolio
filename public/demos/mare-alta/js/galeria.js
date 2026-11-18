// galeria.js: lightbox com <dialog> nativo (foco, Escape e fundo já vêm do browser).
// Sem JS, cada miniatura é um link normal para a imagem grande.

export function iniciarGaleria() {
  const dialog = document.querySelector('[data-lightbox]');
  const links = [...document.querySelectorAll('[data-galeria-item]')];
  if (!dialog || !links.length || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector('[data-lightbox-img]');
  const legenda = dialog.querySelector('[data-lightbox-legenda]');
  let atual = 0;
  let ultimoLink = null;

  function mostrar(i) {
    atual = (i + links.length) % links.length;
    const link = links[atual];
    const mini = link.querySelector('img');
    img.src = link.href;
    img.alt = mini.alt;
    legenda.textContent = `${mini.alt} (${atual + 1}/${links.length})`;
  }

  links.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      ultimoLink = link;
      mostrar(i);
      dialog.showModal();
    });
  });

  dialog.querySelector('[data-lightbox-fechar]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lightbox-ant]').addEventListener('click', () => mostrar(atual - 1));
  dialog.querySelector('[data-lightbox-seg]').addEventListener('click', () => mostrar(atual + 1));

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });

  // Clique no fundo escuro (fora da figura) fecha
  dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  // Swipe no telemóvel
  let inicioX = null;
  dialog.addEventListener('touchstart', (e) => { inicioX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });

  // Devolve o foco à miniatura que abriu o lightbox
  dialog.addEventListener('close', () => ultimoLink?.focus());
}
