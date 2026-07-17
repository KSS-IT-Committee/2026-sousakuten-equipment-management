import { readFile } from "fs/promises";
import path from "path";

import { equipmentImagesDir, imageContentType } from "@/lib/equipment-images";

// Uploaded images live on the persistent /app/files mount, outside public/, so
// Next won't serve them automatically — this handler streams them back under
// the /equipment-images/<name> URL stored in equipments.picture.

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  // The [name] segment is a single path component, but strip any directory
  // parts defensively so a crafted value can never escape the images dir.
  const dir = path.resolve(equipmentImagesDir());
  const filePath = path.resolve(dir, path.basename(name));
  if (path.dirname(filePath) !== dir) {
    return new Response("Not found", { status: 404 });
  }

  let file: Buffer;
  try {
    file = await readFile(filePath);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }

  const contentType = imageContentType(filePath);

  const headers: Record<string, string> = {
    // Content-Type is from the raster allowlist; never honor a sniffed type.
    "Content-Type": contentType ?? "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
    // Defense in depth: if this resource is ever opened as a top-level document,
    // sandbox + a null default-src stops any embedded script from running in
    // our origin. Harmless for raster images (they load no subresources).
    "Content-Security-Policy": "default-src 'none'; sandbox",
    // Uploaded filenames embed a SHA-256 of the file content (see saveImage
    // in components/AddEquipmentForm/action.ts), so a name can only ever be
    // reused for identical bytes — the content behind a given URL can never
    // change, even if a deleted name were ever reoccupied.
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  // Anything not on the raster allowlist (e.g. a legacy SVG saved before this
  // restriction) is forced to download instead of render, so it can't execute.
  if (contentType === null) {
    headers["Content-Disposition"] = "attachment";
  }

  return new Response(new Uint8Array(file), { headers });
}
