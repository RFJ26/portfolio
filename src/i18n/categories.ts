import type { Category } from '../content.config';
import type { Lang } from './ui';

export const categoryLabels: Record<Lang, Record<Category, string>> = {
  pt: {
    'comercio-local': 'Comércio local',
    profissional: 'Profissional',
    academico: 'Académico',
    pessoal: 'Pessoal',
  },
  en: {
    'comercio-local': 'Local business',
    profissional: 'Professional',
    academico: 'Academic',
    pessoal: 'Personal',
  },
};
