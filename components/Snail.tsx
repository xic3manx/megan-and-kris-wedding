"use client";

import { useEffect } from "react";
import { useSnailHunt } from "@/components/SnailHunt";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, { w: number; h: number; sw: number }> = {
  xs: { w: 26, h: 14, sw: 0.6 },
  sm: { w: 40, h: 22, sw: 0.8 },
  md: { w: 64, h: 36, sw: 1.0 },
  lg: { w: 100, h: 56, sw: 1.2 },
  xl: { w: 160, h: 90, sw: 1.4 },
};

/**
 * Reusable snail glyph. When given an `id` and a `whisper`, it becomes
 * a clickable easter egg: clicking reports the find to the SnailHunt
 * provider and floats the whisper line up like a calligraphy speech bubble.
 *
 * `subtle` (default) renders at low opacity until hovered — these are the
 * hidden ones. `prominent` renders at full opacity for non-hidden snails
 * (like the big 404 snail).
 */
export function Snail({
  id,
  size = "sm",
  whisper,
  className = "",
  style,
  color = "var(--color-gold)",
  variant = "subtle",
  flip = false,
  ariaLabel,
}: {
  id?: string;
  size?: Size;
  whisper?: string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  variant?: "subtle" | "prominent";
  flip?: boolean;
  ariaLabel?: string;
}) {
  const hunt = useSnailHunt();
  const dim = SIZES[size];
  const found = id ? hunt?.found.has(id) : false;
  const isHidden = !!id && variant === "subtle";

  function handleClick(e: React.MouseEvent) {
    if (!id) return;
    e.stopPropagation();
    hunt?.reportFind(id, whisper);
  }

  return (
    <span
      className={[
        "snail-glyph",
        isHidden ? "snail-glyph--hidden" : "snail-glyph--prominent",
        found ? "snail-glyph--found" : "",
        flip ? "snail-glyph--flip" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={{
        color,
        width: dim.w,
        height: dim.h,
        ...style,
      }}
      onClick={id ? handleClick : undefined}
      role={id ? "button" : undefined}
      tabIndex={id ? 0 : undefined}
      onKeyDown={
        id
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                hunt?.reportFind(id, whisper);
              }
            }
          : undefined
      }
      aria-label={ariaLabel ?? (id ? "a small surprise" : undefined)}
    >
      <SnailSvg sw={dim.sw} />
    </span>
  );
}

function SnailSvg({ sw }: { sw: number }) {
  // viewBox is normalized 0..120 wide × 0..68 tall
  return (
    <svg
      viewBox="0 0 120 68"
      width="100%"
      height="100%"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* trail */}
      <path d="M4 60 Q 14 56 26 58 T 48 58" stroke="currentColor" strokeWidth={sw * 0.7} strokeDasharray="1.5 4" strokeLinecap="round" opacity="0.5" />
      {/* shell — concentric spiral */}
      <circle cx="50" cy="38" r="22" stroke="currentColor" strokeWidth={sw * 1.4} fill="none" />
      <circle cx="50" cy="38" r="16" stroke="currentColor" strokeWidth={sw * 1.0} fill="none" />
      <circle cx="50" cy="38" r="10" stroke="currentColor" strokeWidth={sw * 0.8} fill="none" />
      <circle cx="50" cy="38" r="5"  stroke="currentColor" strokeWidth={sw * 0.6} fill="none" />
      <circle cx="50" cy="38" r="2"  fill="currentColor" />
      {/* tucked rose */}
      <circle cx="50" cy="44" r="1.8" fill="var(--color-rose-bloom)" opacity="0.85" />
      {/* body */}
      <path
        d="M28 60 Q 50 64 80 56 L 96 42 Q 105 32, 110 36 Q 113 42, 106 46"
        stroke="currentColor" strokeWidth={sw * 1.5} strokeLinecap="round"
        fill="rgba(201, 166, 107, 0.05)"
      />
      {/* antennae + eyes */}
      <line x1="106" y1="42" x2="113" y2="26" stroke="currentColor" strokeWidth={sw * 1.0} strokeLinecap="round" />
      <line x1="98"  y1="44" x2="100" y2="26" stroke="currentColor" strokeWidth={sw * 1.0} strokeLinecap="round" />
      <circle cx="113" cy="25" r={sw * 1.6} fill="currentColor" />
      <circle cx="100" cy="25" r={sw * 1.4} fill="currentColor" />
    </svg>
  );
}
