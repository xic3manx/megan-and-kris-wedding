"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import {
  MILESTONES,
  MEGAN_PATH,
  KRIS_PATH,
  PIN_NEWPORT,
  type Milestone,
} from "@/data/milestones";
import { Calligraphy } from "@/components/Calligraphy";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const MAP_W = 400;
const MAP_H = 620;
const ZOOM_W = 180;
const ZOOM_H = 240;
const STAGE_COUNT = MILESTONES.length + 1; // +1 = full-map intro stage

/**
 * Sticky-scroll tracker. The wrapping section is several viewport
 * heights tall; the inner content pins to the viewport. As the user
 * scrolls, the map zooms from a full state of California into each
 * milestone in sequence, with captions cross-fading on the left.
 *
 * Manual zoom controls (+ / − / reset) layer on top for users who
 * want to explore freely.
 */
export default function BrideGroomTracker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Milestone | null>(null);
  const [manualOverride, setManualOverride] = useState(false);

  // viewBox motion values (animated by scroll OR by manual controls)
  const vx = useMotionValue(0);
  const vy = useMotionValue(0);
  const vw = useMotionValue(MAP_W);
  const vh = useMotionValue(MAP_H);
  const viewBox = useTransform(
    [vx, vy, vw, vh],
    ([x, y, w, h]) => `${x} ${y} ${w} ${h}`
  );

  // scroll progress within the sticky section (0..1)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // map progress to a stage index 0..STAGE_COUNT-1 with smoothing inside each stage
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    if (manualOverride) return;
    // each stage spans 1/STAGE_COUNT of the scroll
    const segment = t * STAGE_COUNT;
    const idx = Math.min(STAGE_COUNT - 1, Math.floor(segment));
    const segT = Math.min(1, Math.max(0, segment - idx)); // 0..1 within stage
    applyStage(idx, segT);
  });

  /**
   * idx = -1 (or 0 with segT=0) → full state
   * idx = 0..n means we're zoomed into MILESTONES[idx-1]? Actually let's
   * map idx so:
   *   idx 0 → full map, then ease into milestone 0
   *   idx 1 → milestone 0 → milestone 1
   *   idx i → milestones[i-1] → milestones[i]
   */
  function applyStage(idx: number, segT: number) {
    // Stage 0: full map → first milestone
    // Stage k>0: milestone k-1 → milestone k
    const fromBox =
      idx === 0
        ? { x: 0, y: 0, w: MAP_W, h: MAP_H }
        : boxFor(MILESTONES[idx - 1]);
    const toBox =
      idx >= MILESTONES.length
        ? { x: 0, y: 0, w: MAP_W, h: MAP_H } // last stage: zoom back out
        : boxFor(MILESTONES[idx] || MILESTONES[MILESTONES.length - 1]);

    const e = easeInOut(segT);
    vx.set(lerp(fromBox.x, toBox.x, e));
    vy.set(lerp(fromBox.y, toBox.y, e));
    vw.set(lerp(fromBox.w, toBox.w, e));
    vh.set(lerp(fromBox.h, toBox.h, e));

    // Active caption — show milestone we're transitioning toward when past midpoint
    const activeIdx =
      idx >= MILESTONES.length
        ? -1 // show "the long road" intro again at the end
        : segT > 0.45
        ? idx
        : idx - 1;

    setActive(activeIdx >= 0 ? MILESTONES[activeIdx] : null);
  }

  // Manual controls
  const zoomIn = useCallback(() => {
    setManualOverride(true);
    const cx = vx.get() + vw.get() / 2;
    const cy = vy.get() + vh.get() / 2;
    const newW = Math.max(80, vw.get() * 0.7);
    const newH = Math.max(120, vh.get() * 0.7);
    animate(vw, newW, { duration: 0.6, ease: "easeOut" });
    animate(vh, newH, { duration: 0.6, ease: "easeOut" });
    animate(vx, cx - newW / 2, { duration: 0.6, ease: "easeOut" });
    animate(vy, cy - newH / 2, { duration: 0.6, ease: "easeOut" });
  }, [vx, vy, vw, vh]);

  const zoomOut = useCallback(() => {
    setManualOverride(true);
    const cx = vx.get() + vw.get() / 2;
    const cy = vy.get() + vh.get() / 2;
    const newW = Math.min(MAP_W, vw.get() / 0.7);
    const newH = Math.min(MAP_H, vh.get() / 0.7);
    animate(vw, newW, { duration: 0.6, ease: "easeOut" });
    animate(vh, newH, { duration: 0.6, ease: "easeOut" });
    animate(vx, Math.max(0, Math.min(MAP_W - newW, cx - newW / 2)), { duration: 0.6 });
    animate(vy, Math.max(0, Math.min(MAP_H - newH, cy - newH / 2)), { duration: 0.6 });
  }, [vx, vy, vw, vh]);

  const reset = useCallback(() => {
    setManualOverride(false);
    animate(vx, 0, { duration: 0.6, ease: "easeOut" });
    animate(vy, 0, { duration: 0.6, ease: "easeOut" });
    animate(vw, MAP_W, { duration: 0.6, ease: "easeOut" });
    animate(vh, MAP_H, { duration: 0.6, ease: "easeOut" });
  }, [vx, vy, vw, vh]);

  // Drag-to-pan
  const dragRef = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (vw.get() >= MAP_W * 0.95) return; // can't pan when fully zoomed out
    setManualOverride(true);
    dragRef.current = { x: e.clientX, y: e.clientY, vx: vx.get(), vy: vy.get() };
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const d = dragRef.current;
    if (!d) return;
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const scaleX = vw.get() / rect.width;
    const scaleY = vh.get() / rect.height;
    const dx = (e.clientX - d.x) * scaleX;
    const dy = (e.clientY - d.y) * scaleY;
    const nx = Math.max(0, Math.min(MAP_W - vw.get(), d.vx - dx));
    const ny = Math.max(0, Math.min(MAP_H - vh.get(), d.vy - dy));
    vx.set(nx);
    vy.set(ny);
  }
  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    dragRef.current = null;
    try { (e.currentTarget as Element).releasePointerCapture(e.pointerId); } catch {}
  }

  // Initial trace animation
  const [traced, setTraced] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTraced(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    // Tall section — height drives sticky scroll
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${STAGE_COUNT * 90}vh` }}
    >
      {/* sticky inner */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 w-full grid lg:grid-cols-[1fr,1.4fr] gap-10 items-center">
          {/* LEFT — caption */}
          <div className="order-2 lg:order-1 min-h-[280px]">
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: -8, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 8, filter: "blur(4px)" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="surface p-8"
                >
                  <p
                    className="smallcaps text-[10px] tracking-[0.35em] mb-2"
                    style={{ color: sideColor(active.side) }}
                  >
                    {sideLabel(active.side)} · {active.year}
                  </p>
                  <Calligraphy
                    as="h3"
                    className="text-3xl sm:text-4xl mb-1 text-[var(--color-parchment)]"
                  >
                    {active.city}
                  </Calligraphy>
                  <p className="font-serif text-lg italic text-[var(--color-parchment-soft)] mb-4">
                    {active.title}
                  </p>
                  <p className="text-[var(--color-parchment-soft)] leading-relaxed">
                    {active.body}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="surface p-8 text-center"
                >
                  <p className="smallcaps text-[10px] tracking-[0.35em] text-[var(--color-gold)] mb-3">
                    Scroll to begin · drag to pan · use + / − to zoom
                  </p>
                  <Calligraphy as="p" className="text-3xl text-[var(--color-parchment)] mb-3">
                    Two paths, one place.
                  </Calligraphy>
                  <p className="text-[var(--color-parchment-mute)] italic leading-relaxed">
                    Megan from the redwoods, Kris from the canyons — meeting at
                    Pelican Hill, above the long blue Pacific.
                  </p>
                  <div className="mt-6 flex justify-center gap-6 text-xs">
                    <LegendDot side="megan" label="Megan" />
                    <LegendDot side="kris" label="Kris" />
                    <LegendDot side="shared" label="Together" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT — the map */}
          <div className="order-1 lg:order-2 relative">
            <motion.svg
              viewBox={viewBox}
              className="w-full max-w-[560px] mx-auto block touch-none cursor-grab active:cursor-grabbing select-none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Map of California showing the journey from Eureka and Irvine to Newport Coast"
              preserveAspectRatio="xMidYMid meet"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            >
              <defs>
                <linearGradient id="ink-paper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a1518" />
                  <stop offset="100%" stopColor="#0c0a0c" />
                </linearGradient>
                <linearGradient id="megan-line" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-lavender)" />
                  <stop offset="100%" stopColor="var(--color-gold)" />
                </linearGradient>
                <linearGradient id="kris-line" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--color-rose-bloom)" />
                  <stop offset="100%" stopColor="var(--color-gold)" />
                </linearGradient>
                <filter id="aged" x="-5%" y="-5%" width="110%" height="110%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="3" />
                  <feColorMatrix values="0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0 0.55  0 0 0 0.05 0" />
                  <feComposite in2="SourceGraphic" operator="in" />
                </filter>
              </defs>

              <rect width={MAP_W} height={MAP_H} fill="url(#ink-paper)" />
              <rect width={MAP_W} height={MAP_H} fill="url(#ink-paper)" filter="url(#aged)" opacity="0.9" />

              {/* compass rose */}
              <g transform="translate(355 70)" opacity="0.7">
                <circle r="24" fill="none" stroke="var(--color-gold)" strokeWidth="0.6" />
                <circle r="18" fill="none" stroke="var(--color-gold)" strokeWidth="0.3" strokeDasharray="1 2" />
                <circle r="2.4" fill="var(--color-gold)" />
                {/* cardinal axes */}
                <path d="M 0 -22 L 0 22 M -22 0 L 22 0" stroke="var(--color-gold)" strokeWidth="0.5" />
                {/* diagonals (lighter) */}
                <path d="M -15 -15 L 15 15 M -15 15 L 15 -15" stroke="var(--color-gold)" strokeWidth="0.3" opacity="0.5" />
                {/* north needle (filled) */}
                <path d="M 0 -22 L 4 -4 L 0 0 L -4 -4 Z" fill="var(--color-gold)" />
                {/* south needle (outline) */}
                <path d="M 0 22 L 4 4 L 0 0 L -4 4 Z" fill="none" stroke="var(--color-gold)" strokeWidth="0.4" />
                {/* labels */}
                <text y="-27" textAnchor="middle" fontSize="8" fill="var(--color-gold)" fontFamily="serif" letterSpacing="2">N</text>
                <text y="32" textAnchor="middle" fontSize="7" fill="var(--color-gold)" fontFamily="serif" letterSpacing="2" opacity="0.85">S</text>
                <text x="28" y="3" textAnchor="middle" fontSize="7" fill="var(--color-gold)" fontFamily="serif" letterSpacing="2" opacity="0.85">E</text>
                <text x="-28" y="3" textAnchor="middle" fontSize="7" fill="var(--color-gold)" fontFamily="serif" letterSpacing="2" opacity="0.85">W</text>
              </g>

              {/* California outline — fill, stroke, inner sketch line */}
              <path
                d={CA_OUTLINE}
                fill="rgba(184, 163, 201, 0.05)"
                stroke="var(--color-gold-deep)"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d={CA_OUTLINE}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="0.5"
                strokeDasharray="1.5 3"
                opacity="0.55"
              />

              {/* Sierra Nevada hint — soft hatching down the spine */}
              <g opacity="0.18" stroke="var(--color-lavender)" strokeWidth="0.5" fill="none">
                <path d="M 175 95 Q 200 130 215 175 Q 235 230 250 285 Q 270 335 295 380" />
                <path d="M 195 130 Q 218 180 240 240 Q 260 295 285 350" strokeDasharray="2 4" />
                <path d="M 165 105 Q 188 155 208 215 Q 228 270 252 325" strokeDasharray="0.5 5" />
              </g>

              {/* Pacific Ocean label */}
              <g opacity="0.5">
                <text x="70" y="430" fontSize="9" fill="var(--color-parchment-mute)" fontFamily="serif"
                  style={{ fontStyle: "italic", letterSpacing: "0.6em" }}>
                  PACIFIC
                </text>
                <text x="74" y="448" fontSize="7" fill="var(--color-parchment-mute)" fontFamily="serif"
                  style={{ fontStyle: "italic", letterSpacing: "0.4em" }}>
                  OCEAN
                </text>
                {/* tiny swell glyphs */}
                <path d="M 50 470 Q 60 466 70 470 T 90 470" stroke="var(--color-parchment-mute)" strokeWidth="0.4" fill="none" />
                <path d="M 50 478 Q 60 474 70 478 T 90 478" stroke="var(--color-parchment-mute)" strokeWidth="0.3" fill="none" />
              </g>

              {/* Greyed reference cities for context */}
              <g opacity="0.4" fill="var(--color-parchment-mute)" fontFamily="serif"
                style={{ fontStyle: "italic", letterSpacing: "0.05em" }}>
                <circle cx="118" cy="285" r="1.5" />
                <text x="123" y="288" fontSize="7">San Francisco</text>
                <circle cx="252" cy="465" r="1.5" />
                <text x="221" y="463" fontSize="7" textAnchor="end">Los Angeles</text>
                <circle cx="248" cy="555" r="1.5" />
                <text x="244" y="558" fontSize="7" textAnchor="end">San Diego</text>
              </g>

              {/* Megan's path */}
              <motion.path
                d={MEGAN_PATH}
                fill="none"
                stroke="url(#megan-line)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: traced ? 1 : 0 }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
              />

              {/* Kris's path */}
              <motion.path
                d={KRIS_PATH}
                fill="none"
                stroke="url(#kris-line)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: traced ? 1 : 0 }}
                transition={{ duration: 1.6, ease: "easeInOut", delay: 0.6 }}
              />

              {/* Milestones (skip the wedding pin — rendered as hero below) */}
              {MILESTONES.filter((m) => m.id !== "shared-wedding").map((m, i) => {
                const isActive = active?.id === m.id;
                const color = sideColor(m.side);
                // labels pull toward the interior, away from the coast
                const labelLeft = m.x >= 200;
                const labelX = labelLeft ? m.x - 10 : m.x + 10;
                const labelAnchor = labelLeft ? "end" : "start";
                return (
                  <motion.g
                    key={m.id}
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: traced ? 1 : 0, scale: traced ? 1 : 0.3 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.18, ease: "backOut" }}
                    onMouseEnter={() => setActive(m)}
                    onFocus={() => setActive(m)}
                    onClick={() => setActive(m)}
                    className="cursor-pointer outline-none"
                    tabIndex={0}
                    role="button"
                    aria-label={`${m.city}: ${m.title}`}
                  >
                    {isActive && (
                      <>
                        <circle cx={m.x} cy={m.y} r={14} fill={color} className="city-pulse" opacity={0.35} />
                        <circle cx={m.x} cy={m.y} r={11} fill="none" stroke={color} strokeWidth="0.5" opacity={0.6} />
                      </>
                    )}
                    <circle
                      cx={m.x} cy={m.y}
                      r={m.side === "shared" ? 8 : 6.5}
                      fill={color}
                      stroke="var(--color-snow)"
                      strokeWidth={isActive ? 2 : 1}
                    />
                    {m.side === "shared" && (
                      <path
                        d={`M ${m.x - 3.6} ${m.y} L ${m.x} ${m.y - 3.6} L ${m.x + 3.6} ${m.y} L ${m.x} ${m.y + 3.6} Z`}
                        fill="var(--color-ink)"
                      />
                    )}
                    {/* label */}
                    <g style={{ pointerEvents: "none" }}>
                      <text
                        x={labelX}
                        y={m.y + 1}
                        fontSize="10.5"
                        fontFamily="serif"
                        fill={isActive ? "var(--color-snow)" : "var(--color-parchment)"}
                        textAnchor={labelAnchor}
                        style={{ fontStyle: "italic", letterSpacing: "0.06em" }}
                      >
                        {m.city}
                      </text>
                      {isActive && (
                        <text
                          x={labelX}
                          y={m.y + 12}
                          fontSize="6.5"
                          fontFamily="serif"
                          fill={color}
                          textAnchor={labelAnchor}
                          style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}
                        >
                          {m.year}
                        </text>
                      )}
                    </g>
                  </motion.g>
                );
              })}

              {/* HERO pin — the wedding location. Always pulsing, gold,
                  with a callout label and a heart above. Drawn last so
                  it sits on top of every other element. */}
              <g aria-label="Pelican Hill, Newport Coast — the wedding">
                {/* expanding rings */}
                <circle cx={PIN_NEWPORT.x} cy={PIN_NEWPORT.y} r="6" fill="var(--color-gold)" opacity="0.18" className="hero-ring hero-ring-1" />
                <circle cx={PIN_NEWPORT.x} cy={PIN_NEWPORT.y} r="6" fill="var(--color-gold)" opacity="0.12" className="hero-ring hero-ring-2" />
                <circle cx={PIN_NEWPORT.x} cy={PIN_NEWPORT.y} r="6" fill="var(--color-rose-bloom)" opacity="0.10" className="hero-ring hero-ring-3" />

                {/* gilded star marker */}
                <motion.g
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: traced ? 1 : 0, opacity: traced ? 1 : 0 }}
                  transition={{ delay: 1.6, duration: 0.7, ease: "backOut" }}
                  style={{ transformOrigin: `${PIN_NEWPORT.x}px ${PIN_NEWPORT.y}px` }}
                >
                  {/* outer 8-point star */}
                  <path
                    d={star8(PIN_NEWPORT.x, PIN_NEWPORT.y, 11, 5)}
                    fill="var(--color-gold)"
                    stroke="var(--color-snow)"
                    strokeWidth="0.8"
                    strokeLinejoin="round"
                  />
                  {/* inner diamond */}
                  <path
                    d={`M ${PIN_NEWPORT.x - 4} ${PIN_NEWPORT.y} L ${PIN_NEWPORT.x} ${PIN_NEWPORT.y - 4} L ${PIN_NEWPORT.x + 4} ${PIN_NEWPORT.y} L ${PIN_NEWPORT.x} ${PIN_NEWPORT.y + 4} Z`}
                    fill="var(--color-rose-bloom)"
                  />
                  <circle cx={PIN_NEWPORT.x} cy={PIN_NEWPORT.y} r="1.2" fill="var(--color-snow)" />
                </motion.g>

                {/* heart hovering above */}
                <motion.path
                  d={heartPath(PIN_NEWPORT.x, PIN_NEWPORT.y - 22, 5)}
                  fill="var(--color-rose-bloom)"
                  stroke="var(--color-gold)"
                  strokeWidth="0.5"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: traced ? 1 : 0, y: 0 }}
                  transition={{ delay: 2.0, duration: 0.6 }}
                  className="hero-heart"
                />

                {/* connector tick */}
                <line
                  x1={PIN_NEWPORT.x - 14} y1={PIN_NEWPORT.y + 2}
                  x2={PIN_NEWPORT.x - 4}  y2={PIN_NEWPORT.y + 2}
                  stroke="var(--color-gold)" strokeWidth="0.6" opacity="0.7"
                />

                {/* hero callout */}
                <g>
                  <text
                    x={PIN_NEWPORT.x - 17}
                    y={PIN_NEWPORT.y - 4}
                    fontSize="11"
                    fontFamily="serif"
                    fill="var(--color-snow)"
                    textAnchor="end"
                    style={{ fontStyle: "italic", letterSpacing: "0.04em" }}
                  >
                    Pelican Hill
                  </text>
                  <text
                    x={PIN_NEWPORT.x - 17}
                    y={PIN_NEWPORT.y + 8}
                    fontSize="7"
                    fontFamily="serif"
                    fill="var(--color-gold)"
                    textAnchor="end"
                    style={{ letterSpacing: "0.32em", textTransform: "uppercase" }}
                  >
                    07 · 14 · 2026
                  </text>
                  <text
                    x={PIN_NEWPORT.x - 17}
                    y={PIN_NEWPORT.y + 18}
                    fontSize="6"
                    fontFamily="serif"
                    fill="var(--color-parchment-mute)"
                    textAnchor="end"
                    style={{ fontStyle: "italic", letterSpacing: "0.18em" }}
                  >
                    Newport Coast, CA
                  </text>
                </g>
              </g>
            </motion.svg>

            {/* Manual zoom controls */}
            <div className="absolute bottom-2 right-2 flex flex-col gap-2 no-print">
              <ZoomBtn onClick={zoomIn} aria-label="Zoom in"><ZoomIn size={14} /></ZoomBtn>
              <ZoomBtn onClick={zoomOut} aria-label="Zoom out"><ZoomOut size={14} /></ZoomBtn>
              <ZoomBtn onClick={reset} aria-label="Reset view"><Maximize2 size={14} /></ZoomBtn>
            </div>

            {/* Stage indicator */}
            <StageDots count={STAGE_COUNT} active={active ? MILESTONES.indexOf(active) : -1} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function ZoomBtn({
  children,
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-8 h-8 inline-flex items-center justify-center rounded-full border border-[var(--color-gold-deep)] bg-[var(--color-ink)]/80 backdrop-blur text-[var(--color-parchment)] hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
      {...rest}
    >
      {children}
    </button>
  );
}

function StageDots({ count, active }: { count: number; active: number }) {
  return (
    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 no-print">
      {Array.from({ length: count - 1 }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-6 rounded-full transition-all duration-500 ${
            i <= active
              ? "bg-[var(--color-gold)]"
              : "bg-[var(--color-parchment-mute)]/30"
          }`}
        />
      ))}
    </div>
  );
}

