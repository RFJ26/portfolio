// reservas.js: valida o formulário e abre o WhatsApp com a mensagem pronta.
//
// - Data: entre hoje e +60 dias (em Lisboa), nunca num dia de folga
// - Hora: lista gerada a partir do horário dessa data (horario.js)
// - Pessoas: 1 a 12; grupos maiores são encaminhados para o telefone
// A mensagem vai sempre em português (é lida pela equipa), com o idioma do cliente.

import { t, idioma, locale } from './i18n.js';
import { carregarInfo, agoraEmLisboa, horasDisponiveis, somarDias, diaDaSemana } from './horario.js';

const NOMES_IDIOMA = { pt: 'Português', en: 'Inglês', es: 'Espanhol' };

let info;
let form;
let campos;

function mostrarErro(nome, mensagem) {
  const input = campos[nome];
  const erro = form.querySelector(`#erro-${nome}`);
  erro.textContent = mensagem ?? '';
  erro.hidden = !mensagem;
  input.setAttribute('aria-invalid', String(Boolean(mensagem)));
}

function preencherHoras() {
  const select = campos.hora;
  const anterior = select.value;
  const data = campos.data.value;
  const opcoes = data ? horasDisponiveis(info, data, agoraEmLisboa(info.fusoHorario)) : [];

  const primeira = new Option(
    !data ? t('reservas.hora_escolha_data') : opcoes.length ? t('reservas.hora_escolha') : t('reservas.hora_nenhuma'),
    '',
  );
  select.replaceChildren(primeira, ...opcoes.map((h) => new Option(h, h)));
  select.disabled = opcoes.length === 0;
  if (opcoes.includes(anterior)) select.value = anterior;
}

/** Valida um campo e devolve true se estiver certo. */
function validar(nome) {
  const v = campos[nome].value.trim();
  const agora = agoraEmLisboa(info.fusoHorario);
  let erro = null;

  switch (nome) {
    case 'nome':
      if (!v) erro = t('reservas.erro_obrigatorio');
      else if (v.length < 2) erro = t('reservas.erro_nome');
      break;
    case 'data': {
      const max = somarDias(agora.data, info.reservas.diasMaximos);
      if (!v) erro = t('reservas.erro_obrigatorio');
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) erro = t('reservas.erro_data');
      else if (v < agora.data) erro = t('reservas.erro_passado');
      else if (v > max) erro = t('reservas.erro_longe', { n: info.reservas.diasMaximos });
      else if (horasDisponiveis(info, v, { data: '', minutos: 0 }).length === 0) erro = t('reservas.erro_fechado');
      else if (horasDisponiveis(info, v, agora).length === 0) erro = t('reservas.erro_sem_horas');
      break;
    }
    case 'hora':
      if (!v) erro = t('reservas.erro_hora');
      else if (!horasDisponiveis(info, campos.data.value, agora).includes(v)) erro = t('reservas.erro_hora');
      break;
    case 'pessoas': {
      const n = Number(v);
      if (!v) erro = t('reservas.erro_obrigatorio');
      else if (!Number.isInteger(n) || n < 1) erro = t('reservas.erro_pessoas');
      else if (n > info.reservas.maxPessoas) erro = t('reservas.erro_grupo', { max: info.reservas.maxPessoas, tel: info.telefone });
      break;
    }
    case 'observacoes':
      if (v.length > 300) erro = t('reservas.erro_obs');
      break;
  }

  mostrarErro(nome, erro);
  return !erro;
}

function mensagemWhatsApp(dados) {
  // Data por extenso, sempre em português, para a equipa
  const [a, m, d] = dados.data.split('-').map(Number);
  const dataLonga = new Intl.DateTimeFormat('pt-PT', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  }).format(new Date(Date.UTC(a, m - 1, d)));

  const linhas = [
    `*Pedido de reserva · ${info.nome}*`,
    '',
    `*Nome:* ${dados.nome}`,
    `*Data:* ${dataLonga}`,
    `*Hora:* ${dados.hora}`,
    `*Pessoas:* ${dados.pessoas}`,
  ];
  if (dados.observacoes) linhas.push(`*Observações:* ${dados.observacoes}`);
  linhas.push(`*Idioma do cliente:* ${NOMES_IDIOMA[idioma()]}`);
  return linhas.join('\n');
}

