import type { Category, LanguageCode } from './types';

/** Display order of the category tabs (after the implicit "All"). */
export const CATEGORY_ORDER: Category[] = [
  'top',
  'world',
  'politics',
  'business',
  'technology',
  'science',
  'sport',
  'culture',
  'health',
];

/**
 * Localized category labels. Keeping the chrome in the active reading language
 * is part of the "one language at a time" experience.
 */
const CATEGORY_LABELS: Record<Category, Record<LanguageCode, string>> = {
  top: {
    cs: 'Hlavní', nl: 'Voorpagina', fr: 'À la une', en: 'Top', de: 'Schlagzeilen',
    es: 'Portada', it: 'In primo piano', pt: 'Destaques', vi: 'Mới nhất',
  },
  world: {
    cs: 'Svět', nl: 'Buitenland', fr: 'Monde', en: 'World', de: 'Welt',
    es: 'Mundo', it: 'Mondo', pt: 'Mundo', vi: 'Thế giới',
  },
  politics: {
    cs: 'Politika', nl: 'Politiek', fr: 'Politique', en: 'Politics', de: 'Politik',
    es: 'Política', it: 'Politica', pt: 'Política', vi: 'Chính trị',
  },
  business: {
    cs: 'Ekonomika', nl: 'Economie', fr: 'Économie', en: 'Business', de: 'Wirtschaft',
    es: 'Economía', it: 'Economia', pt: 'Economia', vi: 'Kinh doanh',
  },
  technology: {
    cs: 'Technologie', nl: 'Technologie', fr: 'Technologie', en: 'Technology', de: 'Technik',
    es: 'Tecnología', it: 'Tecnologia', pt: 'Tecnologia', vi: 'Công nghệ',
  },
  science: {
    cs: 'Věda', nl: 'Wetenschap', fr: 'Sciences', en: 'Science', de: 'Wissenschaft',
    es: 'Ciencia', it: 'Scienza', pt: 'Ciência', vi: 'Khoa học',
  },
  sport: {
    cs: 'Sport', nl: 'Sport', fr: 'Sport', en: 'Sport', de: 'Sport',
    es: 'Deportes', it: 'Sport', pt: 'Esportes', vi: 'Thể thao',
  },
  culture: {
    cs: 'Kultura', nl: 'Cultuur', fr: 'Culture', en: 'Culture', de: 'Kultur',
    es: 'Cultura', it: 'Cultura', pt: 'Cultura', vi: 'Văn hóa',
  },
  health: {
    cs: 'Zdraví', nl: 'Gezondheid', fr: 'Santé', en: 'Health', de: 'Gesundheit',
    es: 'Salud', it: 'Salute', pt: 'Saúde', vi: 'Sức khỏe',
  },
};

const ALL_LABEL: Record<LanguageCode, string> = {
  cs: 'Vše', nl: 'Alles', fr: 'Tout', en: 'All', de: 'Alle',
  es: 'Todo', it: 'Tutto', pt: 'Tudo', vi: 'Tất cả',
};

export function categoryLabel(category: Category, language: LanguageCode): string {
  return CATEGORY_LABELS[category]?.[language] ?? category;
}

export function allLabel(language: LanguageCode): string {
  return ALL_LABEL[language] ?? 'All';
}
