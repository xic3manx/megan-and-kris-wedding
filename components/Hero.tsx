"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Calligraphy } from "@/components/Calligraphy";
import Countdown from "@/components/Countdown";
import TextReveal from "@/components/TextReveal";
import { Snail } from "@/components/Snail";
import { PRETTY_DATE } from "@/lib/wedding-date";

/**
 * Home hero — calligraphy names, date, ceremony location, live countdown.
 * Adds parallax on scroll: background, names, and flourishes drift at
 * different rates for an immersive opening shot.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 220]);
  const yName = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -80]);
  const yFlourish = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.2]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden min-h-[110vh]">
      {/* Background hero image — falls back gracefully to gradient if missing */}
      <motion.div
        aria-hidden="true"
        style={{ y: yBg }}
        className="absolute inset-0 -z-10 bg-cover bg-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(7,5,7,0.55) 0%, rgba(7,5,7,0.85) 50%, rgba(15,11,16,1) 100%), url('/images/couple/hero.jpg')",
          }}
        />
      </motion.div>

      {/* Top flourish, parallax */}
      <motion.div style={{ y: yFlourish, opacity }}>
        <FlourishTop />
      </motion.div>

      <motion.div
        style={{ y: yName, opacity }}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-28 sm:pt-36 pb-32 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="smallcaps text-xs sm:text-sm text-[var(--color-gold)] tracking-[0.4em] mb-8"
        >
          The wedding of
        </motion.p>

        <Calligraphy
          as="h1"
          className="text-7xl sm:text-9xl md:text-[10rem] leading-[0.95] text-[var(--color-parchment)]"
        >
          <TextReveal as="span" delay={0.3} stagger={0.07}>
            Megan
          </TextReveal>
        </Calligraphy>

        <motion.p
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif italic text-3xl sm:text-5xl text-[var(--color-rose-bloom)] my-2 sm:my-4"
        >
          &amp;
        </motion.p>

        <Calligraphy
          as="h1"
          className="text-7xl sm:text-9xl md:text-[10rem] leading-[0.95] text-[var(--color-parchment)]"
        >
          <TextReveal as="span" delay={1.3} stagger={0.07}>
            Kris
          </TextReveal>
        </Calligraphy>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="mt-10 sm:mt-14 flex flex-col items-center gap-2"
        >
          <p className="smallcaps text-sm sm:text-base text-[var(--color-parchment-soft)] tracking-[0.3em]">
            {PRETTY_DATE}
          </p>
          <p className="text-[var(--color-parchment-mute)] italic text-base sm:text-lg">
            The Resort at Pelican Hill · Newport Coast, California
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-16 sm:mt-20 max-w-2xl mx-auto"
        >
          <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-4">
            until we say I do
          </p>
          <Countdown variant="full" />
        </motion.div>

        <FlourishBottom />

        {/* hidden snail — drifting along below the bottom flourish */}
        <div className="mt-3 flex justify-center">
          <Snail
            id="hero"
            size="sm"
            whisper="the slow beginning"
            color="var(--color-lavender)"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.6 }}
          className="mt-20 flex flex-col items-center gap-2 smallcaps text-[10px] text-[var(--color-parchment-mute)] tracking-[0.4em]"
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block h-6 w-px bg-[var(--color-gold)]"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FlourishTop() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 60"
      className="absolute top-8 left-1/2 -translate-x-1/2 w-[300px] sm:w-[420px] z-10 opacity-80"
      fill="none"
    >
      <motion.path
        d="M30 30 Q150 10 295 30 Q300 14 305 30 Q450 50 570 30"
        stroke="var(--color-gold)"
        strokeWidth="0.7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />
      <motion.circle
        cx="300" cy="30" r="2.5" fill="var(--color-gold)"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4 }}
      />
      <motion.circle
        cx="295" cy="30" r="1" fill="var(--color-rose-bloom)"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }}
      />
      <motion.circle
        cx="305" cy="30" r="1" fill="var(--color-lavender)"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5 }}
      />
    </svg>
  );
}

function FlourishBottom() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 40"
      className="mt-20 mx-auto w-32 opacity-70"
      fill="none"
    >
      <motion.path
        d="M10 20 Q60 8 100 20 Q140 32 190 20"
        stroke="var(--color-gold)"
        strokeWidth="0.6"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
      />
      <circle cx="100" cy="20" r="2" fill="var(--color-rose)" />
      <path
        d="M100 12 Q98 8 96 12 M100 12 Q102 8 104 12"
        stroke="var(--color-lavender)"
        strokeWidth="0.6"
      />
    </svg>
  );
}
