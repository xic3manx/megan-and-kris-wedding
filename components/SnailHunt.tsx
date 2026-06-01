"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calligraphy } from "@/components/Calligraphy";
import { Snail } from "@/components/Snail";

/**
 * The site's snail hunt. There are six snails hidden across the pages,
 * each with its own whisper. Click one to find it; the discovery floats
 * up as a calligraphy line, the find is persisted to localStorage, and
 * a tiny progress chip appears in the corner. Find them all to unlock
 * a small private card.
 *
 * Bonus: type "snail" anywhere on the site (no input field) to summon
 * the parade — a giant gold snail that crawls across the screen.
 *
 * Implementation notes:
 *   - Storage key `mk_snails_found` holds an array of found ids.
 *   - The total is fixed (TOTAL); a snail can be retired/replaced by
 *     leaving the id in localStorage but updating the placement.
 */

export const SNAIL_IDS = [
  "hero",
  "nav",
  "footer",
  "garden",
  "closing",
  "contact",
  "gallery",
  "itinerary",
  "menu",
  "upload",
  "gather",
  "bluff",
  "ocean",
  "morning",
] as const;
export const TOTAL = SNAIL_IDS.length;
const STORAGE_KEY = "mk_snails_found";
// Reward-seen flag is versioned by TOTAL so adding more snails later
// (or recovering from a stale flag set when the hunt was smaller)
// re-arms the popup. Old keys are left in place and ignored.
const REWARD_SEEN_KEY = `${STORAGE_KEY}_reward_seen_v${TOTAL}`;

type Whisper = { id: string; text: string; key: number };

type Hunt = {
  found: Set<string>;
  reportFind: (id: string, whisper?: string) => void;
};

const Ctx = createContext<Hunt | null>(null);

export function useSnailHunt() {
  return useContext(Ctx);
}

export function SnailHuntProvider({ children }: { children: React.ReactNode }) {
  const [found, setFound] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [whisper, setWhisper] = useState<Whisper | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [parade, setParade] = useState(false);
  const dismissedRewardRef = useRef(false);
  const lastWhisperKey = useRef(0);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? (JSON.parse(raw) as string[]) : [];
      const initial = new Set(
        arr.filter((id) =>
          SNAIL_IDS.includes(id as (typeof SNAIL_IDS)[number])
        )
      );
      setFound(initial);
      const rewardSeen =
        localStorage.getItem(REWARD_SEEN_KEY) === "1";
      dismissedRewardRef.current = rewardSeen;

      // Already at TOTAL on load AND reward not yet seen for this
      // version: fire the celebration. Handles the case where someone
      // completed the hunt before this version of the code shipped.
      if (initial.size === TOTAL && !rewardSeen) {
        setTimeout(() => setShowReward(true), 1500);
      }
    } catch {}
    setHydrated(true);
  }, []);

  const reportFind = useCallback(
    (id: string, whisperText?: string) => {
      setFound((prev) => {
        if (prev.has(id)) {
          // already found — still show the whisper as a small "again" line
          if (whisperText) {
            lastWhisperKey.current += 1;
            setWhisper({ id, text: whisperText, key: lastWhisperKey.current });
          }
          return prev;
        }
        const next = new Set(prev);
        next.add(id);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
        } catch {}
        if (whisperText) {
          lastWhisperKey.current += 1;
          setWhisper({ id, text: whisperText, key: lastWhisperKey.current });
        }
        if (next.size === TOTAL && !dismissedRewardRef.current) {
          setTimeout(() => setShowReward(true), 1100);
        }
        return next;
      });
    },
    []
  );

  // Auto-dismiss whisper after a beat
  useEffect(() => {
    if (!whisper) return;
    const t = setTimeout(() => setWhisper(null), 4200);
    return () => clearTimeout(t);
  }, [whisper]);

  // Konami-style "snail" sequence → trigger parade
  useEffect(() => {
    let buffer = "";
    function onKey(e: KeyboardEvent) {
      // ignore typing in inputs/textareas
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || (t as HTMLElement).isContentEditable)) {
        return;
      }
      if (e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-5);
      if (buffer === "snail") {
        setParade(true);
        buffer = "";
        setTimeout(() => setParade(false), 14000);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function dismissReward() {
    setShowReward(false);
    try {
      localStorage.setItem(REWARD_SEEN_KEY, "1");
    } catch {}
    dismissedRewardRef.current = true;
  }

  const value = useMemo(() => ({ found, reportFind }), [found, reportFind]);

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* persistent collection chip — visible on every page once
          the user is past the login gate. Each slot lights up when
          its snail is found. Once the whole 14 is collected, the
          chip itself becomes a button that replays the reward. */}
      {hydrated && (
        <SnailCollection
          found={found}
          onReplay={() => {
            if (found.size === TOTAL) setShowReward(true);
          }}
        />
      )}

      {/* whisper line that floats up when a snail is clicked */}
      <AnimatePresence>
        {whisper && (
          <motion.div
            key={whisper.key}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none fixed left-1/2 -translate-x-1/2 bottom-[18%] z-[60] text-center"
          >
            <Calligraphy as="p" className="text-3xl sm:text-4xl text-[var(--color-snow)] [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]">
              {whisper.text}
            </Calligraphy>
            <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.4em] mt-2">
              you found a snail
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* find-all reward card */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          >
            <button
              type="button"
              aria-label="dismiss"
              onClick={dismissReward}
              className="absolute inset-0 bg-[var(--color-ink-deep)]/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="surface relative max-w-lg w-full p-8 sm:p-10 text-center max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-center mb-3">
                <Snail size="lg" variant="prominent" color="var(--color-gold)" />
              </div>
              <Calligraphy as="h3" className="text-5xl text-[var(--color-parchment)] mb-2">
                You found them all
              </Calligraphy>
              <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.4em] mb-4">
                {TOTAL} of {TOTAL}
              </p>

              {/* the meme quote */}
              <p className="font-serif italic text-xl sm:text-2xl text-[var(--color-rose-bloom)] mb-4 leading-snug">
                &ldquo;Spectacular — give me 14 of them right now.&rdquo;
              </p>

              {/* Click-to-open poster card. The original upload has
                  embedding disabled by the uploader (YT error 153),
                  so we render a thumbnail + play button that opens
                  the video in a new tab — robust, no embed errors. */}
              <div className="mx-auto mb-2" style={{ maxWidth: 260 }}>
                <a
                  href="https://www.youtube.com/watch?v=o2ACpKW9YjQ"
                  target="_blank"
                  rel="noreferrer"
                  className="!no-underline group relative block w-full overflow-hidden rounded border border-[var(--color-gold-deep)]/40 bg-[var(--color-ink-deep)]"
                  style={{ aspectRatio: "9 / 16" }}
                  aria-label="Watch the original clip on YouTube"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://img.youtube.com/vi/o2ACpKW9YjQ/hqdefault.jpg"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/45 transition-opacity group-hover:from-black/55" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-ink-deep)]/80 backdrop-blur-sm border border-[var(--color-gold)]/70 group-hover:scale-110 transition-transform">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M7 4 L20 12 L7 20 Z" fill="var(--color-gold)" />
                      </svg>
                    </span>
                  </span>
                  <span className="absolute bottom-3 left-0 right-0 text-center smallcaps text-[10px] tracking-[0.25em] text-[var(--color-snow)] [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                    Watch on YouTube
                  </span>
                </a>
                <p className="mt-2 text-[10px] italic text-[var(--color-parchment-mute)]">
                  Original clip — TikTok by{" "}
                  <a
                    href="https://www.tiktok.com/@60somethinglife"
                    target="_blank"
                    rel="noreferrer"
                    className="!text-[var(--color-gold)]"
                  >
                    @60somethinglife
                  </a>
                  .
                </p>
              </div>

              <p className="font-serif italic text-base text-[var(--color-parchment-soft)] leading-relaxed mt-6">
                You found all of Megan's snails. Now you know us a little
                better, thank you for visiting!
              </p>
              <button
                type="button"
                onClick={dismissReward}
                className="mt-6 smallcaps text-xs border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-6 py-3 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
              >
                back to the garden
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* keystroke parade */}
      {parade && <SnailParade />}
    </Ctx.Provider>
  );
}