function LegendDot({ side, label }: { side: "megan" | "kris" | "shared"; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 smallcaps text-[10px] text-[var(--color-parchment-mute)] tracking-widest">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: sideColor(side) }}
      />
      {label}
    </span>
  );
}

function sideColor(side: "megan" | "kris" | "shared") {
  switch (side) {
    case "megan": return "rgb(184, 163, 201)";
    case "kris": return "rgb(193, 75, 106)";
    case "shared": return "rgb(201, 166, 107)";
  }
}

function sideLabel(side: "megan" | "kris" | "shared") {
  switch (side) {
    case "megan": return "Megan";
    case "kris": return "Kris";
    case "shared": return "Together";
  }
}

function boxFor(m: Milestone) {
  return {
    x: clamp(m.x - ZOOM_W / 2, 0, MAP_W - ZOOM_W),
    y: clamp(m.y - ZOOM_H / 2, 0, MAP_H - ZOOM_H),
    w: ZOOM_W,
    h: ZOOM_H,
  };
}
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function easeInOut(t: number) {
  // cubic ease in-out
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** 8-pointed star (compass-rose / heraldry) used for the wedding hero pin. */
function star8(cx: number, cy: number, outer: number, inner: number) {
  const points: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 8) * i - Math.PI / 2;
    points.push(`${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`);
  }
  return `M ${points.join(" L ")} Z`;
}

