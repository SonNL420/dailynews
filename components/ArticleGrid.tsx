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
    return <RetroLoading />;
  }

  if (error && articles.length === 0) {
    return <EmptyState title="⚠️ Oops! Couldn’t load the news ⚠️" body={error} />;
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

function RetroLoading() {
  return (
    <div className="retro-panel flex flex-col items-center gap-3 px-6 py-20 text-center" aria-hidden>
      <p className="blink font-serif text-2xl font-bold text-accent">⏳ Loading headlines... please wait ⏳</p>
      <p className="text-sm text-ink-muted">(This may take a moment over a 56k connection)</p>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="retro-panel flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="font-serif text-xl font-bold text-accent">{title}</p>
      <p className="mt-2 max-w-md text-sm text-ink-muted">{body}</p>
    </div>
  );
}

/** A compact banner summarizing per-source failures without hiding content. */
export function SourceErrorBanner({ errors }: { errors: FeedError[] }) {
  if (errors.length === 0) return null;
  return (
    <details className="retro-panel px-4 py-2 text-sm text-ink-muted">
      <summary className="cursor-pointer font-bold text-accent">
        ⚠️ {errors.length} source{errors.length > 1 ? 's' : ''} couldn’t be loaded
      </summary>
      <ul className="mt-2 space-y-1">
        {errors.map((e) => (
          <li key={e.sourceId} className="flex justify-between gap-4">
            <span className="font-bold">{e.sourceId}</span>
            <span className="text-ink-faint">{e.message}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
