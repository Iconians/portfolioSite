import { describe, expect, test } from "bun:test";
import { parseArchitectureLayers } from "@/lib/portfolio/architecture-layers";

describe("parseArchitectureLayers", () => {
  test("returns null when content has no recognizable layer blocks", () => {
    expect(parseArchitectureLayers("Single paragraph architecture overview.")).toBeNull();
  });

  test("parses labeled layer blocks with bullet lists", () => {
    const content = `Presentation
- Next.js
- React

Application
- Server Actions
- Services

Persistence
- Prisma
- Neon PostgreSQL

Infrastructure
- Cloudflare R2
- Auth.js`;

    expect(parseArchitectureLayers(content)).toEqual([
      { name: "Presentation", items: ["Next.js", "React"] },
      { name: "Application", items: ["Server Actions", "Services"] },
      { name: "Persistence", items: ["Prisma", "Neon PostgreSQL"] },
      { name: "Infrastructure", items: ["Cloudflare R2", "Auth.js"] },
    ]);
  });
});
