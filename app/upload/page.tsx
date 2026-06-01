"use client";

import { useCallback, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Calligraphy } from "@/components/Calligraphy";
import BotanicalDivider from "@/components/BotanicalDivider";
import { Snail } from "@/components/Snail";
import Link from "next/link";
import { Camera, ImageUp, Check, AlertCircle, Film, Images } from "lucide-react";

type UploadState = "uploading" | "done" | "error";

type UploadItem = {
  id: string;
  file: File;
  state: UploadState;
  progress: number;
  url?: string;
  error?: string;
};

const MAX_SIZE_BYTES = 500 * 1024 * 1024; // mirror the server limit

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function prettyBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function UploadPage() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const uploadOne = useCallback(
    async (item: UploadItem) => {
      try {
        const safe = item.file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const pathname = `uploads/${item.id}-${safe}`;
        const blob = await upload(pathname, item.file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: item.file.type || undefined,
          onUploadProgress: (event) => {
            updateItem(item.id, { progress: event.percentage });
          },
        });
        updateItem(item.id, { state: "done", progress: 100, url: blob.url });
      } catch (err) {
        updateItem(item.id, {
          state: "error",
          error: (err as Error).message || "Upload failed",
        });
      }
    },
    [updateItem]
  );

  const addFiles = useCallback(
    (files: File[]) => {
      const accepted: UploadItem[] = [];
      const rejected: { name: string; reason: string }[] = [];
      for (const file of files) {
        const isMedia =
          file.type.startsWith("image/") || file.type.startsWith("video/");
        if (!isMedia) {
          rejected.push({ name: file.name, reason: "Not a photo or video" });
          continue;
        }
        if (file.size > MAX_SIZE_BYTES) {
          rejected.push({
            name: file.name,
            reason: `Over 500 MB (${prettyBytes(file.size)})`,
          });
          continue;
        }
        accepted.push({
          id: makeId(),
          file,
          state: "uploading",
          progress: 0,
        });
      }
      if (accepted.length === 0 && rejected.length === 0) return;
      setItems((prev) => [
        ...prev,
        ...accepted,
        ...rejected.map((r) => ({
          id: makeId(),
          file: { name: r.name, size: 0, type: "" } as File,
          state: "error" as UploadState,
          progress: 0,
          error: r.reason,
        })),
      ]);
      accepted.forEach(uploadOne);
    },
    [uploadOne]
  );

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length) addFiles(files);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) addFiles(files);
  }

  const doneCount = items.filter((i) => i.state === "done").length;
  const errorCount = items.filter((i) => i.state === "error").length;
  const inFlight = items.filter((i) => i.state === "uploading").length;

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-16 sm:py-24 text-center">
      <header>
        <p className="smallcaps text-xs text-[var(--color-gold)] tracking-[0.4em] mb-3">
          The Group Camera Roll
        </p>
        <Calligraphy
          as="h1"
          className="text-6xl sm:text-7xl text-[var(--color-parchment)]"
        >
          Upload
        </Calligraphy>
        <p className="mt-4 italic text-[var(--color-parchment-soft)] text-lg">
          Send us your photos and videos from the day.
        </p>
      </header>

      <BotanicalDivider variant="lavender" />

      <section className="surface p-8 sm:p-12">
        <Camera className="mx-auto mb-6 text-[var(--color-gold)]" size={32} />

        <Calligraphy
          as="h2"
          className="text-4xl text-[var(--color-parchment)] mb-3"
        >
          Drop a few from the day
        </Calligraphy>

        <p className="max-w-xl mx-auto text-[var(--color-parchment-soft)] leading-relaxed mb-8">
          Photos and videos go straight into our private archive — no app,
          no compression on our end. Multiple files at once is fine. Up to
          500&nbsp;MB each.
        </p>

        {/* dropzone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!isDragging) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={`group cursor-pointer rounded border-2 border-dashed transition-colors px-8 py-12 ${
            isDragging
              ? "border-[var(--color-rose-bloom)] bg-[var(--color-rose-deep)]/15"
              : "border-[var(--color-gold-deep)]/60 hover:border-[var(--color-gold)] hover:bg-[var(--color-ink-soft)]/40"
          }`}
        >
          <ImageUp
            size={32}
            className="mx-auto mb-4 text-[var(--color-gold)] group-hover:text-[var(--color-rose-bloom)] transition-colors"
          />
          <p className="font-serif text-lg text-[var(--color-parchment)] mb-1">
            Drag &amp; drop files here
          </p>
          <p className="smallcaps text-xs text-[var(--color-parchment-mute)] tracking-widest">
            or click to choose from your device
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={onPick}
            className="hidden"
          />
        </div>

        {/* totals */}
        {items.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 smallcaps text-xs tracking-widest text-[var(--color-parchment-soft)]">
            {inFlight > 0 && (
              <span>
                <span className="text-[var(--color-gold)]">{inFlight}</span>{" "}
                uploading
              </span>
            )}
            {doneCount > 0 && (
              <span>
                <span className="text-[var(--color-rose-bloom)]">
                  {doneCount}
                </span>{" "}
                received
              </span>
            )}
            {errorCount > 0 && (
              <span>
                <span className="text-[var(--color-rose)]">{errorCount}</span>{" "}
                failed
              </span>
            )}
          </div>
        )}

        {/* per-file rows */}
        {items.length > 0 && (
          <ul className="mt-6 space-y-3 text-left">
            {items.map((it) => (
              <FileRow key={it.id} item={it} />
            ))}
          </ul>
        )}

        {doneCount > 0 && (
          <div className="mt-8">
            <Link
              href="/gallery"
              className="!no-underline smallcaps text-xs inline-flex items-center gap-2 border border-[var(--color-gold-deep)] text-[var(--color-parchment)] px-6 py-3 hover:bg-[var(--color-rose-deep)]/40 hover:border-[var(--color-rose)] transition-colors"
            >
              <Images size={13} /> View in the gallery
            </Link>
          </div>
        )}
      </section>

      <p className="mt-10 italic text-[var(--color-parchment-mute)] text-sm">
        Trouble uploading? Text Kris and we'll figure it out.
      </p>

      {/* hidden snail */}
      <div className="mt-8 flex justify-center no-print">
        <Snail
          id="upload"
          size="md"
          whisper="thank you for the pictures"
          color="var(--color-gold)"
        />
      </div>
    </div>
  );
}

