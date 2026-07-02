'use client';

import { useEffect } from 'react';
import { CloseIcon } from './icons';

export function RetroJokeModal({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!message) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <div className="theme-panel relative w-full max-w-sm">
        <header className="title-bar flex items-center justify-between px-3 py-1.5">
          <h2 className="font-serif text-sm font-bold text-[rgb(var(--titlebar-fg))]">📨 Message</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="theme-btn inline-flex h-6 w-6 items-center justify-center"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </header>
        <div className="p-5 text-center">
          <p className="font-serif text-base font-bold text-ink">{message}</p>
          <button type="button" onClick={onClose} className="theme-btn mt-4 px-4 py-1.5 text-sm font-bold">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
