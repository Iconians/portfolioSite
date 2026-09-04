import { describe, expect, test } from "bun:test";

import {
  buildPlatformMilestoneCreateRequest,
  buildPlatformMilestoneUpdateRequest,
  mapPlatformAdminMilestoneToProjectVersion,
} from "@/lib/project-write/platform-milestone-mapper";

const PLATFORM_MILESTONE_UUID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";

describe("platform milestone mapper", () => {
  test("maps Platform milestone to ProjectVersion with real Platform UUID", () => {
    const version = mapPlatformAdminMilestoneToProjectVersion(
      {
        id: PLATFORM_MILESTONE_UUID,
        year: 2026,
        version: "1.0",
        title: "Initial release",
        description: "First milestone",
        sort_order: 4,
      },
      PORTFOLIO_LOCAL_UUID
    );

    expect(version.id).toBe(PLATFORM_MILESTONE_UUID);
    expect(version.portfolioId).toBe(PORTFOLIO_LOCAL_UUID);
    expect(version.year).toBe(2026);
    expect(version.version).toBe("1.0");
    expect(version.title).toBe("Initial release");
    expect(version.description).toBe("First milestone");
    expect(version.sortOrder).toBe(4);
  });

  test("builds create request from ProjectVersion input", () => {
    expect(
      buildPlatformMilestoneCreateRequest(
        {
          year: 2026,
          version: "v1",
          title: "Launch",
          description: "Shipped",
        },
        0
      )
    ).toEqual({
      year: 2026,
      version: "v1",
      title: "Launch",
      description: "Shipped",
      sort_order: 0,
    });
  });

  test("builds update request without Portfolio-only fields", () => {
    const payload = buildPlatformMilestoneUpdateRequest({
      title: "Updated release",
      sortOrder: 2,
    });

    expect(payload).toEqual({
      title: "Updated release",
      sort_order: 2,
    });
    expect("portfolioId" in payload).toBe(false);
    expect("id" in payload).toBe(false);
  });
});
