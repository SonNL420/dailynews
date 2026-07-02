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
import { Marquee } from '@/components/Marquee';
import { HitCounter } from '@/components/HitCounter';
import { RetroJokeModal } from '@/components/RetroJokeModal';
import { is1999Era } from '@/lib/themes';

const JOKE_MESSAGES = [
  'There is no WebRing. It’s 2026. But wasn’t it fun to pretend? 💾',
  'Guestbook coming soon! (Please check back after you upgrade to 56k.) ✍️',
  'Random button clicked! ...and landed right back here. What are the odds? 🎲',
  'You’ve reached the end of the internet. Please turn around. 🛑',
];

export default function Home() {
  const {
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
  } = usePreferences();
  const language = prefs.language;
  const retro = is1999Era(prefs.theme);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [jokeMessage, setJokeMessage] = useState<string | null>(null);
  const showRandomJoke = () =>
    setJokeMessage(JOKE_MESSAGES[Math.floor(Math.random() * JOKE_MESSAGES.length)]);

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
        onSelectTheme={setTheme}
      />

      {retro && (
        <>
          <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
            <Marquee text="★彡 WELCOME TO DAILY NEWS — YOUR #1 SOURCE FOR WORLD NEWS — NOW WITH 9 LANGUAGES!!! 彡★ ・ BEST VIEWED AT 800×600 RESOLUTION ・ NO FRAMES REQUIRED ・ SIGN MY GUESTBOOK BELOW ・" />
          </div>

          <div className="construction-stripes mx-auto mt-3 flex h-6 max-w-6xl items-center justify-center sm:mx-auto">
            <span className="blink bg-black px-2 font-serif text-xs font-bold text-yellow-300">
              🚧 SITE PERPETUALLY UNDER CONSTRUCTION 🚧
            </span>
          </div>
        </>
      )}

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        <div className="space-y-3 border-b-4 border-line pb-4">
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

      <footer className="mx-auto max-w-6xl space-y-5 px-4 py-10 text-center sm:px-6">
        <hr className={retro ? 'rainbow-rule' : 'border-t border-line'} />

        {retro && (
          <>
            <HitCounter />

            <div className="flex flex-wrap items-center justify-center gap-2">
              {['NO FRAMES', 'BEST AT 800×600', '56K OR BUST', 'Y2K COMPLIANT', 'HTML 3.2'].map((badge) => (
                <span key={badge} className="theme-btn px-2 py-1 text-[10px] font-bold">
                  {badge}
                </span>
              ))}
            </div>

            <p className="text-sm font-bold text-ink-muted">
              <button type="button" onClick={showRandomJoke} className="underline hover:text-accent">
                ⟨⟨ Previous
              </button>
              {' | This site is a member of the Daily News WebRing | '}
              <button type="button" onClick={showRandomJoke} className="underline hover:text-accent">
                Random
              </button>
              {' | '}
              <button type="button" onClick={showRandomJoke} className="underline hover:text-accent">
                Next ⟩⟩
              </button>
            </p>

            <button
              type="button"
              onClick={showRandomJoke}
              className="theme-btn inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold"
            >
              📝 Sign my Guestbook!
            </button>
          </>
        )}

        <p className="text-xs text-ink-faint">
          Daily News aggregates public RSS feeds. Headlines link to the original
          outlet. Your sources and preferences are stored only in this browser.
          {retro && (
            <>
              <br />
              Last updated: {new Date().toLocaleDateString()} · Made with 💾 and Comic Sans
            </>
          )}
        </p>
      </footer>

      <RetroJokeModal message={jokeMessage} onClose={() => setJokeMessage(null)} />

      <SourceManager
        open={sourcesOpen}
        onClose={() => setSourcesOpen(false)}
        language={language}
        theme={prefs.theme}
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
