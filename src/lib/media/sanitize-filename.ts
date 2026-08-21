import path from "path";

const MAX_FILENAME_LENGTH = 120;

/** Strip path segments and normalize a user-provided filename for object keys. */
export function sanitizeMediaFilename(filename: string): string {
  const trimmed = filename.trim();
  if (!trimmed) {
    throw new Error("Filename is required");
  }

  const base = path.basename(trimmed.replace(/\\/g, "/"));
  if (!base || base === "." || base === "..") {
    throw new Error("Filename is required");
  }

  const lastDot = base.lastIndexOf(".");
  const rawExt = lastDot > 0 ? base.slice(lastDot) : "";
  const rawName = lastDot > 0 ? base.slice(0, lastDot) : base;

  const normalizedName = rawName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_FILENAME_LENGTH);

  const ext = rawExt.toLowerCase().replace(/[^a-z0-9.]/g, "");
  let safeExt = "";
  if (ext.startsWith(".")) {
    safeExt = ext;
  } else if (ext) {
    safeExt = `.${ext}`;
  }

  if (!normalizedName) {
    return safeExt ? `file${safeExt}` : "file";
  }

  return `${normalizedName}${safeExt}`;
}
