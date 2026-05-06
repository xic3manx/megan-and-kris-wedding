import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import { Snail } from "@/components/Snail";

export default function Footer() {
  return (
    <footer className="no-print mt-32 pb-16 text-center">
      <BotanicalDivider variant="rose" />
      <Calligraphy as="p" className="text-3xl text-[var(--color-parchment)] mb-1">
        Megan &amp; Kris
      </Calligraphy>
      <p className="smallcaps text-[10px] text-[var(--color-parchment-mute)] tracking-[0.3em]">
        Newport Coast · 07.14.2026
      </p>
      <p className="text-xs text-[var(--color-parchment-mute)] mt-6 italic relative inline-block">
        With love and gratitude to those who joined us by the sea.
        {/* hidden snail — drifting just to the right of the gratitude line */}
        <Snail
          id="footer"
          size="sm"
          whisper="two snails, one shell"
          className="absolute -right-12 -top-1"
        />
      </p>
    </footer>
  );
}
