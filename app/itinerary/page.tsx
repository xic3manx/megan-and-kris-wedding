import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import PrintButton from "@/components/PrintButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Snail } from "@/components/Snail";
import { STOPS } from "@/data/itinerary";
import { MapPin, ExternalLink } from "lucide-react";

export const metadata = { title: "Itinerary · Megan & Kris" };

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

        {STOPS.map((s, i) => (
          <li key={s.id} className="relative">
            {/* center bead */}
            <span
              aria-hidden="true"
              className="no-print hidden md:block absolute left-1/2 top-8 -translate-x-1/2 z-10"
            >
              <span className="block w-3 h-3 rotate-45 bg-[var(--color-gold)] border border-[var(--color-snow)]" />
            </span>

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
        ))}
      </ol>

      <BotanicalDivider variant="rose" className="!mt-24" />

      <p className="text-center italic text-[var(--color-parchment-soft)] max-w-2xl mx-auto text-lg">
        Travel notes, hotel suggestions, and a full Newport Coast logistics
        kit will land here as we get closer to the date.
      </p>
      {/* hidden snail — meandering off the closing line */}
      <div className="mt-8 flex justify-center no-print">
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
