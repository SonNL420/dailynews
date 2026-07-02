'use client';

import type { ThemeMode } from '@/hooks/usePreferences';

export function ThemeToggle({ theme, onToggle }: { theme: ThemeMode; onToggle: () => void }) {
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to GeoCities mode' : 'Switch to BBS mode'}
      title={isDark ? 'GeoCities mode' : 'BBS mode'}
      className="win98-btn inline-flex h-9 items-center gap-1 px-2 text-xs font-bold"
    >
      {isDark ? <>🌈 <span className="hidden sm:inline">GEOCITIES</span></> : <>👾 <span className="hidden sm:inline">BBS MODE</span></>}
    </button>
  );
}
