/**
 * Decorative section divider — a hairline rule with a small lavender sprig
 * centered on it. Uses a flex-gap layout (two hairlines on either side of
 * the sprig) so it works correctly on top of the body's gradient bg
 * without needing a solid color mask.
 */
export default function BotanicalDivider({
  className = "",
  variant = "lavender",
}: {
  className?: string;
  variant?: "lavender" | "rose" | "snail";
}) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`my-14 flex items-center justify-center gap-4 px-6 ${className}`}
    >
      <span className="hairline flex-1 max-w-[18rem]" />
      <span className="shrink-0 px-2">
        {variant === "lavender" && <LavenderSprig />}
        {variant === "rose" && <RoseSprig />}
        {variant === "snail" && <SnailDivider />}
      </span>
      <span className="hairline flex-1 max-w-[18rem]" />
    </div>
  );
}

function LavenderSprig() {
  return (
    <svg width="80" height="28" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* stem */}
      <path
        d="M40 26 Q40 18 40 8"
        stroke="var(--color-gold-deep)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* lavender buds — small ovals along the stem, both sides */}
      {[...Array(5)].map((_, i) => {
        const y = 6 + i * 3.5;
        return (
          <g key={i}>
            <ellipse cx={37 - i * 0.4} cy={y} rx="2" ry="1.2" fill="var(--color-lavender)" opacity={0.85 - i * 0.1} />
            <ellipse cx={43 + i * 0.4} cy={y} rx="2" ry="1.2" fill="var(--color-lavender)" opacity={0.85 - i * 0.1} />
          </g>
        );
      })}
      {/* small leaf */}
      <path d="M30 20 Q34 18 40 22" stroke="var(--color-gold-deep)" strokeWidth="0.6" fill="none" />
      <path d="M50 20 Q46 18 40 22" stroke="var(--color-gold-deep)" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

function RoseSprig() {
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="12" r="5" fill="var(--color-rose)" />
      <circle cx="30" cy="12" r="3" fill="var(--color-rose-deep)" />
      <path d="M14 16 Q22 14 25 12" stroke="var(--color-gold-deep)" strokeWidth="0.8" fill="none" />
      <path d="M46 16 Q38 14 35 12" stroke="var(--color-gold-deep)" strokeWidth="0.8" fill="none" />
      <path d="M18 17 Q20 13 24 14 Q22 17 18 17 Z" fill="var(--color-lavender-deep)" opacity="0.6" />
      <path d="M42 17 Q40 13 36 14 Q38 17 42 17 Z" fill="var(--color-lavender-deep)" opacity="0.6" />
    </svg>
  );
}

/**
 * The first hidden snail. Tucked into the divider — easily overlooked.
 */
function SnailDivider() {
  return (
    <svg
      width="34"
      height="16"
      viewBox="0 0 34 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[var(--color-gold-deep)] opacity-60 hover:opacity-100 transition-opacity"
      aria-hidden="true"
    >
      {/* shell — spiral */}
      <circle cx="13" cy="9" r="5.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <path d="M13 9 m -3.5 0 a 3.5 3.5 0 0 1 7 0 a 3.5 3.5 0 0 1 -7 0 m 1.5 0 a 2 2 0 0 1 4 0" stroke="currentColor" strokeWidth="0.6" fill="none" />
      {/* body */}
      <path d="M7 14 Q15 14 21 12 L24 9 Q26 7 27 8 Q27.6 9 27 10" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" />
      {/* antennae */}
      <line x1="26" y1="9" x2="28" y2="6" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
      <line x1="24" y1="9" x2="25" y2="5.5" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
      <circle cx="28" cy="5.7" r="0.7" fill="currentColor" />
      <circle cx="25" cy="5.2" r="0.6" fill="currentColor" />
    </svg>
  );
}
