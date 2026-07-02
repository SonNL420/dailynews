'use client';

import { LanguageTabs } from './LanguageTabs';
import { ThemeToggle } from './ThemeToggle';
import { TrafficLights } from './TrafficLights';
import { StatusBar } from './StatusBar';
import { RefreshIcon, SlidersIcon } from './icons';
import type { LanguageCode } from '@/lib/types';
import { is1999Era, isPhoneEra, type ThemeId } from '@/lib/themes';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  onOpenSources: () => void;
  onRefresh: () => void;
  loading: boolean;
  theme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export function Header({
  language,
  onLanguageChange,
  onOpenSources,
  onRefresh,
  loading,
  theme,
  onSelectTheme,
}: HeaderProps) {
  const retro = is1999Era(theme);

  return (
    <header className={['sticky top-0 z-30', retro ? 'bg-paper' : 'title-bar'].join(' ')}>
      {isPhoneEra(theme) && <StatusBar theme={theme} />}
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {theme === 'aqua' && <TrafficLights />}
            <h1
              className={[
                'font-serif text-2xl font-bold tracking-tight sm:text-3xl',
                retro ? 'rainbow-text' : 'text-[rgb(var(--titlebar-fg))]',
              ].join(' ')}
            >
              Daily News
            </h1>
            {retro && (
              <span className="hidden text-sm text-ink-faint sm:inline">
                *~* your world, one language at a time *~*
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh"
              title="Refresh"
              className="theme-btn inline-flex h-9 w-9 items-center justify-center"
            >
              <RefreshIcon className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={onOpenSources}
              className="theme-btn inline-flex h-9 items-center gap-1.5 px-3 text-sm font-bold"
            >
              <SlidersIcon width={16} height={16} />
              <span className="hidden sm:inline">Sources</span>
            </button>
            <ThemeToggle theme={theme} onSelect={onSelectTheme} />
          </div>
        </div>

        <LanguageTabs active={language} onChange={onLanguageChange} />
      </div>
      {retro && <hr className="rainbow-rule" />}
    </header>
  );
}
