// horario.js: tudo o que depende do horário, sempre no fuso Europe/Lisbon.
//
// O horário vem de data/info.json, com um ou dois turnos por dia:
//   "sex": [["12:00", "15:30"], ["19:00", "00:30"]]
// Um fecho "menor" do que a abertura (00:30) significa que passa da meia-noite.

import { t, locale } from './i18n.js';

export const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']; // ordem de Date.getDay()

let info = null;

export async function carregarInfo() {
  if (!info) {
    const res = await fetch('data/info.json');
    if (!res.ok) throw new Error(`data/info.json: ${res.status}`);
    info = await res.json();
  }
  return info;
}

/** "19:30" -> 1170 minutos desde a meia-noite. */
export const paraMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** 1170 -> "19:30" (aceita valores acima de 24h). */
export const paraHora = (min) => {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

/**
 * Data e hora atuais em Lisboa, independentemente do fuso do dispositivo.
 * Devolve { data: "2026-11-18", dia: 0-6, minutos: 0-1439 }.
 */
export function agoraEmLisboa(fuso = 'Europe/Lisbon', quando = new Date()) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: fuso,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(quando).map((p) => [p.type, p.value]),
  );
  const data = `${partes.year}-${partes.month}-${partes.day}`;
  return { data, dia: diaDaSemana(data), minutos: Number(partes.hour) * 60 + Number(partes.minute) };
}

/** Dia da semana (0 = domingo) de uma data "AAAA-MM-DD", sem depender do fuso local. */
export function diaDaSemana(data) {
  const [a, m, d] = data.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d)).getUTCDay();
}

/** Soma dias a uma data "AAAA-MM-DD". */
export function somarDias(data, n) {
  const [a, m, d] = data.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, d + n)).toISOString().slice(0, 10);
}

/** Turnos de um dia em minutos; o fecho depois da meia-noite fica > 1440. */
export function turnos(horario, dia) {
  return (horario[DIAS[dia]] ?? []).map(([abre, fecha]) => {
    const ini = paraMinutos(abre);
    let fim = paraMinutos(fecha);
    if (fim <= ini) fim += 1440;
    return [ini, fim];
  });
}

/**
 * Estado atual: { aberto, fechaAs } ou { aberto: false, abre: { emDias, hora } }.
 * Considera os turnos de ontem que passam da meia-noite.
 */
export function estadoAtual(horario, agora) {
  const { dia, minutos } = agora;

  for (const [ini, fim] of turnos(horario, dia)) {
    if (minutos >= ini && minutos < fim) return { aberto: true, fechaAs: paraHora(fim) };
  }
  const ontem = (dia + 6) % 7;
  for (const [ini, fim] of turnos(horario, ontem)) {
    if (fim > 1440 && minutos + 1440 >= ini && minutos + 1440 < fim) {
      return { aberto: true, fechaAs: paraHora(fim) };
    }
  }

  // Fechado: procura a próxima abertura nos próximos 7 dias
  for (let i = 0; i < 8; i++) {
    const d = (dia + i) % 7;
    const proximo = turnos(horario, d).find(([ini]) => i > 0 || ini > minutos);
    if (proximo) return { aberto: false, abre: { emDias: i, hora: paraHora(proximo[0]), dia: d } };
  }
  return { aberto: false, abre: null };
}

/**
 * Horas em que se pode reservar numa data: de 30 em 30 minutos, desde a
 * abertura até 1 hora antes do fecho. Hoje, só a partir de agora + antecedência.
 */
export function horasDisponiveis(info, data, agora) {
  const r = info.reservas;
  const lista = [];
  for (const [ini, fim] of turnos(info.horario, diaDaSemana(data))) {
    for (let m = ini; m <= fim - r.ultimaReservaAntesDeFechar; m += r.intervaloMinutos) {
      if (data === agora.data && m < agora.minutos + r.antecedenciaMinutos) continue;
      if (m >= 1440) continue; // reservas depois da meia-noite: só por telefone
      lista.push(paraHora(m));
    }
  }
  return lista;
}

// ---------------------------------------------------------------------------
// Interface: indicador "Aberto agora / Fechado", tabela do horário e mapa.
// ---------------------------------------------------------------------------


