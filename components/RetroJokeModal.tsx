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
      <div className="retro-panel relative w-full max-w-sm">
        <header className="flex items-center justify-between bg-gradient-to-r from-blue-900 to-cyan-700 px-3 py-1.5 dark:from-black dark:to-green-950">
          <h2 className="font-serif text-sm font-bold text-white">📨 Message</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="win98-btn inline-flex h-6 w-6 items-center justify-center text-black"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </header>
        <div className="p-5 text-center">
          <p className="font-serif text-base font-bold text-ink">{message}</p>
          <button type="button" onClick={onClose} className="win98-btn mt-4 px-4 py-1.5 text-sm font-bold">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
