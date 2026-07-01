'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePreferences } from '@/hooks/usePreferences';
import { useArticles } from '@/hooks/useArticles';
import { sourcesForLanguage } from '@/lib/sources';
import type { Category, CountryCode } from '@/lib/types';
import { Header } from '@/components/Header';
import { CategoryTabs } from '@/components/CategoryTabs';
import { CountryFilter } from '@/components/CountryFilter';
import { ArticleGrid, SourceErrorBanner } from '@/components/ArticleGrid';
import { SourceManager } from '@/components/SourceManager';

export default function Home() {
  const {
    prefs,
    hydrated,
    setLanguage,
    setCategory,
    toggleTheme,
    isSourceEnabled,
    toggleSource,
    setSourcesEnabled,
    isCountryEnabled,
    toggleCountry,
    setCountriesEnabled,
    addCustomSource,
    removeCustomSource,
  } = usePreferences();
  const language = prefs.language;
  const [sourcesOpen, setSourcesOpen] = useState(false);

  // Sources available for the active language (built-in + the user's own).
  const builtinSources = useMemo(() => sourcesForLanguage(language), [language]);
  const customForLang = useMemo(
    () => prefs.customSources.filter((s) => s.language === language),
    [prefs.customSources, language],
  );
  const langSources = useMemo(
    () => [...builtinSources, ...customForLang],
    [builtinSources, customForLang],
  );

  // A source counts toward the front page only if it's individually enabled
  // AND its country hasn't been switched off.
  const enabledIds = useMemo(
    () =>
      langSources
        .filter((s) => isSourceEnabled(s.id) && isCountryEnabled(language, s.country))
        .map((s) => s.id),
    [langSources, isSourceEnabled, isCountryEnabled, language],
  );

  const { articles, errors, loading, error, lastUpdated, refresh } = useArticles({
    language,
    sourceIds: enabledIds,
    customSources: prefs.customSources,
    enabled: hydrated,
  });

  // All countries the active language spans (regardless of enabled state), so
  // a country the user turned off stays visible in the picker to turn back on.
  const allCountries = useMemo(() => {
    const set = new Set<CountryCode>();
    for (const s of langSources) set.add(s.country);
    return Array.from(set).sort();
  }, [langSources]);

  const availableCategories = useMemo(() => {
    const set = new Set<Category>();
    for (const s of langSources) {
      if (isSourceEnabled(s.id) && isCountryEnabled(language, s.country)) set.add(s.category);
    }
    return Array.from(set);
  }, [langSources, isSourceEnabled, isCountryEnabled, language]);

  // If a filter no longer applies after switching language, fall back to "all".
  useEffect(() => {
    if (!hydrated) return;
    if (prefs.category !== 'all' && !availableCategories.includes(prefs.category)) {
      setCategory('all');
    }
  }, [availableCategories, prefs.category, hydrated, setCategory]);

  const filtered = useMemo(
    () =>
      articles.filter((a) => {
        if (a.language !== language) return false; // one language at a time
        if (prefs.category !== 'all' && a.category !== prefs.category) return false;
        return true;
      }),
    [articles, language, prefs.category],
  );

  return (
    <div className="min-h-screen">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onOpenSources={() => setSourcesOpen(true)}
        onRefresh={refresh}
        loading={loading}
        theme={prefs.theme}
        onToggleTheme={toggleTheme}
      />

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <div className="space-y-3 border-b border-line pb-4">
          <CategoryTabs
            language={language}
            active={prefs.category}
            available={availableCategories}
            onChange={setCategory}
          />
          <CountryFilter
            language={language}
            countries={allCountries}
            isEnabled={(country) => isCountryEnabled(language, country)}
            onToggle={(country) => toggleCountry(language, country)}
            onSetAll={(enabled) => setCountriesEnabled(language, allCountries, enabled)}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-ink-faint">
          <span>
            {filtered.length > 0
              ? `${filtered.length} ${filtered.length === 1 ? 'story' : 'stories'}`
              : ''}
          </span>
          {lastUpdated && (
            <span>Updated {new Date(lastUpdated).toLocaleTimeString()}</span>
          )}
        </div>

        <SourceErrorBanner errors={errors} />

        <ArticleGrid
          articles={filtered}
          language={language}
          loading={!hydrated || loading}
          error={error}
          emptyHint={
            enabledIds.length === 0
              ? 'Nothing selected for this language — turn a country back on above, or open Sources to enable outlets or add your own RSS feed.'
              : 'Try another category, select more countries above, or add more sources.'
          }
        />
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-center text-xs text-ink-faint sm:px-6">
        Daily News aggregates public RSS feeds. Headlines link to the original
        outlet. Your sources and preferences are stored only in this browser.
      </footer>

      <SourceManager
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        language={language}
        builtinSources={builtinSources}
        customSources={prefs.customSources}
        isSourceEnabled={isSourceEnabled}
        toggleSource={toggleSource}
        setSourcesEnabled={setSourcesEnabled}
        addCustomSource={addCustomSource}
        removeCustomSource={removeCustomSource}
      />
    </div>
  );
}
