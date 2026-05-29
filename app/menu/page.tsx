import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import PrintButton from "@/components/PrintButton";
import { Snail } from "@/components/Snail";
import { RECEPTION_MENU, BREAKFAST_MENU, type MenuCard } from "@/data/menu";
import { ExternalLink } from "lucide-react";

export const metadata = { title: "Menu · Megan & Kris" };

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 sm:px-8 py-16 sm:py-24">
      <header className="text-center mb-2">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          Food &amp; Drink
        </p>
        <Calligraphy as="h1" className="text-6xl sm:text-7xl text-[var(--color-parchment)]">
          The Menus
        </Calligraphy>
        <p className="mt-4 italic text-[var(--color-parchment-soft)] text-lg">
          The reception, and the morning after.
        </p>
      </header>

      <div className="text-center mt-6 mb-12">
        <PrintButton label="Print menus" />
      </div>

      <Card menu={RECEPTION_MENU} />
      <BotanicalDivider variant="rose" className="!my-20" />
      <Card menu={BREAKFAST_MENU} />

      <BotanicalDivider variant="lavender" className="!my-20" />
      <p className="text-center italic text-[var(--color-parchment-mute)] text-base">
        Final wedding-day selections will be finalized in coordination with
        Mastro's and Pelican Hill closer to the date.
      </p>
      {/* hidden snail — sauntering up the right margin */}
      <div className="mt-6 flex justify-end pr-4 no-print">
        <Snail
          id="menu"
          size="md"
          whisper="savor everything"
          color="var(--color-rose-bloom)"
        />
      </div>
    </div>
  );
}

function Card({ menu }: { menu: MenuCard }) {
  return (
    <article className="surface p-8 sm:p-12">
      <header className="text-center mb-8">
        <p className="smallcaps text-sm text-[var(--color-gold)] tracking-[0.35em] mb-3">
          {menu.date} · {menu.time}
        </p>
        <Calligraphy as="h2" className="text-5xl sm:text-6xl text-[var(--color-parchment)] mb-2">
          {menu.occasion}
        </Calligraphy>
        <p className="font-serif italic text-xl text-[var(--color-parchment-soft)]">
          {menu.venue}
        </p>
        {menu.notes && (
          <p className="mt-5 max-w-xl mx-auto text-base text-[var(--color-parchment-soft)] leading-relaxed">
            {menu.notes}
          </p>
        )}
      </header>

      <span className="hairline mb-10 inline-block" />

      {menu.pdfUrl ? <PdfEmbed url={menu.pdfUrl} /> : null}
      {menu.linkUrl ? (
        <ExternalMenuLink url={menu.linkUrl} label={menu.linkLabel ?? "View menu"} />
      ) : null}
    </article>
  );
}

function PdfEmbed({ url }: { url: string }) {
  return (
    <div className="no-print">
      <div className="relative w-full overflow-hidden rounded border border-[var(--color-gold-deep)]/40 bg-white/95">
        <iframe
          src={`${url}#view=FitH&toolbar=0&navpanes=0`}
          title="Menu PDF"
          className="block w-full"
          style={{ height: "780px" }}
          loading="lazy"
        />
      </div>
      <p className="mt-4 text-center text-sm italic text-[var(--color-parchment-mute)]">
        Trouble viewing?{" "}
        <a href={url} target="_blank" rel="noreferrer" className="!text-[var(--color-gold)]">
          Open the PDF in a new tab
        </a>
        .
      </p>
    </div>
  );
}

function ExternalMenuLink({ url, label }: { url: string; label: string }) {
  return (
    <div className="text-center no-print">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="!no-underline smallcaps text-sm inline-flex items-center gap-3 border border-[var(--color-gold)] text-[var(--color-parchment)] px-8 py-4 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors tracking-widest"
      >
        {label}
        <ExternalLink size={13} className="opacity-70" />
      </a>
    </div>
  );
}
