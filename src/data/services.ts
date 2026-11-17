import type { Lang } from '../i18n/ui';

export interface Service { title: string; text: string; icon: 'store' | 'layout' | 'wrench' | 'gauge' }

export const services: Record<Lang, Service[]> = {
  pt: [
    { icon: 'store', title: 'Sites para comércio local', text: 'Restaurantes, lojas e alojamentos com presença online clara, rápida e fácil de atualizar.' },
    { icon: 'layout', title: 'Landing pages', text: 'Páginas focadas numa campanha ou serviço, pensadas para converter visitas em contactos.' },
    { icon: 'gauge', title: 'Performance e SEO', text: 'Sites leves, acessíveis e bem indexados, para aparecer quando procuram por si no Google.' },
    { icon: 'wrench', title: 'Manutenção', text: 'Atualizações de conteúdo, correções e pequenas funcionalidades novas, sem complicações.' },
  ],
};
