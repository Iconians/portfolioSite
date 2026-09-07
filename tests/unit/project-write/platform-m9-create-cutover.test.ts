import { describe, expect, test } from "bun:test";

describe("P11-M9 create cutover gate", () => {
  test("createPortfolioProjectAction is the platform-api create path", async () => {
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");

    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("export async function createPortfolioProjectAction")).toBe(
      true
    );
    expect(source.includes("createPortfolioProjectViaPlatform")).toBe(true);
  });

  test("createPortfolioProjectAction does not invoke Prisma create", async () => {
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");

    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    const fnStart = source.indexOf("export async function createPortfolioProjectAction");
    const fnEnd = source.indexOf("export async function updatePortfolioAction");
    const createBlock = source.slice(fnStart, fnEnd);

    expect(createBlock.includes("await createPortfolioItem")).toBe(false);
    expect(createBlock.includes("createPortfolioProjectViaPlatform")).toBe(true);
  });

  test("admin portfolio list always shows Add Project", async () => {
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");

    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/app/admin/portfolio/page.tsx", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes('href="/admin/portfolio/new"')).toBe(true);
    expect(source.includes("Add Project")).toBe(true);
    expect(source.includes('writeSource === "platform-api" ? undefined')).toBe(false);
  });

  test("new portfolio page renders CreateProjectForm in platform-api mode", async () => {
    const { readFileSync } = await import("node:fs");
    const { fileURLToPath } = await import("node:url");

    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/app/admin/portfolio/new/page.tsx", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("CreateProjectForm")).toBe(true);
    expect(source.includes('writeSource === "platform-api"')).toBe(true);
    expect(source.includes("PLATFORM_PROJECT_CREATE_UNAVAILABLE_MESSAGE")).toBe(false);
  });
});
