'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'dailynews:hitcounter:v1';

/** A purely-decorative visitor counter, styled like the classic 7-digit LED odometer. */
export function HitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const next = (raw ? parseInt(raw, 10) : 1337) + 1;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      setCount(next);
    } catch {
      setCount(1338);
    }
  }, []);

  const digits = String(count ?? 0).padStart(7, '0');

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <span className="text-xs font-bold text-ink-faint">You are visitor number:</span>
      <span className="led-counter text-lg">{digits}</span>
    </div>
  );
}
