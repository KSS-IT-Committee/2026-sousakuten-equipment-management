import "server-only";

import path from "path";

// Public URL prefix stored verbatim in equipments.picture and served by the
// app/equipment-images/[name] route handler. Uploads do NOT live under public/
// anymore: they go on the persistent /app/files mount (see equipmentImagesDir),
// which is outside the build output, so Next can't auto-serve them.
export const IMAGE_URL_PREFIX = "/equipment-images/";

// Root of the per-container persistent files mount. In production/preview the
// deploy bind-mounts a host dir at /app/files (survives image swaps and per-PR
// recreation); FILES_DIR is set to it in the Dockerfile. Locally it falls back
// to a gitignored dir so `next dev` works without the mount.
function filesRoot(): string {
  return process.env.FILES_DIR ?? path.join(process.cwd(), "files-dev");
}

export function equipmentImagesDir(): string {
  return path.join(filesRoot(), "equipment-images");
}

// Raster-only allowlist. SVG is deliberately excluded: it is an active document
// format, so serving an uploaded SVG same-origin (image/svg+xml) would let its
// embedded <script> run in our origin when opened directly — a stored XSS. We
// only ever accept and serve formats that browsers render as inert images.
type ImageSignature = {
  ext: string;
  mime: string;
  match: (b: Buffer) => boolean;
};

const IMAGE_SIGNATURES: ImageSignature[] = [
  {
    ext: ".png",
    mime: "image/png",
    match: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47 &&
      b[4] === 0x0d &&
      b[5] === 0x0a &&
      b[6] === 0x1a &&
      b[7] === 0x0a,
  },
  {
    ext: ".jpg",
    mime: "image/jpeg",
    match: (b) =>
      b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    ext: ".gif",
    mime: "image/gif",
    // "GIF87a" or "GIF89a"
    match: (b) =>
      b.length >= 6 &&
      b.toString("ascii", 0, 4) === "GIF8" &&
      (b[4] === 0x37 || b[4] === 0x39) &&
      b[5] === 0x61,
  },
  {
    ext: ".webp",
    mime: "image/webp",
    // RIFF....WEBP
    match: (b) =>
      b.length >= 12 &&
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
  {
    ext: ".avif",
    mime: "image/avif",
    // ....ftyp<brand>, brand "avif"/"avis"
    match: (b) =>
      b.length >= 12 &&
      b.toString("ascii", 4, 8) === "ftyp" &&
      ["avif", "avis"].includes(b.toString("ascii", 8, 12)),
  },
];

// Serving lookup by extension, including the .jpeg alias. Intentionally has NO
// .svg entry, so any non-allowlisted file (e.g. a legacy upload) is served as a
// download rather than rendered — see the route handler.
const EXT_CONTENT_TYPE: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

export const ALLOWED_IMAGE_LABEL = "PNG, JPEG, GIF, WebP, AVIF";

// Identify an upload by its actual bytes (magic number), not its filename, so a
// disguised payload can't slip through on extension alone. Returns the canonical
// extension/mime, or null when the bytes are not an allowed raster image.
export function detectImageType(
  buffer: Buffer,
): { ext: string; mime: string } | null {
  const sig = IMAGE_SIGNATURES.find((s) => s.match(buffer));
  return sig ? { ext: sig.ext, mime: sig.mime } : null;
}

// Content-Type to serve a stored file with, or null if its extension is not on
// the raster allowlist (the caller then forces a download instead of rendering).
export function imageContentType(filename: string): string | null {
  return EXT_CONTENT_TYPE[path.extname(filename).toLowerCase()] ?? null;
}
