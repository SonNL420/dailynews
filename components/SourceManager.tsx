'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Category, CountryCode, LanguageCode, Source } from '@/lib/types';
import { LANGUAGES, getLanguageInfo } from '@/lib/languages';
import { CATEGORY_ORDER, categoryLabel } from '@/lib/categories';
import { countryName, flagEmoji } from '@/lib/countries';
import { CloseIcon, PlusIcon, TrashIcon } from './icons';

interface SourceManagerProps {
  open: boolean;
  onClose: () => void;
  language: LanguageCode;
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
  const { open, onClose, language } = props;

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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-paper shadow-2xl">
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-ink">Manage sources</h2>
            <p className="text-xs text-ink-muted">
              {langInfo.flag} {langInfo.nativeLabel} · {langInfo.englishLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-paper-subtle hover:text-ink"
          >
            <CloseIcon />
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
    <form onSubmit={submit} className="rounded-xl border border-line bg-paper-subtle/60 p-4">
      <h3 className="mb-3 text-sm font-semibold text-ink">Add a custom RSS feed</h3>
      <div className="space-y-2.5">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/rss.xml"
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-accent"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name (optional)"
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-accent"
        />
        <div className="grid grid-cols-3 gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as LanguageCode)}
            aria-label="Language"
            className="rounded-lg border border-line bg-paper px-2 py-2 text-sm text-ink outline-none focus:border-accent"
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
            className="rounded-lg border border-line bg-paper px-2 py-2 text-sm uppercase text-ink outline-none placeholder:text-ink-faint focus:border-accent"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            aria-label="Category"
            className="rounded-lg border border-line bg-paper px-2 py-2 text-sm text-ink outline-none focus:border-accent"
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(c, language)}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-xs text-accent">{error}</p>}
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-ink px-3 py-2 text-sm font-medium text-paper transition hover:opacity-90"
        >
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
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        Your feeds
      </h3>
      <ul className="space-y-1">
        {mine.map((source) => (
          <li
            key={source.id}
            className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 hover:bg-paper-subtle"
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Outlets</h3>
        <div className="flex gap-3 text-xs">
          <button type="button" className="text-ink-muted hover:text-ink" onClick={() => setSourcesEnabled(allIds, true)}>
            Enable all
          </button>
          <button type="button" className="text-ink-muted hover:text-ink" onClick={() => setSourcesEnabled(allIds, false)}>
            Disable all
          </button>
        </div>
      </div>

      {groups.map(([country, sources]) => (
        <div key={country} className="mb-4">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-ink">
            <span aria-hidden>{flagEmoji(country)}</span>
            {countryName(country)}
          </p>
          <ul className="space-y-1">
            {sources.map((source) => (
              <li key={source.id} className="rounded-lg px-2 py-1.5 hover:bg-paper-subtle">
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
        <span className="block truncate text-sm text-ink">{source.name}</span>
        <span className="block text-xs text-ink-faint">{categoryLabel(source.category, language)}</span>
      </span>
      <input type="checkbox" className="sr-only" checked={enabled} onChange={onToggle} />
      <span
        aria-hidden
        className={[
          'relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition',
          enabled ? 'bg-accent' : 'bg-line',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-4 w-4 transform rounded-full bg-paper shadow transition',
            enabled ? 'translate-x-4' : 'translate-x-0.5',
          ].join(' ')}
        />
      </span>
    </label>
  );
}
