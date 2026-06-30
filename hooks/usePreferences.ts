'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Category, CountryCode, LanguageCode, Source } from '@/lib/types';
import { DEFAULT_LANGUAGE, isLanguageCode } from '@/lib/languages';

export type ThemeMode = 'light' | 'dark';

export interface Preferences {
  language: LanguageCode;
  country: CountryCode | 'all';
  category: Category | 'all';
  /** Built-in/custom source ids the user has switched OFF (default: all on). */
  disabledSourceIds: string[];
  customSources: Source[];
  theme: ThemeMode;
}

const STORAGE_KEY = 'dailynews:prefs:v1';

const DEFAULT_PREFS: Preferences = {
  language: DEFAULT_LANGUAGE,
  country: 'all',
  category: 'all',
  disabledSourceIds: [],
  customSources: [],
  theme: 'light',
};

function loadPrefs(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const prefersDark =
        window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      return { ...DEFAULT_PREFS, theme: prefersDark ? 'dark' : 'light' };
    }
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      ...DEFAULT_PREFS,
      ...parsed,
      language:
        parsed.language && isLanguageCode(parsed.language)
          ? parsed.language
          : DEFAULT_PREFS.language,
      disabledSourceIds: Array.isArray(parsed.disabledSourceIds)
        ? parsed.disabledSourceIds
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

  // Reflect theme on <html> for Tailwind's `dark:` variants.
  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle('dark', prefs.theme === 'dark');
  }, [prefs.theme, hydrated]);

  const setLanguage = useCallback((language: LanguageCode) => {
    // Country options are language-specific, so reset the country filter.
    setPrefs((p) => ({ ...p, language, country: 'all' }));
  }, []);

  const setCountry = useCallback((country: CountryCode | 'all') => {
    setPrefs((p) => ({ ...p, country }));
  }, []);

  const setCategory = useCallback((category: Category | 'all') => {
    setPrefs((p) => ({ ...p, category }));
  }, []);

  const toggleTheme = useCallback(() => {
    setPrefs((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }));
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
    setCountry,
    setCategory,
    toggleTheme,
    isSourceEnabled,
    toggleSource,
    setSourcesEnabled,
    addCustomSource,
    removeCustomSource,
  };
}
