import { describe, expect, test } from "bun:test";
import { BarChart3, Gauge, TestTube2 } from "lucide-react";

import { getMetricIcon } from "@/lib/portfolio/metric-icons";

describe("getMetricIcon", () => {
  test("maps test-related labels", () => {
    expect(getMetricIcon("Unit test coverage")).toBe(TestTube2);
  });

  test("maps performance-related labels", () => {
    expect(getMetricIcon("P95 latency")).toBe(Gauge);
  });

  test("falls back to default icon", () => {
    expect(getMetricIcon("Projects shipped")).toBe(BarChart3);
  });
});
