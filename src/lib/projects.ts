import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

type ProjectData = CollectionEntry<'projects'>['data'];

/** Projeto pronto a mostrar num idioma: dados fundidos com a tradução, se existir. */
export interface Project {
  id: string;
  lang: Lang;
  /** true quando o texto mostrado é a versão portuguesa por falta de tradução. */
  isFallback: boolean;
  data: ProjectData;
  /** Entrada usada para renderizar o corpo Markdown. */
  entry: CollectionEntry<'projects'> | CollectionEntry<'projectsEn'>;
}

/** Todos os projetos no idioma pedido, do mais recente para o mais antigo. */
export async function getProjects(lang: Lang = 'pt'): Promise<Project[]> {
  const base = await getCollection('projects');
  const translations = lang === 'en' ? await getCollection('projectsEn') : [];
  const byId = new Map(translations.map((t) => [t.id, t]));

  return base
    .map((entry): Project => {
      const tr = byId.get(entry.id);
      if (!tr) return { id: entry.id, lang, isFallback: lang !== 'pt', data: entry.data, entry };
      const galleryAlts = tr.data.galleryAlts ?? [];
      return {
        id: entry.id,
        lang,
        isFallback: false,
        data: {
          ...entry.data,
          title: tr.data.title,
          summary: tr.data.summary,
          coverAlt: tr.data.coverAlt ?? entry.data.coverAlt,
          gallery: entry.data.gallery.map((g, i) => ({ ...g, alt: galleryAlts[i] ?? g.alt })),
        },
        entry: tr,
      };
    })
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getFeaturedProjects(lang: Lang, limit = 3): Promise<Project[]> {
  return (await getProjects(lang)).filter((p) => p.data.featured).slice(0, limit);
}

/** Lista única de tecnologias, ordenada pela quantidade de projetos que a usam. */
export function getTechnologies(projects: Project[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of projects) for (const t of p.data.stack) counts.set(t, (counts.get(t) ?? 0) + 1);
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Versão de uma tecnologia segura para URLs e atributos data-*: "Node.js" -> "node-js". */
export function techSlug(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
