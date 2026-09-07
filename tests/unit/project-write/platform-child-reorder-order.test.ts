import { describe, expect, test } from "bun:test";

import { buildChildReorderOrderedIds } from "@/lib/project-write/platform-child-reorder-order";

describe("buildChildReorderOrderedIds", () => {
  test("moves an ID up within the complete ordered set", () => {
    expect(
      buildChildReorderOrderedIds(["metric-b", "metric-a", "metric-c"], "metric-a", "up")
    ).toEqual(["metric-a", "metric-b", "metric-c"]);
  });

  test("moves an ID down within the complete ordered set", () => {
    expect(
      buildChildReorderOrderedIds(["metric-a", "metric-b", "metric-c"], "metric-a", "down")
    ).toEqual(["metric-b", "metric-a", "metric-c"]);
  });

  test("returns null when the item cannot move further", () => {
    expect(buildChildReorderOrderedIds(["metric-a"], "metric-a", "up")).toBeNull();
    expect(
      buildChildReorderOrderedIds(["metric-a", "metric-b"], "metric-b", "down")
    ).toBeNull();
  });
});
