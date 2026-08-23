import { describe, expect, test } from "bun:test";
import {
  Accessibility,
  BarChart3,
  BookOpen,
  Boxes,
  Gauge,
  ListChecks,
  TestTube2,
} from "lucide-react";

import { getMetricIcon } from "@/lib/portfolio/metric-icons";

describe("getMetricIcon", () => {
  test("maps test-related labels", () => {
    expect(getMetricIcon("Unit test coverage")).toBe(TestTube2);
  });

  test("maps performance-related labels", () => {
    expect(getMetricIcon("P95 latency")).toBe(Gauge);
  });

  test("maps platform engineering labels", () => {
    expect(getMetricIcon("Implementation tasks")).toBe(ListChecks);
    expect(getMetricIcon("Reusable UI components")).toBe(Boxes);
    expect(getMetricIcon("Storybook stories")).toBe(BookOpen);
    expect(getMetricIcon("Accessibility coverage")).toBe(Accessibility);
    expect(getMetricIcon("Planned work")).toBe(ListChecks);
  });

  test("falls back to default icon", () => {
    expect(getMetricIcon("Projects shipped")).toBe(BarChart3);
  });
});