function FileRow({ item }: { item: UploadItem }) {
  const isImage = item.file.type.startsWith("image/");
  const isVideo = item.file.type.startsWith("video/");
  return (
    <li className="flex items-center gap-3 p-3 rounded border border-[var(--color-gold-deep)]/30 bg-[var(--color-ink-soft)]/40">
      <span className="flex-none w-9 h-9 rounded inline-flex items-center justify-center bg-[var(--color-ink-deep)]/70">
        {isImage ? (
          <ImageUp size={16} className="text-[var(--color-gold)]" />
        ) : isVideo ? (
          <Film size={16} className="text-[var(--color-gold)]" />
        ) : (
          <AlertCircle size={16} className="text-[var(--color-rose)]" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-base text-[var(--color-parchment)] truncate">
          {item.file.name}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-[var(--color-ink-deep)] overflow-hidden">
            <div
              className={`h-full transition-all ${
                item.state === "error"
                  ? "bg-[var(--color-rose)]"
                  : item.state === "done"
                  ? "bg-[var(--color-rose-bloom)]"
                  : "bg-[var(--color-gold)]"
              }`}
              style={{
                width:
                  item.state === "error"
                    ? "100%"
                    : item.state === "done"
                    ? "100%"
                    : `${item.progress}%`,
              }}
            />
          </div>
          <span className="flex-none smallcaps text-[10px] tracking-widest text-[var(--color-parchment-mute)] tabular-nums">
            {item.state === "done" ? (
              <span className="inline-flex items-center gap-1 text-[var(--color-rose-bloom)]">
                <Check size={12} /> done
              </span>
            ) : item.state === "error" ? (
              <span className="inline-flex items-center gap-1 text-[var(--color-rose)]">
                <AlertCircle size={12} /> {item.error ?? "failed"}
              </span>
            ) : (
              <>{Math.round(item.progress)}%</>
            )}
          </span>
        </div>
      </div>
    </li>
  );
}
