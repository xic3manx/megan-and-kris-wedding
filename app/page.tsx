import Hero from "@/components/Hero";
import DirectoryTiles from "@/components/DirectoryTiles";
import BotanicalDivider from "@/components/BotanicalDivider";
import CaliforniaMapLoader from "@/components/CaliforniaMapLoader";
import { Calligraphy } from "@/components/Calligraphy";
import TextReveal from "@/components/TextReveal";
import { Snail } from "@/components/Snail"; // closing snail

export default function Home() {
  return (
    <>
      <Hero />
      <BotanicalDivider variant="lavender" />
      <DirectoryTiles />
      <BotanicalDivider variant="rose" />

      {/* Journey map — Leaflet over Carto Dark Matter tiles, with
          California outlined and our two routes converging on
          Pelican Hill. */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 text-center">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          The Long Road Here
        </p>
        <Calligraphy as="h2" className="text-5xl sm:text-6xl text-[var(--color-parchment)] mb-4">
          <TextReveal>Two paths, one place</TextReveal>
        </Calligraphy>
        <p className="max-w-2xl mx-auto italic text-[var(--color-parchment-soft)] leading-relaxed mb-10">
          Megan from the north coast, Kris from OC — meeting at Pelican Hill
          on the fourteenth of July.
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <CaliforniaMapLoader />
      </div>

      <BotanicalDivider
        variant="snail"
        snailId="garden"
        snailWhisper="from between the lines"
      />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Calligraphy as="p" className="text-4xl sm:text-5xl text-[var(--color-parchment)] mb-6 leading-tight">
          <TextReveal>We can't wait to see you.</TextReveal>
        </Calligraphy>
        <p className="text-[var(--color-parchment-soft)] italic text-lg leading-relaxed">
          A quiet villa above the Pacific, the long blue afternoon, dinner
          at Mastro's by the dark water, and breakfast in the morning before
          everyone scatters. Come hungry and bring stories.
        </p>
        {/* closing snail */}
        <div className="mt-10 flex justify-center no-print">
          <Snail
            id="closing"
            size="sm"
            whisper="see you on the bluff"
            color="var(--color-rose-bloom)"
          />
        </div>
      </section>
    </>
  );
}
