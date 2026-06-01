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
  "itinerary",
  "menu",
  "upload",
  "garden",
  "directory",
  "closing",
  "contact",
  "gallery",
  "bluff",
  "ocean",
  "compass",
] as const;
export const TOTAL = SNAIL_IDS.length;
const STORAGE_KEY = "mk_snails_found";

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
      setFound(new Set(arr.filter((id) => SNAIL_IDS.includes(id as (typeof SNAIL_IDS)[number]))));
      const rewardSeen = localStorage.getItem(STORAGE_KEY + "_reward_seen") === "1";
      dismissedRewardRef.current = rewardSeen;
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
      localStorage.setItem(STORAGE_KEY + "_reward_seen", "1");
    } catch {}
    dismissedRewardRef.current = true;
  }

  const value = useMemo(() => ({ found, reportFind }), [found, reportFind]);

  return (
    <Ctx.Provider value={value}>
      {children}

      {/* persistent collection chip — visible on every page once
          the user is past the login gate. Each slot lights up when
          its snail is found. */}
      {hydrated && <SnailCollection found={found} />}

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

              {/* embedded original clip — TikTok by @60somethinglife,
                  reposted to YouTube — link in the figcaption below. */}
              <div className="mx-auto mb-2" style={{ maxWidth: 260 }}>
                <div
                  className="relative w-full rounded overflow-hidden border border-[var(--color-gold-deep)]/40"
                  style={{ aspectRatio: "9 / 16" }}
                >
                  <iframe
                    src="https://www.youtube.com/embed/o2ACpKW9YjQ"
                    title="Spectacular give me 14 of them right now — original clip"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="mt-2 text-[10px] italic text-[var(--color-parchment-mute)]">
                  Original clip from{" "}
                  <a
                    href="https://www.youtube.com/watch?v=o2ACpKW9YjQ"
                    target="_blank"
                    rel="noreferrer"
                    className="!text-[var(--color-gold)]"
                  >
                    @60somethinglife on TikTok
                  </a>
                  .
                </p>
              </div>

              <p className="font-serif italic text-base text-[var(--color-parchment-soft)] leading-relaxed mt-6 mb-1">
                Slow as we are, we always come home to each other.
                <br />
                Thank you for paying attention.
              </p>
              <p className="font-serif text-base text-[var(--color-rose-bloom)] mt-3">
                — M &amp; K
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
function SnailCollection({ found }: { found: Set<string> }) {
  const total = SNAIL_IDS.length;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="no-print fixed bottom-4 right-4 z-40 pointer-events-auto"
    >
      <div
        className="mk-collection"
        title={`${found.size} of ${total} snails found`}
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
