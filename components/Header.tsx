'use client';

import { LanguageTabs } from './LanguageTabs';
import { ThemeToggle } from './ThemeToggle';
import { RefreshIcon, SlidersIcon } from './icons';
import type { LanguageCode } from '@/lib/types';
import type { ThemeMode } from '@/hooks/usePreferences';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  onOpenSources: () => void;
  onRefresh: () => void;
  loading: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Header({
  language,
  onLanguageChange,
  onOpenSources,
  onRefresh,
  loading,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-ink">Daily News</h1>
            <span className="hidden text-sm text-ink-faint sm:inline">
              your world, one language at a time
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              aria-label="Refresh"
              title="Refresh"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-muted transition hover:bg-paper-subtle hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <RefreshIcon className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              type="button"
              onClick={onOpenSources}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-medium text-ink-muted transition hover:bg-paper-subtle hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <SlidersIcon width={16} height={16} />
              <span className="hidden sm:inline">Sources</span>
            </button>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>

        <LanguageTabs active={language} onChange={onLanguageChange} />
      </div>
    </header>
  );
}
