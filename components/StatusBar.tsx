'use client';

import { useEffect, useState } from 'react';
import type { ThemeId } from '@/lib/themes';

/** A decorative fake device status bar for the phone-era themes. */
export function StatusBar({ theme }: { theme: ThemeId }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  const carrier = theme === 'symbian' ? 'Nokia' : theme === 'iphone' ? 'Carrier' : 'Mobile';

  return (
    <div className="phone-status-bar" aria-hidden>
      <span>📶 {carrier}</span>
      <span>{time}</span>
      <span>🔋 100%</span>
    </div>
  );
}
