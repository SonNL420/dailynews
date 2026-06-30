import { formatDistanceToNowStrict, format } from 'date-fns';
import { cs, nl, fr, enUS, de, es, it, pt, vi } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import type { LanguageCode } from './types';

const LOCALES: Record<LanguageCode, Locale> = {
  cs, nl, fr, en: enUS, de, es, it, pt, vi,
};

/**
 * Localized "2 h ago" style relative timestamp. Falls back gracefully if the
 * date can't be parsed.
 */
export function relativeTime(iso: string, language: LanguageCode): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return formatDistanceToNowStrict(date, {
      addSuffix: true,
      locale: LOCALES[language] ?? enUS,
    });
  } catch {
    return '';
  }
}

/** Absolute timestamp for tooltips / accessibility. */
export function absoluteTime(iso: string, language: LanguageCode): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return format(date, 'PPpp', { locale: LOCALES[language] ?? enUS });
  } catch {
    return '';
  }
}
