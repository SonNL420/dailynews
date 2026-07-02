'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Category, CountryCode, LanguageCode, Source } from '@/lib/types';
import { LANGUAGES, getLanguageInfo } from '@/lib/languages';
import { CATEGORY_ORDER, categoryLabel } from '@/lib/categories';
import { countryName, flagEmoji } from '@/lib/countries';
import { CloseIcon, PlusIcon, TrashIcon } from './icons';
import { TrafficLights } from './TrafficLights';
import type { ThemeId } from '@/lib/themes';

interface SourceManagerProps {
  open: boolean;
  onClose: () => void;
  language: LanguageCode;
  theme: ThemeId;
  builtinSources: Source[];
  customSources: Source[];
  isSourceEnabled: (id: string) => boolean;
  toggleSource: (id: string) => void;
  setSourcesEnabled: (ids: string[], enabled: boolean) => void;
  addCustomSource: (source: Source) => void;
  removeCustomSource: (id: string) => void;
}

const DEFAULT_COUNTRY: Record<LanguageCode, CountryCode> = {
  cs: 'CZ', nl: 'NL', fr: 'FR', en: 'GB', de: 'DE', es: 'ES', it: 'IT', pt: 'PT', vi: 'VN',
};

function hashString(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h) ^ input.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export function SourceManager(props: SourceManagerProps) {
  const { open, onClose, language, theme } = props;

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const langInfo = getLanguageInfo(language);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Manage sources">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="theme-panel relative flex h-full w-full max-w-md flex-col !border-l-4">
        <header className="title-bar flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-2">
            {theme === 'aqua' && <TrafficLights />}
            <div>
              <h2 className="font-serif text-base font-bold text-[rgb(var(--titlebar-fg))]">
                📁 Manage Sources
              </h2>
              <p className="text-xs text-[rgb(var(--titlebar-fg))] opacity-80">
                {langInfo.flag} {langInfo.nativeLabel} · {langInfo.englishLabel}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="theme-btn inline-flex h-6 w-6 items-center justify-center text-xs font-bold"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <AddCustomSourceForm {...props} />
          <CustomSourceList {...props} />
          <BuiltinSourceList {...props} />
        </div>
      </div>
    </div>
  );
}

function AddCustomSourceForm({
  language,
  addCustomSource,
}: SourceManagerProps) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [lang, setLang] = useState<LanguageCode>(language);
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY[language]);
  const [category, setCategory] = useState<Category>('top');
  const [error, setError] = useState<string | null>(null);

  // Keep the form's language aligned with the active language when it changes.
  useEffect(() => {
    setLang(language);
    setCountry(DEFAULT_COUNTRY[language]);
  }, [language]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
      if (!/^https?:$/.test(parsed.protocol)) throw new Error();
    } catch {
      setError('Enter a valid http(s) feed URL.');
      return;
    }
    const cc = country.trim().toUpperCase();
    if (cc && !/^[A-Z]{2}$/.test(cc)) {
      setError('Country must be a 2-letter code (e.g. FR).');
      return;
    }
    const source: Source = {
      id: `custom:${hashString(parsed.href)}`,
      name: name.trim() || parsed.hostname.replace(/^www\./, ''),
      url: parsed.href,
      language: lang,
      country: cc || 'XX',
      category,
      custom: true,
    };
    addCustomSource(source);
    setUrl('');
    setName('');
  }

  return (
    <form onSubmit={submit} className="theme-panel p-4">
      <h3 className="mb-3 font-serif text-sm font-bold text-accent">✏️ Add a custom RSS feed</h3>
      <div className="space-y-2.5">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/rss.xml"
          className="w-full border-2 border-line bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name (optional)"
          className="w-full border-2 border-line bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint"
        />
        <div className="grid grid-cols-3 gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as LanguageCode)}
            aria-label="Language"
            className="border-2 border-line bg-paper px-2 py-2 text-sm text-ink outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeLabel}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="CC"
            maxLength={2}
            aria-label="Country code"
            className="border-2 border-line bg-paper px-2 py-2 text-sm uppercase text-ink outline-none placeholder:text-ink-faint"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            aria-label="Category"
            className="border-2 border-line bg-paper px-2 py-2 text-sm text-ink outline-none"
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c, language)}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-xs font-bold text-accent">{error}</p>}
        <button type="submit" className="theme-btn inline-flex w-full items-center justify-center gap-1.5 px-3 py-2 text-sm font-bold">
          <PlusIcon width={16} height={16} />
          Add feed
        </button>
      </div>
    </form>
  );
}

function CustomSourceList({
  language,
  customSources,
  isSourceEnabled,
  toggleSource,
  removeCustomSource,
}: SourceManagerProps) {
  const mine = customSources.filter((s) => s.language === language);
  if (mine.length === 0) return null;

  return (
    <section className="mt-6">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-faint">
        ★ Your Feeds ★
      </h3>
      <ul className="space-y-1">
        {mine.map((source) => (
          <li
            key={source.id}
            className="flex items-center justify-between gap-2 border-2 border-line px-2 py-1.5"
          >
            <SourceToggle
              source={source}
              language={language}
              enabled={isSourceEnabled(source.id)}
              onToggle={() => toggleSource(source.id)}
            />
            <button
              type="button"
              onClick={() => removeCustomSource(source.id)}
              aria-label={`Remove ${source.name}`}
              className="text-ink-faint transition hover:text-accent"
            >
              <TrashIcon width={16} height={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BuiltinSourceList({
  language,
  builtinSources,
  isSourceEnabled,
  toggleSource,
  setSourcesEnabled,
}: SourceManagerProps) {
  // Group by country for readability.
  const groups = useMemo(() => {
    const map = new Map<CountryCode, Source[]>();
    for (const s of builtinSources) {
      const list = map.get(s.country) ?? [];
      list.push(s);
      map.set(s.country, list);
    }
    return Array.from(map.entries());
  }, [builtinSources]);

  const allIds = builtinSources.map((s) => s.id);

  return (
    <section className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wide text-ink-faint">★ Outlets ★</h3>
        <div className="flex gap-3 text-xs font-bold underline">
          <button type="button" className="text-ink-muted hover:text-accent" onClick={() => setSourcesEnabled(allIds, true)}>
            [ Enable all ]
          </button>
          <button type="button" className="text-ink-muted hover:text-accent" onClick={() => setSourcesEnabled(allIds, false)}>
            [ Disable all ]
          </button>
        </div>
      </div>

      {groups.map(([country, sources]) => (
        <div key={country} className="mb-4">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-ink">
            <span aria-hidden>{flagEmoji(country)}</span>
            {countryName(country)}
          </p>
          <ul className="space-y-1">
            {sources.map((source) => (
              <li key={source.id} className="border-2 border-transparent px-2 py-1.5 hover:border-line">
                <SourceToggle
                  source={source}
                  language={language}
                  enabled={isSourceEnabled(source.id)}
                  onToggle={() => toggleSource(source.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function SourceToggle({
  source,
  language,
  enabled,
  onToggle,
}: {
  source: Source;
  language: LanguageCode;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex flex-1 cursor-pointer items-center justify-between gap-3">
      <span className="min-w-0">
        <span className="block truncate text-sm text-ink">{enabled ? source.name : <s>{source.name}</s>}</span>
        <span className="block text-xs text-ink-faint">{categoryLabel(source.category, language)}</span>
      </span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={onToggle}
        className="h-5 w-5 flex-shrink-0 accent-accent"
      />
    </label>
  );
}
