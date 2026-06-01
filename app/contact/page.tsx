import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import { MapPin } from "lucide-react";

export const metadata = { title: "Contact · Megan & Kris" };

const MAIL_ADDRESS = [
  "Megan & Kris",
  "565 Anton Blvd, Unit 2325",
  "Costa Mesa, CA 92626",
];
const MAP_QUERY =
  "https://maps.apple.com/?q=565+Anton+Blvd+%232325,+Costa+Mesa,+CA+92626";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24 text-center">
      <header>
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          Reaching Us
        </p>
        <Calligraphy as="h1" className="text-6xl sm:text-7xl text-[var(--color-parchment)]">
          Contact
        </Calligraphy>
        <p className="mt-4 italic text-[var(--color-parchment-soft)] text-lg">
          Where to send a note, a card, or a heavy box of something thoughtful.
        </p>
      </header>

      <BotanicalDivider variant="lavender" />

      <section className="surface p-10 sm:p-14">
        <MapPin className="mx-auto mb-5 text-[var(--color-gold)]" size={26} />
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-4">
          Mailing Address
        </p>

        <address className="not-italic font-serif text-2xl sm:text-3xl text-[var(--color-parchment)] leading-tight space-y-1">
          {MAIL_ADDRESS.map((line) => (
            <div key={line}>{line}</div>
          ))}
        </address>

        <div className="mt-8">
          <a
            href={MAP_QUERY}
            target="_blank"
            rel="noreferrer"
            className="!no-underline smallcaps text-xs inline-flex items-center gap-2 border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-6 py-3 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors tracking-widest"
          >
            <MapPin size={13} /> Open in Maps
          </a>
        </div>
      </section>

      <BotanicalDivider variant="rose" />

      <p className="text-center italic text-[var(--color-parchment-soft)] max-w-xl mx-auto text-lg">
        Or just call us. You know how.
      </p>
    </div>
  );
}
