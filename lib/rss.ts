import Parser from 'rss-parser';
import sanitizeHtml from 'sanitize-html';
import { createHash } from 'node:crypto';
import { EnvHttpProxyAgent, setGlobalDispatcher } from 'undici';
import type { Article, Source } from './types';

// ── Proxy support ──────────────────────────────────────────────────────────
// In sandboxed/CI environments outbound HTTPS is routed through an HTTP proxy
// declared via HTTP(S)_PROXY. Node's global fetch ignores those env vars by
// default, so install an env-aware dispatcher once (it also honours NO_PROXY,
// keeping localhost direct). In production (no proxy env) this is a no-op.
let dispatcherInstalled = false;
function ensureDispatcher() {
  if (dispatcherInstalled) return;
  dispatcherInstalled = true;
  if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.https_proxy || process.env.http_proxy) {
    try {
      setGlobalDispatcher(new EnvHttpProxyAgent());
    } catch {
      /* fall back to the default dispatcher */
    }
  }
}

const FETCH_TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const SUMMARY_MAX = 240;
const MAX_ITEMS_PER_FEED = 40;

const USER_AGENT =
  'Mozilla/5.0 (compatible; DailyNews/1.0; +https://github.com/SonNL420/dailynews) RSS aggregator';

// rss-parser maps the standard fields; declare the media extensions we want.
const parser: Parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: true }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

// ── Normalization (pure, unit-tested) ──────────────────────────────────────

type MediaNode = { $?: { url?: string; medium?: string; type?: string } } | undefined;

export interface RawFeedItem {
  title?: string;
  link?: string;
  guid?: string;
  isoDate?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  contentEncoded?: string;
  summary?: string;
  enclosure?: { url?: string; type?: string };
  mediaContent?: MediaNode | MediaNode[];
  mediaThumbnail?: MediaNode | MediaNode[];
}

function safeCodePoint(n: number): string {
  try {
    return Number.isFinite(n) ? String.fromCodePoint(n) : '';
  } catch {
    return '';
  }
}

/** Decode the common/numeric HTML entities (sanitize-html re-encodes them). */
function decodeEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => safeCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => safeCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&');
}

function stripHtml(html: string): string {
  return decodeEntities(sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }));
}

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s.,;:–-]+$/, '')}…`;
}

export function buildSummary(item: RawFeedItem): string {
  const candidate =
    item.contentSnippet ||
    item.summary ||
    item.content ||
    item.contentEncoded ||
    '';
  return truncate(normalizeWhitespace(stripHtml(candidate)), SUMMARY_MAX);
}

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function looksLikeImage(url: string): boolean {
  return /\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(url);
}

export function extractImage(item: RawFeedItem): string | undefined {
  // 1. media:content nodes (prefer ones flagged as images)
  for (const node of asArray(item.mediaContent)) {
    const url = node?.$?.url;
    if (!url) continue;
    const medium = node?.$?.medium;
    const type = node?.$?.type ?? '';
    if (medium === 'image' || type.startsWith('image') || looksLikeImage(url)) {
      return url;
    }
  }
  // 2. media:thumbnail
  for (const node of asArray(item.mediaThumbnail)) {
    if (node?.$?.url) return node.$.url;
  }
  // 3. enclosure
  const enc = item.enclosure;
  if (enc?.url && (enc.type?.startsWith('image') || looksLikeImage(enc.url))) {
    return enc.url;
  }
  // 4. first <img> in the body
  const body = item.contentEncoded || item.content || item.summary || '';
  const match = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match) return match[1];
  return undefined;
}

export function parsePublishedAt(item: RawFeedItem, now: () => number = Date.now): string {
  const raw = item.isoDate || item.pubDate;
  if (raw) {
    const date = new Date(raw);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date(now()).toISOString();
}

function hashLink(link: string): string {
  return createHash('sha1').update(link).digest('hex').slice(0, 16);
}

/** Normalize one raw RSS item into an Article, or null if it lacks essentials. */
export function normalizeItem(item: RawFeedItem, source: Source): Article | null {
  const link = (item.link || item.guid || '').trim();
  const title = normalizeWhitespace(stripHtml(item.title || ''));
  if (!link || !title) return null;
  return {
    id: hashLink(link),
    title,
    link,
    summary: buildSummary(item),
    imageUrl: extractImage(item),
    publishedAt: parsePublishedAt(item),
    sourceId: source.id,
    sourceName: source.name,
    language: source.language,
    country: source.country,
    category: source.category,
  };
}

/** Parse a feed XML string into Articles. Network-free, unit-tested. */
export async function parseFeedXml(xml: string, source: Source): Promise<Article[]> {
  const feed = await parser.parseString(xml);
  const items = (feed.items ?? []) as RawFeedItem[];
  return items
    .slice(0, MAX_ITEMS_PER_FEED)
    .map((item) => normalizeItem(item, source))
    .filter((a): a is Article => a !== null);
}

// ── Fetching + caching ─────────────────────────────────────────────────────

async function fetchFeedText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  return decodeBuffer(buffer, res.headers.get('content-type'));
}

/** Decode bytes using the charset from the HTTP header or the XML declaration. */
function decodeBuffer(buffer: Buffer, contentType: string | null): string {
  let charset = '';
  const headerMatch = contentType?.match(/charset=["']?([^"';]+)/i);
  if (headerMatch) {
    charset = headerMatch[1].trim();
  } else {
    const head = buffer.subarray(0, 256).toString('latin1');
    const xmlMatch = head.match(/encoding=["']([^"']+)["']/i);
    if (xmlMatch) charset = xmlMatch[1].trim();
  }
  charset = charset.toLowerCase() || 'utf-8';
  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return new TextDecoder('utf-8').decode(buffer);
  }
}

interface CacheEntry {
  articles: Article[];
  expires: number;
}
const cache = new Map<string, CacheEntry>();

/** Fetch + parse a single source, using a ~10 minute in-memory cache. */
export async function fetchSource(source: Source): Promise<Article[]> {
  ensureDispatcher();
  const cached = cache.get(source.id);
  if (cached && cached.expires > Date.now()) {
    return cached.articles;
  }
  const xml = await fetchFeedText(source.url);
  const articles = await parseFeedXml(xml, source);
  cache.set(source.id, { articles, expires: Date.now() + CACHE_TTL_MS });
  return articles;
}
