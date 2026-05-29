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

      {/* tiny progress chip — shows up after first find */}
      {hydrated && found.size > 0 && found.size < TOTAL && (
        <ProgressChip count={found.size} total={TOTAL} />
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
              className="surface relative max-w-lg w-full p-10 text-center"
            >
              <div className="flex justify-center mb-4">
                <Snail size="lg" variant="prominent" color="var(--color-gold)" />
              </div>
              <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-2">
                Six of six
              </p>
              <Calligraphy as="h3" className="text-5xl text-[var(--color-parchment)] mb-4">
                You found them all
              </Calligraphy>
              <p className="font-serif italic text-lg text-[var(--color-parchment-soft)] leading-relaxed mb-2">
                Slow as we are, we always come home to each other.
                <br />
                Thank you for paying attention.
              </p>
              <p className="font-serif text-base text-[var(--color-rose-bloom)] mt-4">— M &amp; K</p>
              <button
                type="button"
                onClick={dismissReward}
                className="mt-8 smallcaps text-xs border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-6 py-3 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
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

function ProgressChip({ count, total }: { count: number; total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="no-print fixed bottom-4 left-4 z-40 pointer-events-none"
    >
      <div
        className="flex items-center gap-2 rounded-full border border-[var(--color-gold-deep)]/60 bg-[var(--color-ink-deep)]/85 backdrop-blur px-3 py-1.5"
        title={`${count} of ${total} snails found`}
      >
        <span className="block w-5 h-3" style={{ color: "var(--color-gold)" }}>
          <Snail size="xs" variant="prominent" color="var(--color-gold)" />
        </span>
        <span className="smallcaps text-[9px] text-[var(--color-parchment-soft)] tracking-[0.3em] tabular-nums">
          {count} / {total}
        </span>
      </div>
    </motion.div>
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
