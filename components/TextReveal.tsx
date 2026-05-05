"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import clsx from "clsx";

/**
 * Splits a string into characters and animates each one in on scroll
 * into view. Used for hero names, page titles, and section headings.
 *
 * Handles whitespace by mapping spaces to non-breaking spaces so the
 * layout is preserved; words don't break across animation boundaries.
 */
export default function TextReveal({
  children,
  as: Tag = "span",
  className,
  delay = 0,
  stagger = 0.04,
}: {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  // Split into words to keep them from line-wrapping mid-character
  const words = children.split(" ");

  return (
    <Tag className={clsx("inline-block", className)} aria-label={children}>
      {words.map((word, wIdx) => (
        <span key={`${word}-${wIdx}`} className="inline-block whitespace-nowrap" aria-hidden="true">
          {Array.from(word).map((ch, cIdx) => (
            <motion.span
              key={`${ch}-${cIdx}`}
              className="inline-block"
              initial={{ y: "0.7em", opacity: 0, rotate: 6 }}
              whileInView={{ y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.9,
                delay: delay + (wIdx * 4 + cIdx) * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {ch}
            </motion.span>
          ))}
          {wIdx < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
