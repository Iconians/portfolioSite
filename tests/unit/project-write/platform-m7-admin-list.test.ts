import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  mapPlatformAdminListItemToPortfolioListRow,
  sortAdminPortfolioListItems,
} from "@/lib/project-write/admin-portfolio-list-mapper";
import { listAllPlatformAdminCaseStudies } from "@/lib/project-write/platform-admin-list-pagination";

const BRIDGE_ID = "11111111-1111-4111-8111-111111111111";

describe("M7 admin portfolio list", () => {
  test("admin portfolio page uses Platform-backed list loader", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/app/admin/portfolio/page.tsx", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("loadAdminPortfolioListItems")).toBe(true);
    expect(source.includes("getAllPortfolioItems")).toBe(false);
  });

  test("admin dashboard count uses Platform-backed list loader", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL("../../../src/app/admin/page.tsx", import.meta.url)
      ),
      "utf8"
    );

    expect(source.includes("loadAdminPortfolioListItems")).toBe(true);
    expect(source.includes("getAllPortfolioItems")).toBe(false);
  });

  test("maps Platform admin list item display fields from Platform authority", () => {
    const row = mapPlatformAdminListItemToPortfolioListRow(
      {
        id: "00000000-0000-4000-8000-000000000001",
        slug: "devlaunch-crm",
        title: "DevLaunch CRM",
        summary: "Platform summary",
        project_type: "client",
        lifecycle_status: "active",
        publish_status: "published",
        is_featured: true,
        sort_order: 3,
        categories: [{ name: "SaaS", slug: "saas" }],
        technologies: [{ name: "PostgreSQL" }],
      },
      BRIDGE_ID
    );

    expect(row.id).toBe(BRIDGE_ID);
    expect(row.caption).toBe("DevLaunch CRM");
    expect(row.description).toBe("Platform summary");
    expect(row.category).toEqual(["SaaS"]);
    expect(row.publishStatus).toBe("published");
    expect(row.sortOrder).toBe(3);
    expect(row.isFeatured).toBe(true);
  });

  test("sorts admin list rows by Platform sort_order", () => {
    const sorted = sortAdminPortfolioListItems([
      mapPlatformAdminListItemToPortfolioListRow(
        {
          id: "b",
          slug: "b",
          title: "B",
          project_type: "client",
          lifecycle_status: "active",
          sort_order: 5,
        },
        "id-b"
      ),
      mapPlatformAdminListItemToPortfolioListRow(
        {
          id: "a",
          slug: "a",
          title: "A",
          project_type: "client",
          lifecycle_status: "active",
          sort_order: 1,
        },
        "id-a"
      ),
    ]);

    expect(sorted.map((item) => item.slug)).toEqual(["a", "b"]);
  });

  test("paginates through all Platform admin list pages", async () => {
    const requestedPages: number[] = [];
    const items = await listAllPlatformAdminCaseStudies({
      listCaseStudies: async (options) => {
        requestedPages.push(options?.page ?? 1);
        if ((options?.page ?? 1) === 1) {
          return {
            items: [{ id: "1", slug: "one", title: "One", project_type: "client", lifecycle_status: "active" }],
            total: 2,
            page: 1,
            limit: 1,
          };
        }
        return {
          items: [{ id: "2", slug: "two", title: "Two", project_type: "client", lifecycle_status: "active" }],
          total: 2,
          page: 2,
          limit: 1,
        };
      },
    });

    expect(items.length).toBe(2);
    expect(requestedPages).toEqual([1, 2]);
  });

  test("bridge rows remain routing-only and minimal on create", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/portfolio-navigation-bridge.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("Navigation bridge row")).toBe(true);
    expect(source.includes("problem:")).toBe(false);
    expect(source.includes("summary:")).toBe(false);
  });

  test("loadAdminPortfolioListItems joins Platform list with bridge ids by slug", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/admin-portfolio-list.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("listAllPlatformAdminCaseStudies")).toBe(true);
    expect(source.includes("listAllPlatformAdminHeroMedia")).toBe(true);
    expect(source.includes("buildCaseStudyHeroDisplayUrlMap")).toBe(true);
    expect(source.includes("listPortfolioBridgeRows")).toBe(true);
    expect(source.includes("bridgeIdBySlug")).toBe(true);
    expect(source.includes("getAllPortfolioItems")).toBe(true);
  });
});
