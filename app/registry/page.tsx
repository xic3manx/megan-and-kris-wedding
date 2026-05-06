import Link from "next/link";
import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import { Snail } from "@/components/Snail";
import { REGISTRY_ITEMS } from "@/data/registry";
import { ExternalLink, Heart } from "lucide-react";

export const metadata = { title: "Registry · Megan & Kris" };

const VENMO = process.env.NEXT_PUBLIC_VENMO_HANDLE || "@megan-kris";
const ZELLE = process.env.NEXT_PUBLIC_ZELLE_EMAIL || "saladikm@gmail.com";

export default function RegistryPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-24">
      <header className="text-center mb-2">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          With Gratitude
        </p>
        <Calligraphy as="h1" className="text-6xl sm:text-7xl text-[var(--color-parchment)]">
          The Registry
        </Calligraphy>
      </header>

      <p className="mt-6 text-center max-w-2xl mx-auto italic text-[var(--color-parchment-soft)] text-lg leading-relaxed">
        Your presence is the gift. Truly. If you'd still like to do something
        kind, two quiet options below.
      </p>

      <BotanicalDivider variant="lavender" />

      {/* Honeymoon fund */}
      <section className="surface p-8 sm:p-12 text-center">
        <Heart className="mx-auto mb-3 text-[var(--color-rose-bloom)]" size={20} />
        <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.4em] mb-3">
          The Honeymoon Fund
        </p>
        <Calligraphy as="h2" className="text-4xl sm:text-5xl text-[var(--color-parchment)] mb-4">
          Bardessono · Tahoe · Zion
        </Calligraphy>
        <p className="max-w-xl mx-auto text-[var(--color-parchment-soft)] leading-relaxed mb-8">
          Three weeks on the road after the wedding — wine country, mountain
          air, then red rock. Anything pooled here becomes a long dinner, a
          slow morning, or a hike we'll thank you for.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 max-w-xl mx-auto">
          <a
            href={`https://venmo.com/u/${VENMO.replace(/^@/, "")}`}
            target="_blank"
            rel="noreferrer"
            className="!no-underline surface p-5 hover:-translate-y-0.5 transition-transform"
          >
            <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.35em] mb-2">
              Venmo
            </p>
            <p className="font-serif text-xl text-[var(--color-parchment)]">{VENMO}</p>
          </a>
          <a
            href={`mailto:${ZELLE}`}
            className="!no-underline surface p-5 hover:-translate-y-0.5 transition-transform"
          >
            <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.35em] mb-2">
              Zelle
            </p>
            <p className="font-serif text-xl text-[var(--color-parchment)]">{ZELLE}</p>
          </a>
        </div>
      </section>

      <BotanicalDivider variant="rose" />

      {/* Curated items */}
      <section>
        <header className="text-center mb-12">
          <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
            A Small List
          </p>
          <Calligraphy as="h2" className="text-4xl sm:text-5xl text-[var(--color-parchment)]">
            For the home we're building
          </Calligraphy>
          <p className="mt-3 italic text-[var(--color-parchment-soft)]">
            Curated, not exhaustive. Tap any item to open in a new tab.
          </p>
        </header>

        <ul className="grid sm:grid-cols-2 gap-5">
          {REGISTRY_ITEMS.map((it) => (
            <li key={it.id}>
              <Link
                href={it.url}
                target="_blank"
                rel="noreferrer"
                className="!no-underline surface p-7 block h-full hover:-translate-y-0.5 transition-transform group"
              >
                <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.35em] mb-3">
                  {it.category}
                </p>
                <h3 className="font-serif text-2xl text-[var(--color-parchment)] mb-1 group-hover:text-[var(--color-rose-bloom)] transition-colors">
                  {it.title}
                </h3>
                {it.brand && (
                  <p className="italic text-sm text-[var(--color-parchment-mute)] mb-3">
                    {it.brand}
                  </p>
                )}
                <p className="text-[var(--color-parchment-soft)] leading-relaxed mb-4">
                  {it.blurb}
                </p>
                <span className="smallcaps text-xs text-[var(--color-gold)] inline-flex items-center gap-1">
                  Open <ExternalLink size={11} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <BotanicalDivider variant="snail" className="!mt-24" />

      <p className="text-center italic text-[var(--color-parchment-soft)] max-w-xl mx-auto relative">
        Truly — please don't feel obligated. Showing up is the whole thing.
        We'll see you on the bluff.
        {/* hidden snail — peeking off the right of the gratitude paragraph */}
        <span className="absolute -right-4 sm:-right-12 top-0 no-print">
          <Snail
            id="registry"
            size="sm"
            whisper="you have already given the gift of finding me"
            color="var(--color-gold)"
            flip
          />
        </span>
      </p>
    </div>
  );
}
