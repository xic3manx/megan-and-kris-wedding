import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import PrintButton from "@/components/PrintButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Snail } from "@/components/Snail";
import { STOPS } from "@/data/itinerary";
import { STAY, EAT, SEE, type TravelItem } from "@/data/travel";
import { MapPin, ExternalLink, BedDouble, UtensilsCrossed, Mountain } from "lucide-react";

export const metadata = { title: "Itinerary · Megan & Kris" };

/**
 * Each stop's timeline bead is a clickable hunt snail. The id matches
 * one of SNAIL_IDS in components/SnailHunt.tsx — change those in lockstep.
 */
const STOP_SNAILS: Record<string, { id: string; whisper: string }> = {
  welcome:   { id: "gather",  whisper: "first to arrive" },
  ceremony:  { id: "bluff",   whisper: "above the long blue" },
  reception: { id: "ocean",   whisper: "candlelight and oysters" },
  breakfast: { id: "morning", whisper: "good morning" },
};

export default function ItineraryPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-16 sm:py-24">
      <header className="text-center mb-4">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          The Day, Hour by Hour
        </p>
        <Calligraphy as="h1" className="text-6xl sm:text-7xl text-[var(--color-parchment)]">
          Itinerary
        </Calligraphy>
        <p className="mt-4 italic text-[var(--color-parchment-soft)] text-lg">
          July 14–15, 2026 · Newport Coast, California
        </p>
      </header>

      <div className="text-center mb-12">
        <PrintButton label="Print itinerary" />
      </div>

      <BotanicalDivider variant="lavender" />

      {/* timeline */}
      <ol className="relative space-y-20">
        {/* vertical rule, hidden in print */}
        <span
          aria-hidden="true"
          className="no-print absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-gold-deep)]/60 to-transparent hidden md:block -translate-x-1/2"
        />

        {STOPS.map((s, i) => {
          const beadSnail = STOP_SNAILS[s.id];
          return (
          <li key={s.id} className="relative">
            {/* center bead — was a gold diamond, now a hunt snail
                so guests can find it from the timeline. Same id is
                also rendered inline on mobile (where the timeline
                column is hidden). */}
            {beadSnail ? (
              <span className="no-print hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 z-10 items-center justify-center">
                <Snail
                  id={beadSnail.id}
                  whisper={beadSnail.whisper}
                  size="sm"
                  color="var(--color-gold)"
                />
              </span>
            ) : (
              <span
                aria-hidden="true"
                className="no-print hidden md:block absolute left-1/2 top-8 -translate-x-1/2 z-10"
              >
                <span className="block w-3 h-3 rotate-45 bg-[var(--color-gold)] border border-[var(--color-snow)]" />
              </span>
            )}

            {/* mobile-only bead snail at top of each stop card */}
            {beadSnail && (
              <div className="md:hidden flex justify-center mb-4 no-print">
                <Snail
                  id={beadSnail.id}
                  whisper={beadSnail.whisper}
                  size="sm"
                  color="var(--color-gold)"
                />
              </div>
            )}

            <article
              className={`grid md:grid-cols-2 gap-8 items-center ${
                i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
              }`}
            >
              {/* image side — graceful fallback */}
              <div className="surface aspect-[4/3] relative overflow-hidden">
                {s.image ? (
                  <ImageWithFallback
                    src={s.image}
                    alt={s.venue}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null}
                <PlaceholderArt label={s.title} />
              </div>

              {/* text side */}
              <div className={i % 2 === 0 ? "md:pl-8" : "md:pr-8"}>
                <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.35em] mb-2">
                  {s.date}
                </p>
                <Calligraphy as="h2" className="text-4xl sm:text-5xl text-[var(--color-parchment)] mb-1">
                  {s.title}
                </Calligraphy>
                <p className="font-serif italic text-2xl text-[var(--color-rose-bloom)] mb-4">
                  {s.time}
                </p>
                <p className="font-serif text-xl text-[var(--color-parchment)] mb-1">
                  {s.venue}
                </p>
                <p className="text-sm text-[var(--color-parchment-mute)] mb-4">
                  {s.address}
                </p>
                <p className="text-[var(--color-parchment-soft)] leading-relaxed mb-5">
                  {s.blurb}
                </p>
                {s.attire && (
                  <p className="text-sm italic text-[var(--color-parchment-mute)] mb-5">
                    {s.attire}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 no-print">
                  <a
                    href={s.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="!no-underline smallcaps text-xs inline-flex items-center gap-2 border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-4 py-2 hover:bg-[var(--color-rose-deep)]/30 hover:border-[var(--color-rose)] transition-colors"
                  >
                    <MapPin size={13} /> Open in Maps
                  </a>
                  {s.websiteUrl && (
                    <a
                      href={s.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="!no-underline smallcaps text-xs inline-flex items-center gap-2 text-[var(--color-parchment-soft)] hover:text-[var(--color-rose-bloom)] transition-colors px-2 py-2"
                    >
                      Venue website <ExternalLink size={12} />
                    </a>
                  )}
                </div>

              </div>
            </article>
          </li>
        );
        })}
      </ol>

      <BotanicalDivider variant="rose" className="!mt-24" />

      {/* Travel guide — short, self-checkout style */}
      <section className="mt-4">
        <header className="text-center mb-12">
          <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
            While You're Here
          </p>
          <Calligraphy as="h2" className="text-5xl sm:text-6xl text-[var(--color-parchment)] mb-3">
            A small Newport guide
          </Calligraphy>
          <p className="max-w-2xl mx-auto italic text-[var(--color-parchment-soft)]">
            A short list — somewhere to sleep, somewhere to eat, somewhere to
            wander. Pick what suits you.
          </p>
        </header>

        <TravelGroup
          icon={<BedDouble size={20} />}
          eyebrow="Where to Stay"
          label="Marriott options sized by proximity"
          items={STAY}
        />
        <TravelGroup
          icon={<UtensilsCrossed size={20} />}
          eyebrow="Where to Eat"
          label="A handful of our favorites"
          items={EAT}
          className="mt-16"
        />
        <TravelGroup
          icon={<Mountain size={20} />}
          eyebrow="What to Do"
          label="For an afternoon away from the wedding"
          items={SEE}
          className="mt-16"
        />
      </section>

      {/* hidden snail — meandering off the bottom of the guide */}
      <div className="mt-16 flex justify-center no-print">
        <Snail
          id="itinerary"
          size="md"
          whisper="no need to hurry"
          color="var(--color-lavender)"
        />
      </div>
    </div>
  );
}

function TravelGroup({
  icon,
  eyebrow,
  label,
  items,
  className = "",
}: {
  icon: React.ReactNode;
  eyebrow: string;
  label: string;
  items: TravelItem[];
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex items-center justify-center gap-3 mb-2 text-[var(--color-gold)]">
        {icon}
        <p className="smallcaps text-xs tracking-[0.4em]">{eyebrow}</p>
      </div>
      <p className="text-center italic text-[var(--color-parchment-mute)] mb-8">
        {label}
      </p>
      <ul className="grid sm:grid-cols-2 gap-5">
        {items.map((it) => (
          <li key={it.name} className="surface p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-serif text-2xl text-[var(--color-parchment)] leading-tight">
                {it.name}
              </h3>
              {it.tag && (
                <span className="flex-none smallcaps text-[9px] tracking-[0.25em] text-[var(--color-rose-bloom)] mt-1.5">
                  {it.tag}
                </span>
              )}
            </div>
            <p className="text-[var(--color-parchment-soft)] leading-relaxed mb-3">
              {it.blurb}
            </p>
            {it.address && (
              <p className="text-sm italic text-[var(--color-parchment-mute)] mb-4">
                {it.address}
              </p>
            )}
            <div className="mt-auto flex flex-wrap gap-3 no-print">
              {it.mapUrl && (
                <a
                  href={it.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="!no-underline smallcaps text-[10px] inline-flex items-center gap-1.5 border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-3 py-1.5 hover:bg-[var(--color-rose-deep)]/30 hover:border-[var(--color-rose)] transition-colors tracking-widest"
                >
                  <MapPin size={11} /> Maps
                </a>
              )}
              {it.websiteUrl && (
                <a
                  href={it.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="!no-underline smallcaps text-[10px] inline-flex items-center gap-1.5 text-[var(--color-parchment-soft)] hover:text-[var(--color-rose-bloom)] transition-colors px-2 py-1.5 tracking-widest"
                >
                  Website <ExternalLink size={10} />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PlaceholderArt({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 -z-10 flex items-center justify-center bg-gradient-to-br from-[var(--color-ink-soft)] via-[var(--color-ink)] to-[var(--color-rose-deep)]/30">
      <svg
        viewBox="0 0 200 150"
        className="w-2/3 opacity-30"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M10 130 Q 50 70, 100 100 T 190 90"
          stroke="var(--color-gold)"
          strokeWidth="1.2"
        />
        <circle cx="100" cy="55" r="14" fill="none" stroke="var(--color-lavender)" strokeWidth="0.8" />
        <path d="M70 50 Q100 35 130 50" stroke="var(--color-rose)" strokeWidth="0.8" />
      </svg>
      <span className="absolute bottom-3 right-4 smallcaps text-[10px] text-[var(--color-parchment-mute)] tracking-widest">
        {label}
      </span>
    </div>
  );
}
