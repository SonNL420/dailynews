'use client';

import { LANGUAGES } from '@/lib/languages';
import type { LanguageCode } from '@/lib/types';

interface LanguageTabsProps {
  active: LanguageCode;
  onChange: (language: LanguageCode) => void;
}

/**
 * The primary axis of the app: exactly one language is active, and only that
 * language's articles are ever shown.
 */
export function LanguageTabs({ active, onChange }: LanguageTabsProps) {
  return (
    <nav aria-label="Language" className="-mx-1 overflow-x-auto">
      <ul className="flex min-w-max items-center gap-1 px-1">
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === active;
          return (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => onChange(lang.code)}
                aria-current={isActive ? 'true' : undefined}
                title={lang.englishLabel}
                className={[
                  'win98-btn whitespace-nowrap px-3 py-1.5 text-sm font-bold',
                  isActive ? 'pressed bg-yellow-200 dark:bg-black' : '',
                ].join(' ')}
              >
                <span className="mr-1.5" aria-hidden>
                  {lang.flag}
                </span>
                {lang.nativeLabel}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
