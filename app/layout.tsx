import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '🌐 Daily News :: Your #1 WWW Portal for World News! 🌐',
  description:
    'A personal multilingual news reader. Follow outlets from around the world, ' +
    'filter by country and category, and read one language at a time. ' +
    'Best viewed at 800x600! No frames required!',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffff00' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Avoid a flash of the wrong theme before React hydrates the stored preference.
// Mirrors lib/themes.ts normalizeLegacyTheme() for the pre-hydration paint only.
const themeInitScript = `(function(){try{var p=JSON.parse(localStorage.getItem('dailynews:prefs:v1')||'{}');var t=p.theme;if(t==='light')t='geocities';else if(t==='dark')t='bbs';else if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'bbs':'geocities';document.documentElement.dataset.theme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Comic Sans MS / Times New Roman / Courier New are system fonts —
            no webfont fetch needed, which is exactly how it was done in 1999. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
