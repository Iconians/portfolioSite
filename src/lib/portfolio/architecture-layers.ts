export interface ArchitectureLayer {
  name: string;
  items: string[];
}

const LAYER_HEADER_PATTERN =
  /^(presentation|application|persistence|infrastructure|data|storage|frontend|backend|platform)(?:\s+layer)?\s*:?\s*$/i;

function splitListItems(block: string): string[] {
  return block
    .split(/\n/)
    .flatMap((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return [];
      }

      if (/^[-*•]\s+/.test(trimmed)) {
        return [trimmed.replace(/^[-*•]\s+/, "").trim()];
      }

      if (/^\d+[.)]\s+/.test(trimmed)) {
        return [trimmed.replace(/^\d+[.)]\s+/, "").trim()];
      }

      return [trimmed];
    })
    .filter(Boolean);
}

export function parseArchitectureLayers(content: string): ArchitectureLayer[] | null {
  const trimmed = content.trim();
  if (!trimmed) {
    return null;
  }

  const blocks = trimmed.split(/\n\s*\n/);
  const layers: ArchitectureLayer[] = [];

  for (const block of blocks) {
    const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      continue;
    }

    const header = lines[0];
    if (!LAYER_HEADER_PATTERN.test(header)) {
      continue;
    }

    const name = header.replace(/\s*:\s*$/, "").trim();
    const inlineItems = header.includes(":")
      ? header
          .split(":")
          .slice(1)
          .join(":")
          .split(/[,;|]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const items =
      inlineItems.length > 0 ? inlineItems : splitListItems(lines.slice(1).join("\n"));

    if (items.length > 0) {
      layers.push({ name, items });
    }
  }

  return layers.length >= 2 ? layers : null;
}
