'use client';

import { countryName, flagEmoji } from '@/lib/countries';
import { allLabel } from '@/lib/categories';
import type { CountryCode, LanguageCode } from '@/lib/types';

interface CountryFilterProps {
  language: LanguageCode;
  countries: CountryCode[];
  active: CountryCode | 'all';
  onChange: (country: CountryCode | 'all') => void;
}

/**
 * Narrows within the active language by country. Only rendered when the active
 * language spans more than one country (e.g. fr → FR/BE/CH/CA).
 */
export function CountryFilter({ language, countries, active, onChange }: CountryFilterProps) {
  if (countries.length < 2) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Country">
      <Chip label={allLabel(language)} isActive={active === 'all'} onClick={() => onChange('all')} />
      {countries.map((country) => (
        <Chip
          key={country}
          label={countryName(country)}
          flag={flagEmoji(country)}
          isActive={active === country}
          onClick={() => onChange(country)}
        />
      ))}
    </div>
  );
}

function Chip({
  label,
  flag,
  isActive,
  onClick,
}: {
  label: string;
  flag?: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
        isActive
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-line text-ink-muted hover:border-ink-faint hover:text-ink',
      ].join(' ')}
    >
      {flag && <span aria-hidden>{flag}</span>}
      {label}
    </button>
  );
}
