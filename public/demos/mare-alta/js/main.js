// main.js: ponto de entrada. Cada secção tem o seu módulo.
import { iniciarI18n } from './i18n.js';
import { iniciarMenu } from './menu.js';
import { iniciarGaleria } from './galeria.js';
import { iniciarReservas } from './reservas.js';
import { iniciarHorario } from './horario.js';

/** Cabeçalho fica sólido depois do hero; menu móvel abre/fecha. */
function iniciarCabecalho() {
  const header = document.querySelector('[data-header]');
  const hero = document.querySelector('.hero');
  if (header && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      header.classList.toggle('is-solido', !entry.isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  }

  const toggle = document.querySelector('[data-nav-toggle]');
  const lista = document.querySelector('[data-nav-lista]');
  if (!toggle || !lista) return;

  const fechar = () => {
    lista.classList.remove('is-aberto');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const aberto = lista.classList.toggle('is-aberto');
    toggle.setAttribute('aria-expanded', String(aberto));
    header.classList.toggle('is-solido', aberto || window.scrollY > 80);
  });
  // Fecha ao escolher uma secção ou com Escape
  lista.addEventListener('click', (e) => { if (e.target.closest('a')) fechar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
}

/** Botão "Reservar" do telemóvel desaparece no hero, na secção de reservas e no footer. */
function iniciarBotaoFlutuante() {
  const botao = document.querySelector('[data-reservar-flutuante]');
  const alvos = [document.querySelector('.hero'), document.getElementById('reservas'), document.querySelector('.footer')].filter(Boolean);
  if (!botao || !('IntersectionObserver' in window)) return;
  const visiveis = new Set();
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
    const esconder = visiveis.size > 0;
    botao.classList.toggle('is-escondido', esconder);
    botao.toggleAttribute('inert', esconder);
  }, { threshold: 0.15 });
  alvos.forEach((alvo) => observador.observe(alvo));
}

iniciarCabecalho();
iniciarBotaoFlutuante();
iniciarGaleria();
await iniciarI18n();
iniciarMenu();
iniciarReservas();
iniciarHorario();

document.querySelectorAll('[data-ano]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
