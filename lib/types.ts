// Core domain types for the multilingual news aggregator.

export type LanguageCode =
  | 'cs'
  | 'nl'
  | 'fr'
  | 'en'
  | 'de'
  | 'es'
  | 'it'
  | 'pt'
  | 'vi';

// ISO 3166-1 alpha-2 country code, uppercase (e.g. "CZ", "BE", "FR").
export type CountryCode = string;

export type Category =
  | 'top'
  | 'world'
  | 'politics'
  | 'business'
  | 'technology'
  | 'science'
  | 'sport'
  | 'culture'
  | 'health';

export interface Source {
  /** Stable unique id, also used as the cache key. */
  id: string;
  name: string;
  /** RSS/Atom feed URL. */
  url: string;
  language: LanguageCode;
  country: CountryCode;
  category: Category;
  /** Public homepage of the outlet (optional). */
  homepage?: string;
  /** True for user-added feeds stored in localStorage. */
  custom?: boolean;
}

export interface Article {
  /** Stable id derived from the article link. */
  id: string;
  title: string;
  link: string;
  summary: string;
  imageUrl?: string;
  /** ISO 8601 timestamp. */
  publishedAt: string;
  sourceId: string;
  sourceName: string;
  language: LanguageCode;
  country: CountryCode;
  category: Category;
}

export interface FeedError {
  sourceId: string;
  message: string;
}

export interface FeedResponse {
  articles: Article[];
  errors: FeedError[];
}

/** Payload the client sends to /api/feed. */
export interface FeedRequest {
  /** Built-in source ids to fetch. */
  ids: string[];
  /** Custom (user-added) sources the server doesn't know about. */
  customSources?: Source[];
}
