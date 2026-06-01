import { Snail } from "@/components/Snail";

/**
 * Decorative section divider — a hairline rule with a small motif
 * centered on it. Uses a flex-gap layout so it works correctly on top
 * of the body's gradient bg without needing a solid color mask.
 *
 * The "snail" variant can be opted into the snail hunt by passing a
 * `snailId` (and ideally a matching `snailWhisper`). Without those
 * props the snail is purely decorative — used on the login page where
 * no hunt state exists yet.
 */
export default function BotanicalDivider({
  className = "",
  variant = "lavender",
  snailId,
  snailWhisper,
}: {
  className?: string;
  variant?: "lavender" | "rose" | "snail";
  snailId?: string;
  snailWhisper?: string;
}) {
  return (
    <div
      role="presentation"
      className={`my-14 flex items-center justify-center gap-4 px-6 ${className}`}
    >
      <span className="hairline flex-1 max-w-[18rem]" aria-hidden="true" />
      <span className="shrink-0 px-2">
        {variant === "lavender" && <LavenderSprig />}
        {variant === "rose" && <RoseSprig />}
        {variant === "snail" && (
          snailId ? (
            <Snail
              id={snailId}
              whisper={snailWhisper}
              size="sm"
              color="var(--color-gold-deep)"
            />
          ) : (
            <Snail size="sm" variant="prominent" color="var(--color-gold-deep)" />
          )
        )}
      </span>
      <span className="hairline flex-1 max-w-[18rem]" aria-hidden="true" />
    </div>
  );
}

function LavenderSprig() {
  return (
    <svg width="80" height="28" viewBox="0 0 80 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M40 26 Q40 18 40 8"
        stroke="var(--color-gold-deep)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {[...Array(5)].map((_, i) => {
        const y = 6 + i * 3.5;
        return (
          <g key={i}>
            <ellipse cx={37 - i * 0.4} cy={y} rx="2" ry="1.2" fill="var(--color-lavender)" opacity={0.85 - i * 0.1} />
            <ellipse cx={43 + i * 0.4} cy={y} rx="2" ry="1.2" fill="var(--color-lavender)" opacity={0.85 - i * 0.1} />
          </g>
        );
      })}
      <path d="M30 20 Q34 18 40 22" stroke="var(--color-gold-deep)" strokeWidth="0.6" fill="none" />
      <path d="M50 20 Q46 18 40 22" stroke="var(--color-gold-deep)" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

function RoseSprig() {
  return (
    <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="30" cy="12" r="5" fill="var(--color-rose)" />
      <circle cx="30" cy="12" r="3" fill="var(--color-rose-deep)" />
      <path d="M14 16 Q22 14 25 12" stroke="var(--color-gold-deep)" strokeWidth="0.8" fill="none" />
      <path d="M46 16 Q38 14 35 12" stroke="var(--color-gold-deep)" strokeWidth="0.8" fill="none" />
      <path d="M18 17 Q20 13 24 14 Q22 17 18 17 Z" fill="var(--color-lavender-deep)" opacity="0.6" />
      <path d="M42 17 Q40 13 36 14 Q38 17 42 17 Z" fill="var(--color-lavender-deep)" opacity="0.6" />
    </svg>
  );
}
