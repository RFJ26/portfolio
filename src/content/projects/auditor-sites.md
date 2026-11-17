---
title: Auditor de sites
summary: Ferramenta de linha de comandos que analisa vários sites de uma vez e gera um relatório com performance, SEO e acessibilidade.
stack: [Node.js, TypeScript, Puppeteer]
category: profissional
repoUrl: https://github.com/USERNAME/auditor-sites
cover: ../../assets/projects/auditor-sites/cover.webp
coverAlt: Relatório gerado pelo auditor de sites
gallery:
  - src: ../../assets/projects/auditor-sites/galeria-1.webp
    alt: Resumo de pontuações por site
  - src: ../../assets/projects/auditor-sites/galeria-2.webp
    alt: Lista de problemas encontrados
featured: true
date: 2026-10-02
---

## O desafio

Ao fazer manutenção de vários sites de clientes, verificar cada um à mão era lento e fácil de esquecer.

## A solução

Uma CLI em Node.js e TypeScript que recebe uma lista de URLs, corre o Lighthouse com Puppeteer e gera um relatório em HTML com:

- Pontuações de performance, acessibilidade, boas práticas e SEO.
- Links partidos e imagens sem texto alternativo.
- Comparação com a execução anterior.

## Resultado

Consigo ver o estado de todos os sites num único relatório semanal.
