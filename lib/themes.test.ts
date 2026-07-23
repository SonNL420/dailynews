import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME,
  THEMES,
  is1999Era,
  isPhoneEra,
  isThemeId,
  normalizeLegacyTheme,
} from './themes';

describe('themes', () => {
  it('uses a normal-looking theme by default', () => {
    expect(DEFAULT_THEME).toBe('clean');
  });

  it('keeps ids unique and recognizes every configured theme', () => {
    const ids = THEMES.map((theme) => theme.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every(isThemeId)).toBe(true);
  });

  it('keeps legacy preferences and era helpers compatible', () => {
    expect(normalizeLegacyTheme('light')).toBe('geocities');
    expect(normalizeLegacyTheme('dark')).toBe('bbs');
    expect(normalizeLegacyTheme('midnight')).toBe('midnight');
    expect(normalizeLegacyTheme('unknown')).toBe(DEFAULT_THEME);
    expect(is1999Era('geocities')).toBe(true);
    expect(is1999Era('clean')).toBe(false);
    expect(isPhoneEra('iphone')).toBe(true);
    expect(isPhoneEra('editorial')).toBe(false);
  });
});
