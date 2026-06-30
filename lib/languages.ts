import type { LanguageCode } from './types';

export interface LanguageInfo {
  code: LanguageCode;
  /** Native name of the language (shown in the language tabs). */
  nativeLabel: string;
  /** English name (for tooltips / accessibility). */
  englishLabel: string;
  /**
   * A representative flag emoji. Purely decorative — language is not the same
   * as country, so this is only a visual hint, never used for filtering.
   */
  flag: string;
}

/**
 * Tab order intentionally leads with the languages the app was built for
 * (Czech, Dutch, French), then the other major world languages.
 */
export const LANGUAGES: LanguageInfo[] = [
  { code: 'cs', nativeLabel: 'Čeština', englishLabel: 'Czech', flag: '🇨🇿' },
  { code: 'nl', nativeLabel: 'Nederlands', englishLabel: 'Dutch', flag: '🇳🇱' },
  { code: 'fr', nativeLabel: 'Français', englishLabel: 'French', flag: '🇫🇷' },
  { code: 'en', nativeLabel: 'English', englishLabel: 'English', flag: '🇬🇧' },
  { code: 'de', nativeLabel: 'Deutsch', englishLabel: 'German', flag: '🇩🇪' },
  { code: 'es', nativeLabel: 'Español', englishLabel: 'Spanish', flag: '🇪🇸' },
  { code: 'it', nativeLabel: 'Italiano', englishLabel: 'Italian', flag: '🇮🇹' },
  { code: 'pt', nativeLabel: 'Português', englishLabel: 'Portuguese', flag: '🇵🇹' },
  { code: 'vi', nativeLabel: 'Tiếng Việt', englishLabel: 'Vietnamese', flag: '🇻🇳' },
];

export const LANGUAGE_MAP: Record<LanguageCode, LanguageInfo> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l]),
) as Record<LanguageCode, LanguageInfo>;

export const DEFAULT_LANGUAGE: LanguageCode = 'cs';

export function getLanguageInfo(code: LanguageCode): LanguageInfo {
  return LANGUAGE_MAP[code] ?? LANGUAGES[0];
}

export function isLanguageCode(value: string): value is LanguageCode {
  return value in LANGUAGE_MAP;
}
