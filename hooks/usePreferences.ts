'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Category, CountryCode, LanguageCode, Source } from '@/lib/types';
import { DEFAULT_LANGUAGE, isLanguageCode } from '@/lib/languages';
import { DEFAULT_THEME, normalizeLegacyTheme, type ThemeId } from '@/lib/themes';

export type { ThemeId } from '@/lib/themes';

export interface Preferences {
  language: LanguageCode;
  category: Category | 'all';
  /** Built-in/custom source ids the user has switched OFF (default: all on). */
  disabledSourceIds: string[];
  /**
   * Countries switched OFF for the front page, keyed as `${language}:${country}`
   * (default: all on). Scoped per-language so turning off e.g. Belgium while
   * reading French doesn't also hide it while reading Dutch.
   */
  disabledCountries: string[];
  customSources: Source[];
  theme: ThemeId;
}

const STORAGE_KEY = 'dailynews:prefs:v1';

const DEFAULT_PREFS: Preferences = {
  language: DEFAULT_LANGUAGE,
  category: 'all',
  disabledSourceIds: [],
  disabledCountries: [],
  customSources: [],
  theme: DEFAULT_THEME,
};

function countryKey(language: LanguageCode, country: CountryCode): string {
  return `${language}:${country}`;
}

function loadPrefs(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const prefersDark =
        window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      return { ...DEFAULT_PREFS, theme: prefersDark ? 'bbs' : 'geocities' };
    }
    const parsed = JSON.parse(raw) as Partial<Preferences> & { theme?: string };
    return {
      ...DEFAULT_PREFS,
      ...parsed,
      language:
        parsed.language && isLanguageCode(parsed.language)
          ? parsed.language
          : DEFAULT_PREFS.language,
      theme: parsed.theme ? normalizeLegacyTheme(parsed.theme) : DEFAULT_PREFS.theme,
      disabledSourceIds: Array.isArray(parsed.disabledSourceIds)
        ? parsed.disabledSourceIds
        : [],
      disabledCountries: Array.isArray(parsed.disabledCountries)
        ? parsed.disabledCountries
        : [],
      customSources: Array.isArray(parsed.customSources) ? parsed.customSources : [],
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount to stay SSR-safe.
  useEffect(() => {
    setPrefs(loadPrefs());
    setHydrated(true);
  }, []);

  // Persist on every change (once hydrated).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* storage might be unavailable (private mode); ignore */
    }
  }, [prefs, hydrated]);

  // Reflect the active theme on <html> so globals.css can key off [data-theme].
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = prefs.theme;
  }, [prefs.theme, hydrated]);

  const setLanguage = useCallback((language: LanguageCode) => {
    setPrefs((p) => ({ ...p, language }));
  }, []);

  const setCategory = useCallback((category: Category | 'all') => {
    setPrefs((p) => ({ ...p, category }));
  }, []);

  const setTheme = useCallback((theme: ThemeId) => {
    setPrefs((p) => ({ ...p, theme }));
  }, []);

  const isSourceEnabled = useCallback(
    (id: string) => !prefs.disabledSourceIds.includes(id),
    [prefs.disabledSourceIds],
  );

  const toggleSource = useCallback((id: string) => {
    setPrefs((p) => {
      const disabled = new Set(p.disabledSourceIds);
      if (disabled.has(id)) disabled.delete(id);
      else disabled.add(id);
      return { ...p, disabledSourceIds: Array.from(disabled) };
    });
  }, []);

  const setSourcesEnabled = useCallback((ids: string[], enabled: boolean) => {
    setPrefs((p) => {
      const disabled = new Set(p.disabledSourceIds);
      for (const id of ids) {
        if (enabled) disabled.delete(id);
        else disabled.add(id);
      }
      return { ...p, disabledSourceIds: Array.from(disabled) };
    });
  }, []);

  const isCountryEnabled = useCallback(
    (language: LanguageCode, country: CountryCode) =>
      !prefs.disabledCountries.includes(countryKey(language, country)),
    [prefs.disabledCountries],
  );

  const toggleCountry = useCallback((language: LanguageCode, country: CountryCode) => {
    setPrefs((p) => {
      const key = countryKey(language, country);
      const disabled = new Set(p.disabledCountries);
      if (disabled.has(key)) disabled.delete(key);
      else disabled.add(key);
      return { ...p, disabledCountries: Array.from(disabled) };
    });
  }, []);

  const setCountriesEnabled = useCallback(
    (language: LanguageCode, countries: CountryCode[], enabled: boolean) => {
      setPrefs((p) => {
        const disabled = new Set(p.disabledCountries);
        for (const country of countries) {
          const key = countryKey(language, country);
          if (enabled) disabled.delete(key);
          else disabled.add(key);
        }
        return { ...p, disabledCountries: Array.from(disabled) };
      });
    },
    [],
  );

  const addCustomSource = useCallback((source: Source) => {
    setPrefs((p) => {
      if (p.customSources.some((s) => s.id === source.id)) return p;
      return { ...p, customSources: [...p.customSources, source] };
    });
  }, []);

  const removeCustomSource = useCallback((id: string) => {
    setPrefs((p) => ({
      ...p,
      customSources: p.customSources.filter((s) => s.id !== id),
      disabledSourceIds: p.disabledSourceIds.filter((d) => d !== id),
    }));
  }, []);

  return {
    prefs,
    hydrated,
    setLanguage,
    setCategory,
    setTheme,
    isSourceEnabled,
    toggleSource,
    setSourcesEnabled,
    isCountryEnabled,
    toggleCountry,
    setCountriesEnabled,
    addCustomSource,
    removeCustomSource,
  };
}
