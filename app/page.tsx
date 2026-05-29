import Hero from "@/components/Hero";
import DirectoryTiles from "@/components/DirectoryTiles";
import BotanicalDivider from "@/components/BotanicalDivider";
import BrideGroomTracker from "@/components/BrideGroomTracker";
import { Calligraphy } from "@/components/Calligraphy";
import TextReveal from "@/components/TextReveal";

export default function Home() {
  return (
    <>
      <Hero />
      <BotanicalDivider variant="lavender" />
      <DirectoryTiles />
      <BotanicalDivider variant="rose" />

      {/* Bride & Groom tracker — sticky-scroll cinematic.
          The component manages its own section height; we just give
          it a header above to set the mood. */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-20 text-center">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          The Long Road Here
        </p>
        <Calligraphy as="h2" className="text-5xl sm:text-6xl text-[var(--color-parchment)] mb-4">
          <TextReveal>Two paths, one place</TextReveal>
        </Calligraphy>
        <p className="max-w-2xl mx-auto italic text-[var(--color-parchment-soft)] leading-relaxed">
          Scroll to trace the road each of us took to land here together.
        </p>
      </div>

      <BrideGroomTracker />

      <BotanicalDivider variant="snail" />

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <Calligraphy as="p" className="text-4xl sm:text-5xl text-[var(--color-parchment)] mb-6 leading-tight">
          <TextReveal>We can't wait to see you.</TextReveal>
        </Calligraphy>
        <p className="text-[var(--color-parchment-soft)] italic text-lg leading-relaxed">
          A quiet villa above the Pacific, the long blue afternoon, dinner
          at Mastro's by the dark water, and breakfast in the morning before
          everyone scatters. Come hungry and bring stories.
        </p>
      </section>
    </>
  );
}
