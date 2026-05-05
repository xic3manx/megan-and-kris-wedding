"use client";

import { useEffect, useRef } from "react";

/**
 * Soft lavender halo that follows the cursor on desktop. Grows when
 * over interactive elements (links, buttons). Hidden on touch devices.
 */
export default function CursorHalo() {
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = haloRef.current;
    if (!el) return;

    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) {
      el.style.display = "none";
      return;
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let scale = 1;
    let targetScale = 1;
    let frameId: number;

    function tick() {
      // ease toward target
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      scale += (targetScale - scale) * 0.2;
      if (el) {
        el.style.transform = `translate3d(${x - 22}px, ${y - 22}px, 0) scale(${scale})`;
      }
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);

    function onMove(e: MouseEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }
    function onOver(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, [role='button'], [data-cursor='hover']");
      targetScale = interactive ? 2.4 : 1;
    }
    function onLeave() {
      targetScale = 0;
    }
    function onEnter() {
      targetScale = 1;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={haloRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 h-11 w-11 rounded-full mix-blend-screen"
      style={{
        background:
          "radial-gradient(circle, rgba(184,163,201,0.55) 0%, rgba(193,75,106,0.18) 50%, transparent 70%)",
        transition: "opacity 200ms ease",
      }}
    />
  );
}
