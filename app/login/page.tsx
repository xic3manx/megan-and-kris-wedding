"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("That password doesn't seem right. Please check the card from the invitation.");
        setPending(false);
        return;
      }
      const next = params.get("next") || "/";
      router.replace(next);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <Calligraphy as="h1" className="text-6xl text-[var(--color-parchment)] mb-2">
        Megan &amp; Kris
      </Calligraphy>
      <p className="smallcaps text-sm text-[var(--color-parchment-mute)] mb-1">
        Newport Coast · July 14, 2026
      </p>

      <BotanicalDivider variant="lavender" className="!my-8" />

      <p className="text-[var(--color-parchment-soft)] mb-8 text-lg leading-relaxed">
        A quiet door. The password is printed on the small card tucked
        inside your invitation.
      </p>

      <form onSubmit={onSubmit} className="space-y-5">
        <input
          type="password"
          autoFocus
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="w-full bg-transparent border-b border-[var(--color-gold-deep)] focus:border-[var(--color-gold)] outline-none text-center text-2xl py-3 text-[var(--color-parchment)] placeholder:text-[var(--color-parchment-mute)] tracking-wider"
        />

        {error && (
          <p role="alert" className="text-[var(--color-rose-bloom)] text-sm">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || password.length === 0}
          className="smallcaps text-sm border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-8 py-3 hover:bg-[var(--color-rose-deep)] hover:border-[var(--color-rose)] transition-colors disabled:opacity-50"
        >
          {pending ? "Unlocking…" : "Enter"}
        </button>
      </form>

      <BotanicalDivider variant="snail" className="!my-12" />

      <p className="smallcaps text-xs text-[var(--color-parchment-mute)]">
        For Megan & Kris's invited guests
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <LoginInner />
    </Suspense>
  );
}
