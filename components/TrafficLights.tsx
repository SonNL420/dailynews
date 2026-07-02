'use client';

/** Decorative Mac OS X "gumdrop" window controls. Not wired to any action. */
export function TrafficLights() {
  return (
    <span className="traffic-lights" aria-hidden>
      <span className="tl-dot tl-red" />
      <span className="tl-dot tl-yellow" />
      <span className="tl-dot tl-green" />
    </span>
  );
}
