"use client";

import { Printer } from "lucide-react";

export default function PrintButton({ label = "Print" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print smallcaps text-xs inline-flex items-center gap-2 border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-5 py-2 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
    >
      <Printer size={14} />
      {label}
    </button>
  );
}
