---
title: Maré Alta, marisqueira em Olhão
summary: Site de uma página para uma marisqueira fictícia, só em HTML, CSS e JavaScript. Menu em JSON com filtros por alérgeno, três idiomas e reservas por WhatsApp.
stack: [HTML, CSS, JavaScript]
category: comercio-local
repoUrl: https://github.com/RFJ26/mare-alta
cover: ../../assets/projects/mare-alta/cover.webp
coverAlt: Página inicial do Maré Alta com o título "Marisco da ria, à mesa em Olhão" e o indicador "Aberto agora"
gallery:
  - src: ../../assets/projects/mare-alta/galeria-1.webp
    alt: Menu filtrado pela categoria Mariscos, com os filtros de alérgenos
  - src: ../../assets/projects/mare-alta/galeria-2.webp
    alt: Formulário de reserva que envia o pedido pelo WhatsApp
featured: true
date: 2026-11-18
---

## O desafio

Mostrar que domino a base da web: um site completo para um restaurante sem frameworks e sem build, só com HTML, CSS e JavaScript. O restaurante é fictício, mas os requisitos são os de um cliente real: o público mistura locais e turistas, o menu muda com frequência e as reservas chegam por WhatsApp.

## A solução

- **Menu em `data/menu.json`** com 18 pratos, preços por dose, kg ou unidade, e os 14 alérgenos da UE. Os filtros por categoria e por alérgeno funcionam em conjunto e ficam guardados no URL.
- **Três idiomas (PT, EN, ES)** com ficheiros JSON. O idioma escolhido fica guardado e o `<html lang>` muda.
- **Reservas por WhatsApp.** O formulário só mostra as horas em que o restaurante aceita reservas, recusa datas passadas e o dia de folga, e abre o `wa.me` com a mensagem formatada.
- **Indicador "Aberto agora / Fechado"** calculado no fuso `Europe/Lisbon`, mesmo para um turista com o telemóvel noutro fuso, incluindo turnos que passam da meia-noite.
- **JavaScript em módulos ES** (`menu.js`, `i18n.js`, `reservas.js`, `horario.js`), CSS com variáveis, Grid e Flexbox, imagens WebP com lazy loading e dados estruturados `Restaurant` em JSON-LD.

## Resultado

Testado a 375, 768 e 1440 px, sem scroll horizontal, e com 100 em todas as categorias do Lighthouse, em mobile e desktop.
