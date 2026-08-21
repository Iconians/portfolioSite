import { describe, expect, test } from "bun:test";

import { isAdminNavActive } from "@/components/Admin/layout/admin-nav-config";

describe("isAdminNavActive", () => {
  test("activates dashboard only on exact /admin path", () => {
    expect(isAdminNavActive("/admin", "/admin")).toBe(true);
    expect(isAdminNavActive("/admin/portfolio", "/admin")).toBe(false);
  });

  test("activates portfolio for list and nested edit routes", () => {
    expect(isAdminNavActive("/admin/portfolio", "/admin/portfolio")).toBe(true);
    expect(isAdminNavActive("/admin/portfolio/new", "/admin/portfolio")).toBe(true);
    expect(
      isAdminNavActive("/admin/portfolio/abc-123", "/admin/portfolio")
    ).toBe(true);
  });

  test("does not activate portfolio for unrelated sections", () => {
    expect(isAdminNavActive("/admin/media", "/admin/portfolio")).toBe(false);
    expect(isAdminNavActive("/admin/articles/1", "/admin/portfolio")).toBe(false);
  });
});
