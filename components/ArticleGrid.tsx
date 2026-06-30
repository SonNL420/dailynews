'use client';

import type { Article, FeedError, LanguageCode } from '@/lib/types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  articles: Article[];
  language: LanguageCode;
  loading: boolean;
  error: string | null;
  emptyHint?: string;
}

export function ArticleGrid({ articles, language, loading, error, emptyHint }: ArticleGridProps) {
  if (loading && articles.length === 0) {
    return <SkeletonGrid />;
  }

  if (error && articles.length === 0) {
    return (
      <EmptyState
        title="Couldn’t load the news"
        body={error}
      />
    );
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        title="Nothing to show here"
        body={emptyHint ?? 'Try another category or country, or enable more sources.'}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={`${article.sourceId}:${article.id}`} article={article} language={language} />
      ))}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-line bg-paper">
          <div className="skeleton aspect-[16/9] w-full" />
          <div className="flex flex-col gap-3 p-4">
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-5 w-full rounded" />
            <div className="skeleton h-5 w-4/5 rounded" />
            <div className="skeleton h-3 w-full rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-20 text-center">
      <p className="font-serif text-xl font-semibold text-ink">{title}</p>
      <p className="mt-2 max-w-md text-sm text-ink-muted">{body}</p>
    </div>
  );
}

/** A compact banner summarizing per-source failures without hiding content. */
export function SourceErrorBanner({ errors }: { errors: FeedError[] }) {
  if (errors.length === 0) return null;
  return (
    <details className="rounded-lg border border-line bg-paper-subtle px-4 py-2 text-sm text-ink-muted">
      <summary className="cursor-pointer font-medium text-ink">
        {errors.length} source{errors.length > 1 ? 's' : ''} couldn’t be loaded
      </summary>
      <ul className="mt-2 space-y-1">
        {errors.map((e) => (
          <li key={e.sourceId} className="flex justify-between gap-4">
            <span className="font-medium">{e.sourceId}</span>
            <span className="text-ink-faint">{e.message}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
