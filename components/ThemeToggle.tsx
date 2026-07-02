'use client';

import { useEffect, useRef, useState } from 'react';
import { THEMES, type ThemeId } from '@/lib/themes';

export function ThemeToggle({
  theme,
  onSelect,
}: {
  theme: ThemeId;
  onSelect: (id: ThemeId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="Switch design"
        className="theme-btn inline-flex h-9 items-center gap-1 px-2 text-xs font-bold"
      >
        <span aria-hidden>{current.emoji}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="theme-panel absolute right-0 top-full z-40 mt-1 w-48 py-1 text-sm"
        >
          {THEMES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                role="option"
                aria-selected={t.id === theme}
                onClick={() => {
                  onSelect(t.id);
                  setOpen(false);
                }}
                className={[
                  'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-accent-soft',
                  t.id === theme ? 'font-bold text-accent' : 'text-ink',
                ].join(' ')}
              >
                <span>
                  <span aria-hidden className="mr-1.5">{t.emoji}</span>
                  {t.label}
                </span>
                <span className="text-xs text-ink-faint">{t.era}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
