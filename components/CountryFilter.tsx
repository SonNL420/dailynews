'use client';

import { countryName, flagEmoji } from '@/lib/countries';
import type { CountryCode, LanguageCode } from '@/lib/types';

interface CountryFilterProps {
  language: LanguageCode;
  /** All countries available for the active language (regardless of enabled state). */
  countries: CountryCode[];
  isEnabled: (country: CountryCode) => boolean;
  onToggle: (country: CountryCode) => void;
  onSetAll: (enabled: boolean) => void;
}

/**
 * Lets the user pick which countries show up on the front page for the active
 * language (e.g. fr → FR/BE/CH/CA). Multi-select: any combination can be on,
 * defaulting to all. Only rendered when the language spans more than one country.
 */
export function CountryFilter({
  language,
  countries,
  isEnabled,
  onToggle,
  onSetAll,
}: CountryFilterProps) {
  if (countries.length < 2) return null;

  const allOn = countries.every((c) => isEnabled(c));

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Countries">
      {countries.map((country) => (
        <Chip
          key={country}
          label={countryName(country)}
          flag={flagEmoji(country)}
          isActive={isEnabled(country)}
          onClick={() => onToggle(country)}
        />
      ))}
      <button
        type="button"
        onClick={() => onSetAll(!allOn)}
        className="ml-1 whitespace-nowrap text-xs font-medium text-ink-faint underline decoration-dotted underline-offset-2 hover:text-ink"
      >
        {allOn ? 'Deselect all' : 'Select all'}
      </button>
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
      title={isActive ? `Hide ${label}` : `Show ${label}`}
      className={[
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
        isActive
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-line text-ink-faint line-through decoration-1 hover:border-ink-faint hover:text-ink-muted',
      ].join(' ')}
    >
      {flag && (
        <span aria-hidden className={isActive ? '' : 'opacity-40 grayscale'}>
          {flag}
        </span>
      )}
      {label}
    </button>
  );
}
