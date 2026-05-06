import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import PrintButton from "@/components/PrintButton";
import { Snail } from "@/components/Snail";
import { RECEPTION_MENU, BREAKFAST_MENU, type MenuCard } from "@/data/menu";

export const metadata = { title: "Menu · Megan & Kris" };

export default function MenuPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24">
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
        Final courses set in coordination with Mastro's and Pelican Hill,
        approximately one week before the wedding.
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
      <header className="text-center mb-10">
        <p className="smallcaps text-sm text-[var(--color-gold)] tracking-[0.35em] mb-3">
          {menu.date} · {menu.time}
        </p>
        <Calligraphy as="h2" className="text-5xl sm:text-6xl text-[var(--color-parchment)] mb-2">
          {menu.occasion}
        </Calligraphy>
        <p className="font-serif italic text-xl text-[var(--color-parchment-soft)]">
          {menu.venue}
        </p>
      </header>

      {menu.sections.map((sec, i) => (
        <section key={sec.title} className="mb-12">
          {i > 0 && <span className="hairline mb-10 inline-block" />}
          <h3 className="font-serif text-3xl sm:text-4xl text-[var(--color-rose-bloom)] mb-3 text-center">
            {sec.title}
          </h3>
          {sec.description && (
            <p className="text-center italic text-base text-[var(--color-parchment-mute)] mb-6">
              {sec.description}
            </p>
          )}
          <ul className="space-y-6">
            {sec.items.map((it) => (
              <li key={it.name} className="text-center">
                <p className="font-serif text-2xl sm:text-3xl text-[var(--color-parchment)]">{it.name}</p>
                {it.description && (
                  <p className="italic text-base text-[var(--color-parchment-soft)] mt-2">
                    {it.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      {menu.wines && menu.wines.length > 0 && (
        <section className="mt-14">
          <span className="hairline mb-10 inline-block" />
          <h3 className="font-serif text-3xl sm:text-4xl text-[var(--color-rose-bloom)] mb-6 text-center">
            From the Glass
          </h3>
          <ul className="space-y-4">
            {menu.wines.map((w) => (
              <li key={w.name} className="text-center">
                <p className="font-serif text-xl sm:text-2xl text-[var(--color-parchment)]">{w.name}</p>
                {w.description && (
                  <p className="italic text-base text-[var(--color-parchment-soft)]">
                    {w.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {menu.notes && (
        <p className="mt-12 text-center text-sm italic text-[var(--color-parchment-mute)] leading-relaxed">
          {menu.notes}
        </p>
      )}
    </article>
  );
}
