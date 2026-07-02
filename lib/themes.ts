export type ThemeId = 'geocities' | 'bbs' | 'aqua' | 'symbian' | 'iphone' | 'android';

export interface ThemeInfo {
  id: ThemeId;
  label: string;
  emoji: string;
  era: string;
}

export const THEMES: ThemeInfo[] = [
  { id: 'geocities', label: 'GeoCities', emoji: '🌈', era: '1999 homepage' },
  { id: 'bbs', label: 'BBS', emoji: '👾', era: '1999 terminal' },
  { id: 'aqua', label: 'Mac OS X', emoji: '🍎', era: '2002 Aqua' },
  { id: 'symbian', label: 'Symbian', emoji: '📱', era: '2005 Nokia S60' },
  { id: 'iphone', label: 'iPhone', emoji: '📲', era: '2008 iPhone OS' },
  { id: 'android', label: 'Android', emoji: '🤖', era: '2010 Eclair' },
];

export const DEFAULT_THEME: ThemeId = 'geocities';

export function isThemeId(value: string): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

/** The two original "1999 homepage" themes get the marquee/guestbook/webring joke chrome. */
export function is1999Era(theme: ThemeId): boolean {
  return theme === 'geocities' || theme === 'bbs';
}

/** Phone-era themes get a fake device status bar (signal/battery/clock). */
export function isPhoneEra(theme: ThemeId): boolean {
  return theme === 'symbian' || theme === 'iphone' || theme === 'android';
}

/** Legacy localStorage values from before the multi-theme picker existed. */
export function normalizeLegacyTheme(value: string): ThemeId {
  if (value === 'light') return 'geocities';
  if (value === 'dark') return 'bbs';
  return isThemeId(value) ? value : DEFAULT_THEME;
}
