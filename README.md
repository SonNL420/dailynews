# Daily News

A personal, multilingual news aggregator. Pull headlines from outlets around the
world into one place, choose which sources to follow, browse by category — and
read **one language at a time**.

It's built for people who read in more than one language (Czech, Dutch, French,
and others) and want a clean, single-language reading surface instead of a
jumble. Pick a language and you only ever see that language's stories; optionally
narrow by country and category.

![Daily News](https://img.shields.io/badge/Next.js-15-black) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Language-first.** Exactly one language is active at a time, and only that
  language's articles are shown. Every source is tagged with both a **language**
  and a **country**, because the two aren't 1:1 (fr → FR/BE/CH/CA; BE → nl + fr).
- **Country picker.** Multi-select which countries appear on the front page for
  the active language (e.g. read French news from France and Canada but skip
  Belgium and Switzerland) — defaults to all on, toggle any combination off,
  persisted per language.
- **Category tabs** that further narrow within the active language/countries.
- **Curated seed of 175+ feeds across 25 countries** spanning Czech, Dutch,
  French, English, German, Spanish, Italian, Portuguese and Vietnamese outlets
  (e.g. English also covers the US, Ireland, Australia, New Zealand, India,
  Canada and South Africa; Spanish also covers Mexico, Argentina, Colombia and
  Chile) — plus the ability to **paste any custom RSS URL** to extend it.
- **Cards** show headline, summary, image, source, country flag and a localized
  relative timestamp ("2 h ago" in the reading language), linking out to the
  original article.
- **Per-feed resilience.** One broken feed never breaks the page — failures are
  isolated and surfaced in a collapsible banner.
- **Local-only preferences.** Language, enabled sources, custom feeds, filters
  and theme are stored in `localStorage`. No accounts, no database, no tracking.
- **Light / dark mode**, responsive layout, accessible markup, editorial-modern
  typography (Newsreader serif headlines + Inter UI).

## Tech stack

- **Next.js (App Router) + TypeScript** — a single deployable. A Node.js route
  handler does the RSS fetching/parsing (browsers can't fetch arbitrary RSS due
  to CORS); the client handles all UI and filtering.
- **Tailwind CSS** with a CSS-variable "paper" palette for theming.
- **rss-parser** for RSS/Atom parsing (handles `media:content`, `enclosure`, …).
- **sanitize-html** to clean feed HTML into plain-text summaries.
- **date-fns** with per-language locales for localized timestamps.
- **undici** `EnvHttpProxyAgent` so server-side fetches work both directly
  (production) and behind an `HTTP(S)_PROXY` (sandboxed/CI environments).

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm start            # run the production server
npm test             # unit tests (RSS → Article normalizer)
```

> **Network requirement.** The server fetches live RSS over HTTPS, so the
> machine running it needs outbound internet access. On your laptop or a normal
> Vercel deployment this just works. In a locked-down sandbox with an egress
> allowlist (where news domains are blocked), feeds will report errors and the
> grid will be empty — that's the environment's network policy, not a bug. The
> code honours `HTTP(S)_PROXY`/`NO_PROXY` if a proxy is present.

## How it works

```
app/
  layout.tsx            Root layout, fonts (runtime <link>), theme anti-flash
  page.tsx              Orchestrates prefs + data + filtering + layout
  globals.css           Palette (light/dark) + skeleton shimmer
  api/feed/route.ts     POST { ids, customSources } → { articles, errors }
lib/
  types.ts              Source / Article / Category / LanguageCode …
  sources.ts            Curated feed registry (the seed set)
  rss.ts                Fetch (proxy-aware) + charset decode + normalize + cache
  languages.ts          Language labels, flags, order, default
  categories.ts         Localized category labels (9 languages)
  countries.ts          ISO-2 → flag emoji + name
  time.ts               Localized relative/absolute timestamps
components/             Header, LanguageTabs, CountryFilter, CategoryTabs,
                        SourceManager, ArticleGrid, ArticleCard, ThemeToggle …
hooks/
  usePreferences.ts     localStorage-backed prefs (SSR-safe hydrate)
  useArticles.ts        Fetches /api/feed for the active language's sources
```

Request flow: the client computes the enabled source ids for the active language
and `POST`s them to `/api/feed`. The route resolves ids against the built-in
registry (plus any custom sources sent along), fetches each feed concurrently
with `Promise.allSettled` and a per-feed timeout, normalizes items into a common
`Article` shape (image extraction, summary sanitization, date parsing, stable id
hashing), caches per source for ~10 minutes, dedupes, sorts newest-first, and
returns the articles plus any per-source errors. The client then filters by
country and category entirely on the front end, so switching filters is instant.

## Adding your own feeds

Open **Sources** (top-right) and use **Add a custom RSS feed**: paste the feed
URL, optionally set a display name, and choose its language, country (ISO-2) and
category. Custom feeds persist in your browser and can be toggled or removed like
any built-in source. The Sources drawer is scoped to the language you're reading.

## Customizing the seed set

Edit `lib/sources.ts` — each entry is one feed:

```ts
{ id: 'bbc-world', name: 'BBC World',
  url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
  language: 'en', country: 'GB', category: 'world' }
```

Feeds occasionally move or retire; because failures are isolated, a stale entry
only drops its own card. To add a language, extend `LanguageCode` in
`lib/types.ts`, add it to `lib/languages.ts`, the labels in `lib/categories.ts`,
and a date-fns locale in `lib/time.ts`.

## Deployment

Deploy to Vercel (or any Node host) as a standard Next.js app — no environment
variables or database required. The `/api/feed` route runs on the Node.js
runtime.

## License

MIT
