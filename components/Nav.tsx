"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Calligraphy } from "@/components/Calligraphy";
import Countdown from "@/components/Countdown";
import { Snail } from "@/components/Snail";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

const NAV_LINKS = [
  { href: "/itinerary", label: "Itinerary" },
  { href: "/menu", label: "Menu" },
  { href: "/registry", label: "Registry" },
  { href: "/upload", label: "Upload" },
  { href: "/gallery", label: "Gallery" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // hide nav entirely on /login — login page is its own world
  if (pathname === "/login") return null;

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 no-print ${
        scrolled
          ? "backdrop-blur-md bg-[var(--color-ink-deep)]/85 border-b border-[var(--color-gold-deep)]/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-3 flex items-center justify-between gap-6">
        {/* wordmark */}
        <Link href="/" className="!no-underline group flex items-baseline gap-3 leading-none relative">
          <Calligraphy className="text-4xl text-[var(--color-parchment)] group-hover:text-[var(--color-rose-bloom)] transition-colors">
            M&nbsp;&amp;&nbsp;K
          </Calligraphy>
          <span className="hidden sm:inline smallcaps text-sm text-[var(--color-parchment-soft)] tracking-[0.3em]">
            07.14.2026
          </span>
          {/* hidden snail nestled into the wordmark dot */}
          <span
            className="absolute -right-9 top-1"
            onClick={(e) => e.preventDefault()}
          >
            <Snail
              id="nav"
              size="sm"
              whisper="you found me at the door"
            />
          </span>
        </Link>

        {/* live countdown — hidden on small screens */}
        <Countdown variant="compact" className="hidden md:inline-flex" />

        {/* desktop links */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`smallcaps text-xs !no-underline transition-colors ${
                  active
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-parchment-soft)] hover:text-[var(--color-rose-bloom)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* mobile button */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-[var(--color-parchment)] p-2"
        >
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-[var(--color-ink-deep)]/97 backdrop-blur-lg border-b border-[var(--color-gold-deep)]/30">
          <nav className="px-6 py-6 flex flex-col gap-5">
            <Countdown variant="compact" className="md:hidden self-center mb-2" />
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="smallcaps text-base !no-underline text-[var(--color-parchment-soft)] py-1"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
