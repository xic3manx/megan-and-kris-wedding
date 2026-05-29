"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calligraphy } from "@/components/Calligraphy";
import { ScrollText, UtensilsCrossed, ImageUp, Images, Mail } from "lucide-react";

const TILES = [
  {
    href: "/itinerary",
    title: "Itinerary",
    blurb: "The day, hour by hour — ceremony, reception, breakfast.",
    Icon: ScrollText,
  },
  {
    href: "/menu",
    title: "Menu",
    blurb: "The Mastro's reception card and Pelican Hill breakfast.",
    Icon: UtensilsCrossed,
  },
  {
    href: "/upload",
    title: "Upload",
    blurb: "Send us your photos and videos from the day.",
    Icon: ImageUp,
  },
  {
    href: "/gallery",
    title: "Gallery",
    blurb: "The keepsake gallery — populated after the wedding.",
    Icon: Images,
  },
  {
    href: "/contact",
    title: "Contact",
    blurb: "Where to reach us — mail, a note, anything thoughtful.",
    Icon: Mail,
  },
] as const;

export default function DirectoryTiles() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8 py-20">
      <div className="text-center mb-14">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          The Directory
        </p>
        <Calligraphy as="h2" className="text-5xl sm:text-6xl text-[var(--color-parchment)]">
          A small map of everything
        </Calligraphy>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {TILES.map((t, i) => (
          <motion.div
            key={t.href}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
          >
            <Link
              href={t.href}
              className="group surface !no-underline block p-7 h-full text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-full border border-[var(--color-gold-deep)] flex items-center justify-center group-hover:border-[var(--color-rose)] group-hover:bg-[var(--color-rose-deep)]/30 transition-all">
                  <t.Icon
                    size={22}
                    className="text-[var(--color-gold)] group-hover:text-[var(--color-parchment)] transition-colors"
                  />
                </div>
              </div>
              <h3 className="font-serif text-2xl text-[var(--color-parchment)] mb-2 group-hover:text-[var(--color-rose-bloom)] transition-colors">
                {t.title}
              </h3>
              <p className="text-sm italic text-[var(--color-parchment-mute)] leading-relaxed">
                {t.blurb}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
