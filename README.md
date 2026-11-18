# Portefólio do Romeu

Site pessoal em Astro + Tailwind CSS, estático, com deploy na Vercel. Português em `/` e inglês em `/en/`.

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências |
| `npm run dev` | Servidor local em `http://localhost:4321` |
| `npm run build` | Gera o site em `dist/` |
| `npm run preview` | Serve o `dist/` localmente |
| `npm run check` | Verificação de tipos (`astro check`) |

## Variáveis de ambiente

Copia `.env.example` para `.env`. Na Vercel, define-as em *Settings → Environment Variables*.

- `PUBLIC_FORMSPREE_ID`: ID do formulário Formspree (`https://formspree.io/f/<ID>`). Sem ele, o formulário fica desativado e aparece um aviso.
- `SITE_URL`: URL público, usado no sitemap, canonical, hreflang e Open Graph.

## Adicionar um projeto

1. Cria `src/content/projects/<slug>.md` com o frontmatter:

   ```yaml
   title: Nome do projeto
   summary: Uma ou duas frases (máx. 220 caracteres).
   stack: [Astro, Tailwind CSS]
   category: comercio-local # comercio-local | profissional | academico | pessoal
   repoUrl: https://github.com/...   # opcional
   liveUrl: https://...              # opcional
   cover: ../../assets/projects/<slug>/cover.webp
   coverAlt: Descrição da imagem
   gallery:                          # opcional
     - src: ../../assets/projects/<slug>/galeria-1.webp
       alt: Descrição
   featured: true                    # aparece na página inicial (máx. 3)
   date: 2026-11-17
   ```

2. Põe as imagens em `src/assets/projects/<slug>/` (o Astro otimiza-as no build).
3. Para a versão inglesa, cria `src/content/projects/en/<slug>.md` só com `title`, `summary`, `coverAlt`, `galleryAlts` e o texto. Se não existir, a página inglesa mostra o texto em português com um aviso.

## Estrutura

- `src/pages/`: rotas (as de inglês em `src/pages/en/`, com URLs traduzidos)
- `src/views/`: corpo de cada página, partilhado pelos dois idiomas
- `src/components/`: layout, UI, home, projetos, contacto, SEO
- `src/i18n/`: textos da interface, categorias e tradução de URLs
- `src/data/site.ts`: nome, email e redes sociais

## Antes de publicar

Procura `TODO` e `USERNAME` no projeto: email, links das redes sociais, URLs dos repositórios e, se quiseres, o apelido. As imagens em `src/assets/projects/` são marcadores; substitui-as por capturas reais.

## Créditos

Layout inspirado no template [vCard](https://github.com/codewithsadee/vcard-personal-portfolio) de codewithsadee (licença MIT), recriado em Astro + Tailwind com outra paleta de cores.