/** Stylized heart, anchored at (cx, cy) as the bottom point. */
function heartPath(cx: number, cy: number, size: number) {
  const s = size;
  return `M ${cx} ${cy}
    C ${cx - s * 1.4} ${cy - s * 0.8}, ${cx - s * 1.4} ${cy - s * 2.2}, ${cx} ${cy - s * 1.5}
    C ${cx + s * 1.4} ${cy - s * 2.2}, ${cx + s * 1.4} ${cy - s * 0.8}, ${cx} ${cy} Z`;
}

/**
 * California outline — drawn in viewBox 0..400 × 0..620.
 *
 * Path goes clockwise from the NW corner (Crescent City / Oregon border):
 *   1. Across the Oregon border (straight east)
 *   2. South-east down the Nevada border (vertical to Tahoe, then SE)
 *   3. South down the Arizona / Colorado-River border
 *   4. West along the Mexico border to San Diego
 *   5. Up the Pacific coast (curves, with bumps for OC/Newport, LA basin,
 *      Pt Conception, Big Sur, Monterey, SF Bay, Mendocino)
 *   6. Back to the NW corner
 *
 * Coordinates were tuned so the existing milestone pins all sit on or
 * inside the outline:
 *   Eureka       (70,  95)  — on NW coast bend
 *   Irvine       (282, 482) — inland of Newport
 *   Newport      (274, 488) — on the OC bump of the south coast
 *   plus other waypoints between them.
 */
const CA_OUTLINE = `
  M 50 52
  L 188 50
  L 200 90
  L 215 145
  L 232 200
  L 252 250
  L 280 305
  L 308 348
  L 332 388
  L 348 435
  L 354 478
  L 348 498
  L 330 514
  L 308 528
  L 282 540
  L 256 552
  L 232 558
  C 226 545, 240 525, 268 506
  C 286 496, 296 488, 290 478
  C 282 470, 264 472, 248 474
  C 232 472, 220 462, 215 446
  C 210 428, 204 412, 196 396
  C 184 376, 170 358, 162 336
  C 154 314, 148 290, 140 268
  C 132 248, 122 235, 110 232
  C 96 230, 88 222, 88 208
  C 88 192, 95 178, 96 162
  C 96 148, 88 138, 80 130
  C 74 122, 72 112, 72 98
  C 70 84, 66 70, 60 60
  C 56 54, 52 52, 50 52
  Z
`;
