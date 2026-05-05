import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import { Camera, ImageUp, ExternalLink } from "lucide-react";

export const metadata = { title: "Upload Photos & Videos · Megan & Kris" };

const UPLOAD_URL =
  process.env.NEXT_PUBLIC_PHOTO_UPLOAD_URL ||
  "https://drive.google.com/your-request-files-link-here";

export default function UploadPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24 text-center">
      <header>
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          The Group Camera Roll
        </p>
        <Calligraphy as="h1" className="text-6xl sm:text-7xl text-[var(--color-parchment)]">
          Upload
        </Calligraphy>
        <p className="mt-4 italic text-[var(--color-parchment-soft)] text-lg">
          Send us your photos and videos from the day.
        </p>
      </header>

      <BotanicalDivider variant="lavender" />

      <section className="surface p-10 sm:p-14">
        <Camera className="mx-auto mb-6 text-[var(--color-gold)]" size={32} />

        <Calligraphy as="h2" className="text-4xl text-[var(--color-parchment)] mb-4">
          Drop a few in our shared folder
        </Calligraphy>

        <p className="max-w-xl mx-auto text-[var(--color-parchment-soft)] leading-relaxed mb-8">
          Tap below to open our private Google Drive upload page. You can send
          full-resolution photos and videos — no compression, no app needed.
          We'll thread the best moments into the gallery on this site.
        </p>

        <a
          href={UPLOAD_URL}
          target="_blank"
          rel="noreferrer"
          className="!no-underline smallcaps text-sm inline-flex items-center gap-3 border border-[var(--color-gold)] text-[var(--color-parchment)] px-8 py-4 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors tracking-widest"
        >
          <ImageUp size={16} />
          Open the upload folder
          <ExternalLink size={12} className="opacity-60" />
        </a>

        <BotanicalDivider variant="rose" className="!my-12" />

        <div className="grid sm:grid-cols-3 gap-6 text-left">
          <Tip
            n="1"
            title="Originals, please"
            body="If your phone offers it, choose 'Original' or 'Most Compatible' — not the compressed version."
          />
          <Tip
            n="2"
            title="No size limit"
            body="Videos can be long. Drive will accept iPhone 4K just fine. Slow connection? Plug in and walk away."
          />
          <Tip
            n="3"
            title="Drop captions, too"
            body="A short note or a few names in the file name will help us when we caption the gallery later."
          />
        </div>
      </section>

      <p className="mt-10 italic text-[var(--color-parchment-mute)] text-sm">
        Trouble uploading? Text Kris and we'll figure it out.
      </p>
    </div>
  );
}

function Tip({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <span className="font-serif text-3xl text-[var(--color-rose-bloom)] italic">{n}</span>
      <p className="font-serif text-lg text-[var(--color-parchment)] mt-1">{title}</p>
      <p className="text-sm text-[var(--color-parchment-soft)] leading-relaxed mt-1">{body}</p>
    </div>
  );
}