/** Nome do dia da semana no idioma ativo (0 = domingo). */
function nomeDia(dia, formato = 'long') {
  // 2026-11-15 foi um domingo: somar "dia" dias dá o dia pretendido
  return new Intl.DateTimeFormat(locale(), { weekday: formato, timeZone: 'UTC' })
    .format(new Date(Date.UTC(2026, 10, 15 + dia)));
}

function textoEstado(estado) {
  if (estado.aberto) return { classe: 'aberto', titulo: t('estado.aberto'), detalhe: t('estado.fecha_as', { hora: estado.fechaAs }) };
  if (!estado.abre) return { classe: 'fechado', titulo: t('estado.fechado'), detalhe: '' };
  const { emDias, hora, dia } = estado.abre;
  const quando = emDias === 0 ? t('estado.abre_hoje', { hora })
    : emDias === 1 ? t('estado.abre_amanha', { hora })
    : t('estado.abre_dia', { dia: nomeDia(dia), hora });
  return { classe: 'fechado', titulo: t('estado.fechado'), detalhe: quando };
}

function desenharEstado(info) {
  const estado = estadoAtual(info.horario, agoraEmLisboa(info.fusoHorario));
  const { classe, titulo, detalhe } = textoEstado(estado);
  document.querySelectorAll('[data-estado]').forEach((el) => {
    el.className = `estado estado--${classe}${el.classList.contains('estado--hero') ? ' estado--hero' : ''}`;
    el.replaceChildren();
    const ponto = document.createElement('span');
    ponto.className = 'estado__ponto';
    ponto.setAttribute('aria-hidden', 'true');
    const forte = document.createElement('strong');
    forte.textContent = titulo;
    el.append(ponto, forte);
    if (detalhe) el.append(document.createTextNode(` · ${detalhe}`));
    el.hidden = false;
  });
}

function desenharTabela(info) {
  const tbody = document.querySelector('[data-horario-tabela] tbody');
  if (!tbody) return;
  const hoje = agoraEmLisboa(info.fusoHorario).dia;
  // Começa à segunda-feira, como é habitual em Portugal
  const ordem = [1, 2, 3, 4, 5, 6, 0];
  tbody.replaceChildren(
    ...ordem.map((dia) => {
      const tr = document.createElement('tr');
      if (dia === hoje) {
        tr.className = 'is-hoje';
        tr.setAttribute('aria-current', 'date');
      }
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = nomeDia(dia);
      if (dia === hoje) {
        const badge = document.createElement('span');
        badge.className = 'horario__hoje';
        badge.textContent = t('horario.hoje');
        th.append(' ', badge);
      }
      const td = document.createElement('td');
      const lista = info.horario[DIAS[dia]];
      if (lista.length) {
        // Um <span> por turno: em ecrãs estreitos ficam em linhas separadas (ver CSS)
        td.append(...lista.map(([a, f]) => Object.assign(document.createElement('span'), { className: 'turno', textContent: `${a}–${f}` })));
      } else {
        td.textContent = t('horario.fechado');
      }
      if (!lista.length) td.className = 'is-fechado';
      tr.append(th, td);
      return tr;
    }),
  );
}

/** Mapa do OpenStreetMap carregado só a pedido (privacidade e performance). */
function iniciarMapa(info) {
  const caixa = document.querySelector('[data-mapa]');
  const botao = caixa?.querySelector('[data-mapa-carregar]');
  if (!botao) return;
  botao.addEventListener('click', () => {
    const { lat, lng } = info.coordenadas;
    const d = 0.006;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - d},${lat - d},${lng + d},${lat + d}&layer=mapnik&marker=${lat},${lng}`;
    iframe.title = t('local.mapa_titulo');
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    caixa.replaceChildren(iframe);
    caixa.classList.add('is-carregado');
  }, { once: true });
}

export async function iniciarHorario() {
  let info;
  try {
    info = await carregarInfo();
  } catch (erro) {
    console.error('Horário indisponível:', erro);
    return;
  }
  const desenhar = () => { desenharEstado(info); desenharTabela(info); };
  desenhar();
  iniciarMapa(info);
  document.addEventListener('idioma:mudou', desenhar);
  // Atualiza no início de cada minuto
  setTimeout(() => { desenhar(); setInterval(desenhar, 60_000); }, (60 - new Date().getSeconds()) * 1000);
}
