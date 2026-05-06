"use client";

import { useEffect, useRef } from "react";

/**
 * Site-wide ambient backdrop. Slowly drifting particles (petals, gold
 * specks, lavender motes) behind every page, painting the dark void
 * with a sense of atmosphere. Constellation-thin lines connect particles
 * that drift near each other.
 *
 * Mobile-friendly: pure CSS animation, no per-frame work unless on a
 * hover-capable device (where a soft mouse parallax kicks in). Honors
 * `prefers-reduced-motion` by holding particles still.
 *
 * Lives at z-index 0 (below everything in the main column at z-10).
 */

type Particle = {
  x: number;       // 0..100 (vw)
  y: number;       // 0..100 (vh) starting position
  size: number;    // px
  hue: "lavender" | "rose" | "gold" | "snow";
  drift: number;   // seconds for full drift cycle
  delay: number;
  sway: number;    // px horizontal sway amplitude
  shape: "petal" | "speck" | "star";
};

function rand(seed: number) {
  // deterministic-ish PRNG so client matches first render
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function makeParticles(count: number): Particle[] {
  const r = rand(7);
  const hues: Particle["hue"][] = ["lavender", "rose", "gold", "snow"];
  const shapes: Particle["shape"][] = ["petal", "speck", "speck", "star", "speck"];
  return Array.from({ length: count }, (_, i) => ({
    x: r() * 100,
    y: r() * 100,
    size: 2 + r() * 6,
    hue: hues[Math.floor(r() * hues.length)],
    drift: 22 + r() * 28,
    delay: -r() * 30,
    sway: 18 + r() * 36,
    shape: shapes[Math.floor(r() * shapes.length)],
  }));
}

const HUE_COLORS: Record<Particle["hue"], string> = {
  lavender: "rgba(184, 163, 201, 0.55)",
  rose: "rgba(193, 75, 106, 0.45)",
  gold: "rgba(201, 166, 107, 0.55)",
  snow: "rgba(251, 246, 236, 0.42)",
};

export default function AmbientBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>(makeParticles(34));

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;

    if (reduced) {
      root.dataset.reduced = "true";
      return;
    }

    if (!hover) return; // skip cursor parallax on touch devices

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
      // -1..1 on each axis, then scale
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
          <span
            key={i}
            className={`ambient-p ambient-p-${p.shape}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              color: HUE_COLORS[p.hue],
              animationDuration: `${p.drift}s`,
              animationDelay: `${p.delay}s`,
              // sway distance encoded as a custom prop
              ["--sway" as string]: `${p.sway}px`,
            }}
          />
        ))}
      </div>
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />
      <div className="ambient-glow ambient-glow-3" />
    </div>
  );
}
