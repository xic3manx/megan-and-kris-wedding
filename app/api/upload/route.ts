import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * Direct-to-Blob upload handler. The client (UploadPage) calls this
 * endpoint to get a one-shot signed token, then uploads the file
 * straight to Vercel Blob storage — bytes do not flow through the
 * server function.
 *
 * The middleware (`middleware.ts`) gates this route behind the site
 * password, so only authenticated guests can request an upload token.
 *
 * Requires the `BLOB_READ_WRITE_TOKEN` env var — Vercel auto-provisions
 * it when you create a Blob store in the project's Storage tab.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Upload is being set up — please try again soon, or text Kris.",
      },
      { status: 503 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          // Guests can send photos and videos. Reject everything else.
          allowedContentTypes: ["image/*", "video/*"],
          // 500 MB per file — generous enough for 4K phone video,
          // small enough to deter accidental archive dumps.
          maximumSizeInBytes: 500 * 1024 * 1024,
          // The client already prefixes each upload with a unique id,
          // so let the stored pathname stay readable.
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ pathname }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Hook point — could later log to Supabase / send a notify
        // email. For now we just rely on the Blob dashboard.
        console.log("uploaded:", blob.url);
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
