import type { Metadata } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CursorHalo from "@/components/CursorHalo";
import PageTransition from "@/components/PageTransition";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://meganandkris.com"
  ),
  title: "Megan & Kris — July 14, 2026",
  description: "The wedding of Megan & Kris Saladin. Newport Coast, California.",
  robots: { index: false, follow: false, nocache: true, noarchive: true },
  openGraph: {
    title: "Megan & Kris — July 14, 2026",
    description: "The wedding of Megan & Kris Saladin.",
    images: ["/images/couple/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${pinyon.variable}`}>
      <body className="relative overflow-x-hidden">
        <SmoothScroll />
        <CursorHalo />
        <div className="relative z-10 flex min-h-dvh flex-col">
          <Nav />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