function aoSubmeter(e) {
  e.preventDefault();
  const ordem = ['nome', 'data', 'hora', 'pessoas', 'observacoes'];
  const invalidos = ordem.filter((n) => !validar(n));
  const estado = form.querySelector('[data-reserva-estado]');

  if (invalidos.length) {
    campos[invalidos[0]].focus();
    estado.className = 'reservas__estado reservas__estado--erro';
    estado.textContent = t(invalidos.length === 1 ? 'reservas.erros_1' : 'reservas.erros', { n: invalidos.length });
    estado.hidden = false;
    return;
  }

  const dados = Object.fromEntries(ordem.map((n) => [n, campos[n].value.trim()]));
  const url = `https://wa.me/${info.whatsapp}?text=${encodeURIComponent(mensagemWhatsApp(dados))}`;
  const janela = window.open(url, '_blank', 'noopener');

  // Mostra sempre um link, caso o browser tenha bloqueado a nova janela
  estado.className = 'reservas__estado reservas__estado--ok';
  estado.replaceChildren(
    document.createTextNode(t(janela === null ? 'reservas.bloqueado' : 'reservas.sucesso') + ' '),
    Object.assign(document.createElement('a'), {
      href: url, target: '_blank', rel: 'noopener', textContent: t('reservas.abrir_whatsapp'),
    }),
  );
  estado.hidden = false;
}

function atualizarLimitesData() {
  const hoje = agoraEmLisboa(info.fusoHorario).data;
  campos.data.min = hoje;
  campos.data.max = somarDias(hoje, info.reservas.diasMaximos);
  campos.pessoas.max = String(info.reservas.maxPessoas + 8); // aceita escrever mais, para mostrar a mensagem de grupo
}

/** Resumo do dia escolhido, por exemplo "sábado, 22 de novembro". */
function resumoData() {
  const out = form.querySelector('[data-reserva-dia]');
  const v = campos.data.value;
  if (!v || !/^\d{4}-\d{2}-\d{2}$/.test(v)) { out.textContent = ''; return; }
  const [a, m, d] = v.split('-').map(Number);
  out.textContent = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(Date.UTC(a, m - 1, d)));
  out.dataset.dia = String(diaDaSemana(v));
}

export async function iniciarReservas() {
  form = document.querySelector('[data-reserva]');
  if (!form) return;
  try {
    info = await carregarInfo();
  } catch (erro) {
    console.error('Reservas indisponíveis:', erro);
    return; // o formulário continua a mostrar o telefone como alternativa
  }

  form.noValidate = true; // validação própria, com mensagens traduzidas
  campos = {
    nome: form.elements.nome,
    data: form.elements.data,
    hora: form.elements.hora,
    pessoas: form.elements.pessoas,
    observacoes: form.elements.observacoes,
  };

  atualizarLimitesData();
  preencherHoras();

  campos.data.addEventListener('change', () => {
    resumoData();
    preencherHoras();
    validar('data');
    if (campos.hora.value) validar('hora');
  });

  // Valida ao sair do campo; enquanto há erro, volta a validar a cada alteração
  for (const nome of Object.keys(campos)) {
    const input = campos[nome];
    input.addEventListener('blur', () => { if (input.value || input.getAttribute('aria-invalid') === 'true') validar(nome); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validar(nome); });
  }

  const contador = form.querySelector('[data-reserva-contador]');
  campos.observacoes.addEventListener('input', () => {
    contador.textContent = `${campos.observacoes.value.length}/300`;
  });

  form.addEventListener('submit', aoSubmeter);

  // Ao mudar de idioma: textos das opções e mensagens de erro visíveis
  document.addEventListener('idioma:mudou', () => {
    preencherHoras();
    resumoData();
    for (const nome of Object.keys(campos)) {
      if (campos[nome].getAttribute('aria-invalid') === 'true') validar(nome);
    }
  });
}
