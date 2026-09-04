import { describe, expect, test } from "bun:test";

import {
  buildPlatformMetricCreateRequest,
  buildPlatformMetricUpdateRequest,
  mapPlatformAdminMetricToPortfolio,
} from "@/lib/project-write/platform-metric-mapper";

const PLATFORM_METRIC_UUID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PORTFOLIO_LOCAL_UUID = "11111111-1111-4111-8111-111111111111";

describe("platform metric mapper", () => {
  test("maps Platform admin metric to Portfolio metric with real Platform UUID", () => {
    const metric = mapPlatformAdminMetricToPortfolio(
      {
        id: PLATFORM_METRIC_UUID,
        label: "Uptime",
        value: "99.9%",
        description: "Initial",
        show_on_business: true,
        sort_order: 2,
      },
      PORTFOLIO_LOCAL_UUID
    );

    expect(metric.id).toBe(PLATFORM_METRIC_UUID);
    expect(metric.portfolioId).toBe(PORTFOLIO_LOCAL_UUID);
    expect(metric.label).toBe("Uptime");
    expect(metric.value).toBe("99.9%");
    expect(metric.description).toBe("Initial");
    expect(metric.displayOrder).toBe(2);
  });

  test("builds create request from Portfolio input", () => {
    expect(
      buildPlatformMetricCreateRequest(
        {
          label: "Users",
          value: "100+",
          description: "Active users",
        },
        3
      )
    ).toEqual({
      label: "Users",
      value: "100+",
      description: "Active users",
      show_on_business: true,
      sort_order: 3,
    });
  });

  test("builds update request without Portfolio-only fields", () => {
    const payload = buildPlatformMetricUpdateRequest({
      label: "Updated",
      displayOrder: 1,
    });

    expect(payload).toEqual({
      label: "Updated",
      sort_order: 1,
    });
    expect("portfolioId" in payload).toBe(false);
    expect("id" in payload).toBe(false);
  });
});
