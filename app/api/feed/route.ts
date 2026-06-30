import { NextResponse } from 'next/server';
import { SOURCE_MAP } from '@/lib/sources';
import { fetchSource } from '@/lib/rss';
import type { Article, FeedError, FeedRequest, Source } from '@/lib/types';

// rss-parser + undici need the Node.js runtime (not edge).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function resolveSources(body: FeedRequest): Source[] {
  const customById = new Map((body.customSources ?? []).map((s) => [s.id, s]));
  const resolved: Source[] = [];
  const seen = new Set<string>();
  for (const id of body.ids ?? []) {
    if (seen.has(id)) continue;
    seen.add(id);
    const source = SOURCE_MAP[id] ?? customById.get(id);
    if (source) resolved.push(source);
  }
  return resolved;
}

export async function POST(request: Request) {
  let body: FeedRequest;
  try {
    body = (await request.json()) as FeedRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const sources = resolveSources(body);
  if (sources.length === 0) {
    return NextResponse.json({ articles: [], errors: [] });
  }

  const results = await Promise.allSettled(sources.map((s) => fetchSource(s)));

  const articles: Article[] = [];
  const errors: FeedError[] = [];
  results.forEach((result, index) => {
    const source = sources[index];
    if (result.status === 'fulfilled') {
      articles.push(...result.value);
    } else {
      const reason = result.reason;
      const message =
        reason instanceof Error ? reason.message : String(reason ?? 'Unknown error');
      errors.push({ sourceId: source.id, message });
    }
  });

  // Dedupe by article id (same story can appear in multiple section feeds).
  const byId = new Map<string, Article>();
  for (const article of articles) {
    if (!byId.has(article.id)) byId.set(article.id, article);
  }
  const deduped = Array.from(byId.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return NextResponse.json({ articles: deduped, errors });
}
