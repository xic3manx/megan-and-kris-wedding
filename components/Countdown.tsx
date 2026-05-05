"use client";

import { useEffect, useState } from "react";
import { CEREMONY_AT, diffParts, type CountdownParts } from "@/lib/wedding-date";

/**
 * Live countdown to the ceremony at noon on July 14, 2026.
 * Renders compact (header) or full (hero) variants.
 */
export default function Countdown({
  variant = "compact",
  className = "",
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  const [parts, setParts] = useState<CountdownParts | null>(null);

  useEffect(() => {
    const tick = () => setParts(diffParts(CEREMONY_AT));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) {
    // SSR / first paint — show a stable placeholder so layout doesn't jump
    return (
      <div className={className} aria-hidden="true">
        <span className="opacity-0">placeholder</span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`inline-flex items-baseline gap-2 smallcaps text-xs ${className}`}
        aria-label={`Time until ceremony: ${parts.days} days, ${parts.hours} hours`}
      >
        {parts.past ? (
          <span className="text-[var(--color-gold)]">A married memory · {parts.days}d ago</span>
        ) : (
          <>
            <span className="text-[var(--color-parchment-mute)]">till we say I do</span>
            <span className="text-[var(--color-gold)] font-semibold tracking-widest">
              {parts.days}d {String(parts.hours).padStart(2, "0")}h{" "}
              {String(parts.minutes).padStart(2, "0")}m {String(parts.seconds).padStart(2, "0")}s
            </span>
          </>
        )}
      </div>
    );
  }

  // FULL variant — used on the Home hero
  const cells: { label: string; value: number }[] = parts.past
    ? [
        { label: "days since", value: parts.days },
        { label: "hours", value: parts.hours },
        { label: "minutes", value: parts.minutes },
        { label: "seconds", value: parts.seconds },
      ]
    : [
        { label: "days", value: parts.days },
        { label: "hours", value: parts.hours },
        { label: "minutes", value: parts.minutes },
        { label: "seconds", value: parts.seconds },
      ];

  return (
    <div className={`grid grid-cols-4 gap-3 sm:gap-6 ${className}`}>
      {cells.map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="font-serif text-4xl sm:text-6xl md:text-7xl text-[var(--color-parchment)] tabular-nums">
            {String(value).padStart(2, "0")}
          </div>
          <div className="smallcaps text-[10px] sm:text-xs text-[var(--color-parchment-mute)] mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
