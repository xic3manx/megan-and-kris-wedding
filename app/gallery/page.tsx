import { list, type ListBlobResultBlob } from "@vercel/blob";
import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import { Camera, Clock, ImageUp } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Gallery · Megan & Kris" };

// Pull fresh on every visit — uploads stream in throughout the day.
export const dynamic = "force-dynamic";
export const revalidate = 0;

type UploadItem = ListBlobResultBlob & {
  kind: "image" | "video" | "other";
  filename: string;
};

async function fetchUploads(): Promise<UploadItem[]> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];
  try {
    const { blobs } = await list({ prefix: "uploads/", limit: 500 });
    return blobs
      .map((b) => {
        const ext = b.pathname.split(".").pop()?.toLowerCase() ?? "";
        const kind: UploadItem["kind"] = IMAGE_EXTS.has(ext)
          ? "image"
          : VIDEO_EXTS.has(ext)
          ? "video"
          : "other";
        // strip the leading `uploads/<id>-` so the original filename shows
        const base = b.pathname.replace(/^uploads\//, "");
        const filename = base.replace(/^[a-z0-9]{1,16}-[a-z0-9]{1,8}-/i, "");
        return { ...b, kind, filename };
      })
      .filter((b) => b.kind !== "other")
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
  } catch (err) {
    console.error("Blob list failed:", err);
    return [];
  }
}

const IMAGE_EXTS = new Set([
  "jpg", "jpeg", "png", "webp", "gif", "heic", "heif", "avif", "bmp", "tiff", "tif",
]);
const VIDEO_EXTS = new Set([
  "mp4", "mov", "m4v", "webm", "avi", "mkv", "3gp",
]);

const SECTIONS = [
  { id: "pre", title: "Pre-Wedding", blurb: "Engagement, the days before, getting ready." },
  { id: "ceremony", title: "Ceremony", blurb: "The bluff at Crystal Cove, the words, the rings." },
  { id: "reception", title: "Reception", blurb: "Mastro's by candlelight." },
  { id: "breakfast", title: "Breakfast", blurb: "The morning after, slow goodbyes." },
];

export default async function GalleryPage() {
  const uploads = await fetchUploads();
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 sm:py-24">
      <header className="text-center">
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          A Keepsake
        </p>
        <Calligraphy as="h1" className="text-6xl sm:text-7xl text-[var(--color-parchment)]">
          The Gallery
        </Calligraphy>
        <p className="mt-4 italic text-[var(--color-parchment-soft)] text-lg max-w-2xl mx-auto">
          What everyone is sending in, as it comes in. The photographer's
          curated albums will land below once the deliverables arrive.
        </p>
      </header>

      <BotanicalDivider variant="lavender" />

      {/* Group Camera Roll — live from the Vercel Blob store */}
      <section className="mb-10">
        <header className="text-center mb-8">
          <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
            The Group Camera Roll
          </p>
          <Calligraphy as="h2" className="text-4xl sm:text-5xl text-[var(--color-parchment)] mb-2">
            From the group, so far
          </Calligraphy>
          <p className="italic text-[var(--color-parchment-soft)]">
            {uploads.length === 0
              ? "Nothing yet — be the first."
              : `${uploads.length} ${uploads.length === 1 ? "moment" : "moments"} from you all.`}
          </p>
        </header>

        {uploads.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {uploads.map((u) => (
              <li key={u.url}>
                <MediaTile item={u} />
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/upload"
            className="!no-underline smallcaps text-xs inline-flex items-center gap-2 border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-6 py-3 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
          >
            <ImageUp size={13} /> Add your own
          </Link>
        </div>
      </section>

      <BotanicalDivider variant="rose" />

      {/* Curated section tiles — populated after the wedding */}
      <section>
        <header className="text-center mb-8">
          <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
            Curated Albums
          </p>
          <Calligraphy as="h2" className="text-4xl sm:text-5xl text-[var(--color-parchment)]">
            From the photographer
          </Calligraphy>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SECTIONS.map((s) => (
            <article
              key={s.id}
              className="surface aspect-[4/3] flex flex-col items-center justify-center text-center p-10 relative overflow-hidden"
            >
              <Clock className="text-[var(--color-gold-deep)] mb-4 opacity-60" size={22} />
              <Calligraphy as="h3" className="text-3xl text-[var(--color-parchment)] mb-2">
                {s.title}
              </Calligraphy>
              <p className="italic text-[var(--color-parchment-mute)] text-sm max-w-xs">
                {s.blurb}
              </p>
              <p className="smallcaps text-[10px] text-[var(--color-gold)] tracking-[0.35em] mt-6">
                Coming soon · post-wedding
              </p>
              <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="absolute -bottom-10 -right-10 w-44 opacity-10"
                fill="none"
              >
                <path d="M30 170 Q90 120 170 30" stroke="var(--color-lavender)" strokeWidth="1" />
                <circle cx="170" cy="30" r="6" fill="var(--color-rose)" />
                <circle cx="120" cy="80" r="3" fill="var(--color-lavender)" />
                <circle cx="80" cy="130" r="3" fill="var(--color-lavender)" />
              </svg>
            </article>
          ))}
        </div>
      </section>

      <BotanicalDivider variant="snail" className="!my-20" />

      <section className="text-center">
        <Camera className="mx-auto mb-4 text-[var(--color-gold)]" size={26} />
        <p className="max-w-xl mx-auto italic text-[var(--color-parchment-soft)]">
          Photos you send in are saved in our private archive — never indexed,
          never sold. Thank you for sharing the day with us.
        </p>
      </section>
    </div>
  );
}

function MediaTile({ item }: { item: UploadItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group relative block aspect-square overflow-hidden rounded border border-[var(--color-gold-deep)]/30 bg-[var(--color-ink-deep)]"
      title={item.filename}
    >
      {item.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={item.filename}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <>
          <video
            src={item.url}
            preload="metadata"
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-[var(--color-ink-deep)]/30 group-hover:bg-[var(--color-ink-deep)]/10 transition-colors">
            <span className="rounded-full bg-[var(--color-ink-deep)]/70 backdrop-blur p-3 border border-[var(--color-gold-deep)]/50">
              <PlayGlyph />
            </span>
          </span>
        </>
      )}
    </a>
  );
}

function PlayGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 1 L12 7 L3 13 Z" fill="var(--color-gold)" />
    </svg>
  );
}

function EmptyState() {
  return (
    <div className="surface aspect-[16/7] sm:aspect-[16/5] flex flex-col items-center justify-center text-center p-10">
      <ImageUp className="text-[var(--color-gold)] mb-4 opacity-70" size={26} />
      <Calligraphy as="p" className="text-3xl text-[var(--color-parchment)] mb-2">
        An empty frame
      </Calligraphy>
      <p className="italic text-[var(--color-parchment-mute)] text-sm max-w-md">
        The first photo or video you all send in will appear here, with the
        rest streaming in alongside it. Drop one from the upload page.
      </p>
    </div>
  );
}
