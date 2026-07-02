'use client';

import { useState } from 'react';
import type { Article, LanguageCode } from '@/lib/types';
import { categoryLabel } from '@/lib/categories';
import { flagEmoji } from '@/lib/countries';
import { absoluteTime, relativeTime } from '@/lib/time';
import { ExternalIcon } from './icons';

const RECENT_MS = 2 * 60 * 60 * 1000; // 2 hours

export function ArticleCard({ article, language }: { article: Article; language: LanguageCode }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = article.imageUrl && !imgFailed;
  const isRecent = Date.now() - new Date(article.publishedAt).getTime() < RECENT_MS;

  return (
    <article className="theme-panel flex flex-col">
      {/* Link color is set here (not on the heading) so the browser's real
          :visited state colors the headline, just like a 1999 homepage. */}
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col text-link visited:text-link-visited hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b-4 border-line bg-paper-subtle">
          {showImage ? (
            // Feed images come from arbitrary CDNs — a plain lazy <img> avoids
            // next/image's domain allowlist. Fallback handled via onError.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.imageUrl}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-3xl text-ink-faint/60" aria-hidden>
                {article.sourceName.charAt(0)}
              </span>
            </div>
          )}
          <span className="absolute left-2 top-2 border-2 border-line bg-accent-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
            {categoryLabel(article.category, language)}
          </span>
          {isRecent && (
            <span className="blink absolute right-2 top-2 border-2 border-line bg-accent px-2 py-0.5 text-[11px] font-bold uppercase text-white">
              🆕 New!
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="font-bold">{article.sourceName}</span>
            <span aria-hidden title={article.country}>
              {flagEmoji(article.country)}
            </span>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt} title={absoluteTime(article.publishedAt, language)}>
              {relativeTime(article.publishedAt, language)}
            </time>
          </div>

          <h2 className="font-serif text-lg font-bold leading-snug">{article.title}</h2>

          {article.summary && (
            <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{article.summary}</p>
          )}

          <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-bold">
            Click here to read more!
            <ExternalIcon width={13} height={13} />
          </span>
        </div>
      </a>
    </article>
  );
}
