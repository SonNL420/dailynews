'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Article, FeedError, LanguageCode, Source } from '@/lib/types';

interface UseArticlesArgs {
  language: LanguageCode;
  /** Enabled source ids (built-in + custom) for the active language. */
  sourceIds: string[];
  /** Custom sources the server doesn't know about, by definition. */
  customSources: Source[];
  /** Wait for preference hydration before the first fetch. */
  enabled: boolean;
}

interface ArticlesState {
  articles: Article[];
  errors: FeedError[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useArticles({ language, sourceIds, customSources, enabled }: UseArticlesArgs) {
  const [state, setState] = useState<ArticlesState>({
    articles: [],
    errors: [],
    loading: false,
    error: null,
    lastUpdated: null,
  });
  const [nonce, setNonce] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Stable key so we only refetch when the language or selected sources change.
  const idsKey = [...sourceIds].sort().join(',');

  useEffect(() => {
    if (!enabled) return;
    abortRef.current?.abort();

    if (sourceIds.length === 0) {
      setState({ articles: [], errors: [], loading: false, error: null, lastUpdated: Date.now() });
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setState((s) => ({ ...s, loading: true, error: null }));

    const relevantCustom = customSources.filter((s) => sourceIds.includes(s.id));

    fetch('/api/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: sourceIds, customSources: relevantCustom }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return (await res.json()) as { articles: Article[]; errors: FeedError[] };
      })
      .then((data) => {
        setState({
          articles: data.articles ?? [],
          errors: data.errors ?? [],
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to load news',
        }));
      });

    return () => controller.abort();
    // idsKey captures sourceIds; customSources read fresh inside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, idsKey, nonce, enabled]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  return { ...state, refresh };
}
