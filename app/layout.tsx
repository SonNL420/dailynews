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
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1120' },
  ],
};

// Avoid a flash of the wrong theme before React hydrates the stored preference.
// Mirrors lib/themes.ts normalizeLegacyTheme() for the pre-hydration paint only.
const themeInitScript = `(function(){try{var p=JSON.parse(localStorage.getItem('dailynews:prefs:v1')||'{}');var t=p.theme;if(t==='light')t='geocities';else if(t==='dark')t='bbs';else if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'midnight':'clean';document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme=window.matchMedia('(prefers-color-scheme: dark)').matches?'midnight':'clean';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Every theme uses a system font stack, so there is no font request or
            layout shift while the saved theme is restored. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
