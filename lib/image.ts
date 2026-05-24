export function bufferToDataUrl(
  buffer: Buffer | Uint8Array | null | undefined,
): string | null {
  if (!buffer) return null;
  const b = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

  let mimeType = "image/jpeg"; // default fallback
  if (b.length >= 4) {
    if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
      mimeType = "image/png";
    } else if (
      b[0] === 0x52 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x46
    ) {
      mimeType = "image/webp";
    } else if (b[0] === 0xff && b[1] === 0xd8) {
      mimeType = "image/jpeg";
    }
  }

  return `data:${mimeType};base64,${b.toString("base64")}`;
}
