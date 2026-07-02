'use client';

/** CSS-driven scrolling banner — the reliable modern stand-in for <marquee>. */
export function Marquee({ text }: { text: string }) {
  return (
    <div className="marquee py-1.5" role="marquee" aria-label={text}>
      <span className="marquee-track font-serif text-sm font-bold text-accent">{text}</span>
    </div>
  );
}
