'use client';

import { useState } from 'react';
import type { Article, LanguageCode } from '@/lib/types';
import { categoryLabel } from '@/lib/categories';
import { flagEmoji } from '@/lib/countries';
import { absoluteTime, relativeTime } from '@/lib/time';
import { ExternalIcon } from './icons';

export function ArticleCard({ article, language }: { article: Article; language: LanguageCode }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = article.imageUrl && !imgFailed;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-line bg-paper transition hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-[0_8px_30px_rgb(0_0_0/0.06)]">
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-paper-subtle">
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
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-3xl text-ink-faint/60" aria-hidden>
                {article.sourceName.charAt(0)}
              </span>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-paper/85 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent backdrop-blur-sm">
            {categoryLabel(article.category, language)}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span className="font-medium text-ink">{article.sourceName}</span>
            <span aria-hidden title={article.country}>
              {flagEmoji(article.country)}
            </span>
            <span aria-hidden>·</span>
            <time dateTime={article.publishedAt} title={absoluteTime(article.publishedAt, language)}>
              {relativeTime(article.publishedAt, language)}
            </time>
          </div>

          <h2 className="font-serif text-lg font-semibold leading-snug text-ink transition group-hover:text-accent">
            {article.title}
          </h2>

          {article.summary && (
            <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{article.summary}</p>
          )}

          <span className="mt-auto inline-flex items-center gap-1 pt-1 text-xs font-medium text-ink-faint">
            Read at source
            <ExternalIcon width={13} height={13} />
          </span>
        </div>
      </a>
    </article>
  );
}
