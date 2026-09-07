import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { isDisplayablePortfolioListImage } from "@/lib/portfolio/display-media-url";
import { mapPlatformAdminListItemToPortfolioListRow } from "@/lib/project-write/admin-portfolio-list-mapper";
import {
  listAllPlatformAdminHeroMedia,
} from "@/lib/project-write/platform-admin-list-pagination";
import {
  buildCaseStudyHeroDisplayUrlMap,
  resolveConfirmedHeroDisplayUrl,
} from "@/lib/project-write/platform-media-mapper";

const BRIDGE_ID = "11111111-1111-4111-8111-111111111111";
const CASE_STUDY_A = "00000000-0000-4000-8000-000000000001";
const CASE_STUDY_B = "00000000-0000-4000-8000-000000000002";

function listItem(id: string, slug: string) {
  return {
    id,
    slug,
    title: slug,
    project_type: "client",
    lifecycle_status: "active",
  };
}

describe("M7 admin portfolio list hero media", () => {
  test("maps confirmed hero public_url with display rewrite", () => {
    process.env.S3_PUBLIC_URL_BASE = "https://media.devlaunchsystems.com";

    const heroMap = buildCaseStudyHeroDisplayUrlMap([
      {
        id: "hero-1",
        case_study_id: CASE_STUDY_A,
        storage_key: "hero.png",
        public_url:
          "https://pub-49ca821aa6ed4a4ba63fe0776a63274e.r2.dev/portfolio/heroes/a.png",
        role: "hero",
        upload_status: "confirmed",
      },
    ]);

    const row = mapPlatformAdminListItemToPortfolioListRow(
      listItem(CASE_STUDY_A, "project-a"),
      BRIDGE_ID,
      { heroImg: heroMap.get(CASE_STUDY_A) }
    );

    expect(row.img).toBe(
      "https://media.devlaunchsystems.com/portfolio/heroes/a.png"
    );
    expect(isDisplayablePortfolioListImage(row.img)).toBe(true);
  });

  test("joins heroes to the correct case_study_id without cross-project leakage", () => {
    const heroMap = buildCaseStudyHeroDisplayUrlMap([
      {
        id: "hero-a",
        case_study_id: CASE_STUDY_A,
        storage_key: "a.png",
        public_url: "https://cdn.example/a.png",
        role: "hero",
        upload_status: "confirmed",
      },
      {
        id: "hero-b",
        case_study_id: CASE_STUDY_B,
        storage_key: "b.png",
        public_url: "https://cdn.example/b.png",
        role: "hero",
        upload_status: "confirmed",
      },
    ]);

    const rowA = mapPlatformAdminListItemToPortfolioListRow(
      listItem(CASE_STUDY_A, "project-a"),
      "bridge-a",
      { heroImg: heroMap.get(CASE_STUDY_A) }
    );
    const rowB = mapPlatformAdminListItemToPortfolioListRow(
      listItem(CASE_STUDY_B, "project-b"),
      "bridge-b",
      { heroImg: heroMap.get(CASE_STUDY_B) }
    );

    expect(rowA.img).toBe("https://cdn.example/a.png");
    expect(rowB.img).toBe("https://cdn.example/b.png");
  });

  test("imageless project does not receive placeholder slash", () => {
    const row = mapPlatformAdminListItemToPortfolioListRow(
      listItem(CASE_STUDY_A, "no-hero"),
      BRIDGE_ID
    );

    expect(row.img).toBe("");
    expect(isDisplayablePortfolioListImage(row.img)).toBe(false);
  });

  test("gallery and OG media do not become list thumbnail", () => {
    const heroMap = buildCaseStudyHeroDisplayUrlMap([
      {
        id: "og-1",
        case_study_id: CASE_STUDY_A,
        storage_key: "og.png",
        public_url: "https://cdn.example/og.png",
        role: "og",
        upload_status: "confirmed",
      },
      {
        id: "gallery-1",
        case_study_id: CASE_STUDY_A,
        storage_key: "gallery.png",
        public_url: "https://cdn.example/gallery.png",
        role: "gallery",
        upload_status: "confirmed",
      },
    ]);

    expect(heroMap.get(CASE_STUDY_A)).toBeUndefined();
    expect(
      resolveConfirmedHeroDisplayUrl([
        {
          id: "og-1",
          case_study_id: CASE_STUDY_A,
          storage_key: "og.png",
          public_url: "https://cdn.example/og.png",
          role: "og",
          upload_status: "confirmed",
        },
      ])
    ).toBe("");
  });

  test("unconfirmed hero is not selected", () => {
    const heroMap = buildCaseStudyHeroDisplayUrlMap([
      {
        id: "pending-hero",
        case_study_id: CASE_STUDY_A,
        storage_key: "pending.png",
        public_url: "https://cdn.example/pending.png",
        role: "hero",
        upload_status: "pending",
      },
    ]);

    expect(heroMap.get(CASE_STUDY_A)).toBeUndefined();
  });

  test("platform-api admin list never reads Prisma img as display authority", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/lib/project-write/admin-portfolio-list.ts",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("listAllPlatformAdminHeroMedia")).toBe(true);
    expect(source.includes("buildCaseStudyHeroDisplayUrlMap")).toBe(true);
    expect(source.includes("portfolio.img")).toBe(false);
    expect(source.includes('img: "/"')).toBe(false);
    expect(source.includes("ADMIN_LIST_PLACEHOLDER_IMG")).toBe(false);
  });

  test("navigation bridge remains routing-only", () => {
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
    expect(source.includes("BRIDGE_PLACEHOLDER_IMG")).toBe(true);
  });

  test("paginates through all Platform admin hero media pages", async () => {
    const requestedPages: number[] = [];
    const requestedFilters: Array<{ role?: string; uploadStatus?: string }> = [];

    const items = await listAllPlatformAdminHeroMedia({
      listMedia: async (options) => {
        requestedPages.push(options?.page ?? 1);
        requestedFilters.push({
          role: options?.role,
          uploadStatus: options?.uploadStatus,
        });

        if ((options?.page ?? 1) === 1) {
          return {
            items: [
              {
                id: "hero-1",
                case_study_id: CASE_STUDY_A,
                storage_key: "a.png",
                public_url: "https://cdn.example/a.png",
                role: "hero",
                upload_status: "confirmed",
              },
            ],
            total: 2,
            page: 1,
            limit: 1,
          };
        }

        return {
          items: [
            {
              id: "hero-2",
              case_study_id: CASE_STUDY_B,
              storage_key: "b.png",
              public_url: "https://cdn.example/b.png",
              role: "hero",
              upload_status: "confirmed",
            },
          ],
          total: 2,
          page: 2,
          limit: 1,
        };
      },
    });

    expect(items.length).toBe(2);
    expect(requestedPages).toEqual([1, 2]);
    expect(requestedFilters.every((filter) => filter.role === "hero")).toBe(true);
    expect(
      requestedFilters.every((filter) => filter.uploadStatus === "confirmed")
    ).toBe(true);
  });

  test("PortfolioList only renders next/image when hero URL is displayable", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../../../src/components/Admin/PortfolioList.tsx",
          import.meta.url
        )
      ),
      "utf8"
    );

    expect(source.includes("isDisplayablePortfolioListImage")).toBe(true);
    expect(source.includes("<Image")).toBe(true);
    expect(
      Boolean(source.match(/isDisplayablePortfolioListImage[\s\S]*<Image/))
    ).toBe(true);
  });
});
