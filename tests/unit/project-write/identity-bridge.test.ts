import { describe, expect, test } from "bun:test";

import { AdminProjectLoadError } from "@/lib/project-write/admin-project-load-error";
import { resolvePlatformCaseStudyIdBySlug } from "@/lib/project-write/identity-bridge";

const PLATFORM_UUID = "00000000-0000-4000-8000-000000000001";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";

function createClient(items: { id: string; slug: string }[]) {
  return {
    listCaseStudies: async () => ({ items }),
  };
}

async function expectRejects(
  promise: Promise<unknown>,
  ErrorType: new (...args: never[]) => Error
): Promise<Error> {
  try {
    await promise;
    throw new Error("expected rejection");
  } catch (error) {
    expect(error instanceof ErrorType).toBe(true);
    return error as Error;
  }
}

describe("resolvePlatformCaseStudyIdBySlug", () => {
  test("resolves archived Platform case study from later admin list page", async () => {
    const requestedPages: number[] = [];
    const id = await resolvePlatformCaseStudyIdBySlug(
      {
        listCaseStudies: async (options) => {
          requestedPages.push(options?.page ?? 1);
          if ((options?.page ?? 1) === 1) {
            return {
              items: [{ id: "other-project", slug: "other-project" }],
              total: 2,
              page: 1,
              limit: 1,
            };
          }
          return {
            items: [
              {
                id: PLATFORM_UUID,
                slug: "archived-project",
                lifecycle_status: "archived",
                archived_at: "2026-01-02T00:00:00Z",
              },
            ],
            total: 2,
            page: 2,
            limit: 1,
          };
        },
      },
      "archived-project"
    );

    expect(id).toBe(PLATFORM_UUID);
    expect(requestedPages).toEqual([1, 2]);
  });

  test("resolves Platform UUID from slug via admin list", async () => {
    const id = await resolvePlatformCaseStudyIdBySlug(
      createClient([{ id: PLATFORM_UUID, slug: "devlaunch-crm" }]),
      "devlaunch-crm"
    );
    expect(id).toBe(PLATFORM_UUID);
    expect(id).not.toBe(PORTFOLIO_LOCAL_UUID);
  });

  test("does not treat Portfolio-local UUID as Platform UUID", async () => {
    const error = await expectRejects(
      resolvePlatformCaseStudyIdBySlug(
        createClient([{ id: PLATFORM_UUID, slug: "devlaunch-crm" }]),
        PORTFOLIO_LOCAL_UUID
      ),
      AdminProjectLoadError
    );
    expect(error.message).toContain("No Platform case study found");
  });

  test("fails clearly when slug has no Platform match", async () => {
    const error = await expectRejects(
      resolvePlatformCaseStudyIdBySlug(
        createClient([{ id: PLATFORM_UUID, slug: "devlaunch-crm" }]),
        "missing-slug"
      ),
      AdminProjectLoadError
    );
    expect(error.message).toContain("No Platform case study found");
  });

  test("fails clearly on ambiguous slug matches", async () => {
    const error = await expectRejects(
      resolvePlatformCaseStudyIdBySlug(
        createClient([
          { id: PLATFORM_UUID, slug: "duplicate-slug" },
          { id: "00000000-0000-4000-8000-000000000002", slug: "duplicate-slug" },
        ]),
        "duplicate-slug"
      ),
      AdminProjectLoadError
    );
    expect(error.message).toContain("Ambiguous Platform case study slug match");
  });
});
