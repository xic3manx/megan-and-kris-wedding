"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide ambient backdrop. Drifting particles (dots, four-point stars,
 * small roses, lavender sprigs, soft petals) behind every page, painting
 * the dark void with a sense of atmosphere. Three big slow glow blobs
 * float behind the particles for depth.
 *
 * Mobile-friendly: pure CSS animation, no per-frame work unless on a
 * hover-capable device (where a soft mouse parallax kicks in). Honors
 * `prefers-reduced-motion`.
 *
 * Lives at z-index 0 (below everything in the main column at z-10).
 */

type Shape = "speck" | "petal" | "star" | "rose" | "lavender";

type Particle = {
  x: number;
  y: number;
  size: number;
  hue: "lavender" | "rose" | "gold" | "snow";
  drift: number;
  delay: number;
  sway: number;
  shape: Shape;
  rotate: number;
};

function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeParticles(count: number): Particle[] {
  const r = rand(11);
  const hues: Particle["hue"][] = ["lavender", "rose", "gold", "snow"];
  // Weighted shape pool — more dots, fewer fancier shapes.
  const shapePool: Shape[] = [
    "speck", "speck", "speck", "speck", "speck",
    "petal", "petal",
    "star", "star",
    "rose",
    "lavender",
  ];
  return Array.from({ length: count }, () => {
    const shape = shapePool[Math.floor(r() * shapePool.length)];
    const baseSize =
      shape === "speck" ? 2 + r() * 4 :
      shape === "petal" ? 4 + r() * 6 :
      shape === "star"  ? 8 + r() * 10 :
      shape === "rose"  ? 10 + r() * 8 :
                          12 + r() * 10; // lavender
    return {
      x: r() * 100,
      y: 60 + r() * 60, // start a bit lower so they drift up & through
      size: baseSize,
      hue: hues[Math.floor(r() * hues.length)],
      drift: 24 + r() * 32,
      delay: -r() * 35,
      sway: 14 + r() * 38,
      shape,
      rotate: r() * 360,
    };
  });
}

const HUE_COLORS: Record<Particle["hue"], string> = {
  lavender: "rgba(184, 163, 201, 0.62)",
  rose:     "rgba(193, 75, 106, 0.55)",
  gold:     "rgba(201, 166, 107, 0.62)",
  snow:     "rgba(251, 246, 236, 0.50)",
};

export default function AmbientBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>(makeParticles(62));

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;

    if (reduced) {
      root.dataset.reduced = "true";
      return;
    }

    if (!hover) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    function tick() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      if (root) {
        root.style.setProperty("--mx", `${curX.toFixed(2)}px`);
        root.style.setProperty("--my", `${curY.toFixed(2)}px`);
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    function onMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetX = -nx * 14;
      targetY = -ny * 14;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="ambient-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="ambient-vignette" />
      <div className="ambient-particles">
        {particles.current.map((p, i) => (
          <ParticleNode key={i} p={p} />
        ))}
      </div>
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />
      <div className="ambient-glow ambient-glow-3" />
    </div>
  );
}

function ParticleNode({ p }: { p: Particle }) {
  const style: React.CSSProperties = {
    left: `${p.x}%`,
    top: `${p.y}%`,
    width: p.size,
    height: p.size,
    color: HUE_COLORS[p.hue],
    animationDuration: `${p.drift}s`,
    animationDelay: `${p.delay}s`,
    ["--sway" as string]: `${p.sway}px`,
    ["--rot" as string]: `${p.rotate}deg`,
  };

  if (p.shape === "speck" || p.shape === "petal") {
    return <span className={`ambient-p ambient-p-${p.shape}`} style={style} />;
  }
  // SVG-shaped particles
  return (
    <span className="ambient-p ambient-p-svg" style={style}>
      {p.shape === "star" && <StarGlyph />}
      {p.shape === "rose" && <RoseGlyph />}
      {p.shape === "lavender" && <LavenderGlyph />}
    </span>
  );
}

/* ------------ tiny SVG glyphs ------------ */

function StarGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M12 2 L13.6 9.5 L21 12 L13.6 14.5 L12 22 L10.4 14.5 L3 12 L10.4 9.5 Z"
        fill="currentColor"
        style={{ filter: "drop-shadow(0 0 3px currentColor)" }}
      />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function RoseGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <g style={{ filter: "drop-shadow(0 0 2px currentColor)" }}>
        <circle cx="12" cy="11" r="6" fill="currentColor" opacity="0.55" />
        <circle cx="12" cy="11" r="3.6" fill="currentColor" opacity="0.85" />
        <circle cx="12" cy="11" r="1.4" fill="var(--color-rose-deep)" opacity="0.9" />
        {/* leaves */}
        <path d="M5 18 Q 10 16 12 14" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.5" />
        <path d="M19 18 Q 14 16 12 14" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}

function LavenderGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" aria-hidden="true">
      <g style={{ filter: "drop-shadow(0 0 2px currentColor)" }}>
        <path d="M12 22 L12 8" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
        {[0, 1, 2, 3, 4].map((i) => {
          const y = 4 + i * 2.5;
          return (
            <g key={i} opacity={0.85 - i * 0.1}>
              <ellipse cx={11 - i * 0.15} cy={y} rx="1.3" ry="0.85" fill="currentColor" />
              <ellipse cx={13 + i * 0.15} cy={y} rx="1.3" ry="0.85" fill="currentColor" />
            </g>
          );
        })}
        {/* tiny leaves */}
        <path d="M9 17 Q 11 15 12 16" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M15 17 Q 13 15 12 16" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.5" />
      </g>
    </svg>
  );
}
