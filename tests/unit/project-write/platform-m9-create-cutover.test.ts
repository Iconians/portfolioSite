import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

describe("P11-M9 create cutover gate", () => {
  test("incoherent platform read blocks create before Prisma write", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("ProjectSourceConfigurationError")).toBe(true);
    expect(source.indexOf("getProjectWriteSource() === \"platform-api\"")).toBeLessThan(
      source.indexOf("await createPortfolioItem")
    );
  });

  test("createPortfolioAction rejects platform-api before Prisma create", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    const fnStart = source.indexOf("export async function createPortfolioAction");
    const fnEnd = source.indexOf("export async function updatePortfolioAction");
    const createBlock = source.slice(fnStart, fnEnd);

    const guardIndex = createBlock.indexOf('getProjectWriteSource() === "platform-api"');
    const createIndex = createBlock.indexOf("await createPortfolioItem");
    expect(guardIndex).toBeGreaterThan(-1);
    expect(createIndex).toBeGreaterThan(guardIndex);
    expect(createBlock.includes("PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE")).toBe(true);
  });

  test("admin portfolio list hides Add Project in platform-api mode", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/app/admin/portfolio/page.tsx", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes('getProjectWriteSource() === "platform-api"')).toBe(true);
    expect(source.includes("/admin/portfolio/new")).toBe(true);
  });

  test("new portfolio page blocks editor in platform-api mode", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/app/admin/portfolio/new/page.tsx", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE")).toBe(true);
    expect(source.includes('writeSource === "platform-api"')).toBe(true);
  });
});