/**
 * Always-visible collection chip in the bottom-left. Renders one tiny
 * snail glyph per hunt slot — bright gold + glow when found, muted &
 * grey when not. Click expands a compact tooltip-style readout. The
 * chip itself is non-blocking (low z-index, small footprint).
 */
function SnailCollection({
  found,
  onReplay,
}: {
  found: Set<string>;
  onReplay: () => void;
}) {
  const total = SNAIL_IDS.length;
  const complete = found.size === total;

  const interactive = complete
    ? {
        onClick: onReplay,
        role: "button" as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onReplay();
          }
        },
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="no-print fixed bottom-4 right-4 z-40 pointer-events-auto"
    >
      <div
        className={`mk-collection ${
          complete ? "mk-collection--complete" : ""
        }`}
        title={
          complete
            ? "Replay the celebration"
            : `${found.size} of ${total} snails found`
        }
        {...interactive}
      >
        <span className="mk-collection-grid">
          {SNAIL_IDS.map((id) => (
            <span
              key={id}
              className={`mk-collection-slot ${
                found.has(id) ? "mk-collection-slot--found" : ""
              }`}
              aria-label={
                found.has(id) ? `${id} snail found` : `${id} snail not yet found`
              }
            >
              <MiniSnail />
            </span>
          ))}
        </span>
        <span className="mk-collection-count">
          {found.size}
          <span className="mk-collection-slash">/</span>
          {total}
        </span>
      </div>
    </motion.div>
  );
}

function MiniSnail() {
  return (
    <svg
      viewBox="0 0 24 16"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
    >
      {/* shell */}
      <circle cx="8.5" cy="9" r="5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8.5" cy="9" r="2.4" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="8.5" cy="9" r="0.8" fill="currentColor" />
      {/* body & antenna */}
      <path
        d="M3 14 L14 14 L17 11 L18.6 8.6"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="18.6" cy="8.2" r="0.8" fill="currentColor" />
    </svg>
  );
}

function SnailParade() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[8%] z-[55] overflow-hidden">
      <motion.div
        initial={{ x: "-25vw" }}
        animate={{ x: "115vw" }}
        transition={{ duration: 13, ease: "linear" }}
        className="flex items-end gap-4 will-change-transform"
      >
        <div className="flex flex-col items-center">
          <span className="font-serif italic text-[var(--color-gold)] text-lg mb-1 [text-shadow:0_1px_18px_rgba(0,0,0,0.6)]">
            sssslowly to the altar
          </span>
          <Snail size="xl" variant="prominent" color="var(--color-gold)" />
        </div>
      </motion.div>
    </div>
  );
}
