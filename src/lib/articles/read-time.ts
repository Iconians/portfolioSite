const WORDS_PER_MINUTE = 200;

/** Estimate reading time from MDX/markdown body (no DB field). */
export function computeReadTimeMinutes(content: string): number {
  const stripped = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_\-\[\]()]/g, " ");

  const words = stripped.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}
