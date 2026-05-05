import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import { Camera, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Gallery · Megan & Kris" };

const SECTIONS = [
  { id: "pre", title: "Pre-Wedding", blurb: "Engagement, the days before, getting ready." },
  { id: "ceremony", title: "Ceremony", blurb: "Noon at Pelican Hill, the words, the rings." },
  { id: "reception", title: "Reception", blurb: "Mastro's by candlelight." },
  { id: "breakfast", title: "Breakfast", blurb: "The morning after, slow goodbyes." },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
      <header className="text-center">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          A Keepsake
        </p>
        <Calligraphy as="h1" className="text-6xl sm:text-7xl text-[var(--color-parchment)]">
          The Gallery
        </Calligraphy>
        <p className="mt-4 italic text-[var(--color-parchment-soft)] text-lg max-w-2xl mx-auto">
          The keepsake gallery will live here once the photographer's
          deliverables and your group uploads come in. Until then, an empty
          frame for everything that's about to happen.
        </p>
      </header>

      <BotanicalDivider variant="lavender" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SECTIONS.map((s) => (
          <article key={s.id} className="surface aspect-[4/3] flex flex-col items-center justify-center text-center p-10 relative overflow-hidden">
            <Clock className="text-[var(--color-gold-deep)] mb-4 opacity-60" size={22} />
            <Calligraphy as="h2" className="text-4xl text-[var(--color-parchment)] mb-2">
              {s.title}
            </Calligraphy>
            <p className="italic text-[var(--color-parchment-mute)] text-sm max-w-xs">
              {s.blurb}
            </p>
            <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.35em] mt-6">
              Coming soon · post-wedding
            </p>

            {/* faint botanical illustration in the background */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="absolute -bottom-10 -right-10 w-44 opacity-10"
              fill="none"
            >
              <path d="M30 170 Q90 120 170 30" stroke="var(--color-lavender)" strokeWidth="1" />
              <circle cx="170" cy="30" r="6" fill="var(--color-rose)" />
              <circle cx="120" cy="80" r="3" fill="var(--color-lavender)" />
              <circle cx="80" cy="130" r="3" fill="var(--color-lavender)" />
            </svg>
          </article>
        ))}
      </div>

      <BotanicalDivider variant="rose" className="!my-20" />

      <section className="text-center">
        <Camera className="mx-auto mb-4 text-[var(--color-gold)]" size={26} />
        <Calligraphy as="h2" className="text-4xl text-[var(--color-parchment)] mb-3">
          Your photos go here, too
        </Calligraphy>
        <p className="max-w-xl mx-auto italic text-[var(--color-parchment-soft)] mb-6">
          Anything you upload to the shared folder will be threaded into these
          albums after the wedding.
        </p>
        <Link
          href="/upload"
          className="!no-underline smallcaps text-xs inline-flex items-center gap-2 border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-6 py-3 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
        >
          Go to upload
        </Link>
      </section>
    </div>
  );
}
