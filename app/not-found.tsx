import Link from "next/link";
import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center relative">
      <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-4">
        Lost in the garden
      </p>
      <Calligraphy as="h1" className="text-7xl text-[var(--color-parchment)] mb-2">
        404
      </Calligraphy>
      <p className="italic text-[var(--color-parchment-soft)] text-lg mt-4">
        This page doesn't exist — perhaps a slow morning detour. The snail
        approves.
      </p>

      {/* The second hidden snail — bigger here, present but quiet */}
      <Snail className="mx-auto my-10" />

      <BotanicalDivider variant="lavender" className="!my-10" />
      <Link
        href="/"
        className="!no-underline smallcaps text-xs border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-6 py-3 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
      >
        Back to the directory
      </Link>
    </div>
  );
}

function Snail({ className = "" }: { className?: string }) {
  return (
    <svg
      width="120"
      height="80"
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[var(--color-gold)] ${className}`}
      aria-hidden="true"
    >
      {/* trail */}
      <path
        d="M5 70 Q 20 65, 35 68"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="2 4"
        opacity="0.5"
      />
      {/* shell — concentric spiral */}
      <circle cx="50" cy="44" r="22" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="50" cy="44" r="16" stroke="currentColor" strokeWidth="0.9" fill="none" />
      <circle cx="50" cy="44" r="10" stroke="currentColor" strokeWidth="0.7" fill="none" />
      <circle cx="50" cy="44" r="5" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="50" cy="44" r="2" fill="currentColor" />
      {/* tiny rose tucked into the shell — pretty Easter egg */}
      <circle cx="50" cy="50" r="2" fill="var(--color-rose)" />
      {/* body */}
      <path
        d="M28 67 Q 50 70, 80 64 L 92 50 Q 100 38, 105 42 Q 108 48, 102 52"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="rgba(201, 166, 107, 0.05)"
      />
      {/* antennae */}
      <line x1="98" y1="46" x2="105" y2="32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <line x1="92" y1="48" x2="95" y2="32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="105" cy="31" r="1.6" fill="currentColor" />
      <circle cx="95" cy="31" r="1.4" fill="currentColor" />
      {/* small lavender sprig the snail is heading toward */}
      <g transform="translate(5 30)">
        <line x1="0" y1="40" x2="0" y2="20" stroke="var(--color-gold-deep)" strokeWidth="0.6" />
        <ellipse cx="-2" cy="22" rx="1.5" ry="1" fill="var(--color-lavender)" />
        <ellipse cx="2" cy="22" rx="1.5" ry="1" fill="var(--color-lavender)" />
        <ellipse cx="-2" cy="26" rx="1.5" ry="1" fill="var(--color-lavender)" />
        <ellipse cx="2" cy="26" rx="1.5" ry="1" fill="var(--color-lavender)" />
      </g>
    </svg>
  );
}
