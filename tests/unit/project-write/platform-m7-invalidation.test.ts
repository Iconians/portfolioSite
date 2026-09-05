import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

describe("platform M7 invalidation integration", () => {
  test("presign action does not call public cache invalidation", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );

    const presignStart = source.indexOf("export async function presignProjectMediaAction");
    const registerStart = source.indexOf("export async function registerProjectMediaAction");
    const presignBlock = source.slice(presignStart, registerStart);

    expect(presignBlock.includes("invalidatePublicProjectCache")).toBe(false);
    expect(presignBlock.includes("revalidateAfterPlatformProjectWrite")).toBe(false);
    expect(presignBlock.includes("revalidatePath(")).toBe(false);
  });

  test("register action invalidates only after successful Platform register", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );

    const registerStart = source.indexOf("export async function registerProjectMediaAction");
    const listStart = source.indexOf("export async function listProjectPlatformMediaAction");
    const registerBlock = source.slice(registerStart, listStart);

    const registerCallIndex = registerBlock.indexOf("registerProjectMediaViaPlatform");
    const invalidateIndex = registerBlock.indexOf("revalidatePublicProjectMediaPaths");
    expect(registerCallIndex).toBeGreaterThan(-1);
    expect(invalidateIndex).toBeGreaterThan(registerCallIndex);
  });

  test("platform project update uses targeted invalidation only", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio.ts", import.meta.url)
      ),
      "utf8"
    );

    const updateStart = source.indexOf("export async function updatePortfolioAction");
    const deleteStart = source.indexOf("export async function deletePortfolioAction");
    const updateBlock = source.slice(updateStart, deleteStart);

    expect(updateBlock.includes("updatePortfolioProjectViaPlatform")).toBe(true);
    expect(updateBlock.includes('revalidatePath("/")')).toBe(false);
    expect(updateBlock.includes("revalidateAfterPlatformProjectWrite")).toBe(true);
  });

  test("lifecycle actions use membership invalidation reason", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-lifecycle.ts", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes('"membership"')).toBe(true);
    expect(source.includes("revalidateAfterPlatformProjectWrite")).toBe(true);
  });

  test("blocked gallery reorder action performs no public invalidation", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/actions/portfolio-media.ts", import.meta.url)
      ),
      "utf8"
    );

    const reorderStart = source.indexOf("export async function reorderProjectGalleryMediaAction");
    const reorderBlock = source.slice(reorderStart);

    expect(reorderBlock.includes("revalidatePublicProjectMediaPaths")).toBe(false);
    expect(reorderBlock.includes("invalidatePublicProjectCache")).toBe(false);
  });

  test("public cache module invalidates paths then provider cache", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/lib/project-write/public-project-cache.ts", import.meta.url)
      ),
      "utf8"
    );

    const fnStart = source.indexOf("export function invalidatePublicProjectCache");
    const fnBody = source.slice(fnStart, source.indexOf("export async function invalidatePublicProjectCacheForPortfolioId"));

    expect(fnBody.indexOf("collectPublicProjectCachePaths")).toBeLessThan(
      fnBody.indexOf("invalidateProjectReadProviderCache")
    );
    expect(fnBody.includes("getProjectWriteSource() !== \"platform-api\"")).toBe(true);
  });
});
