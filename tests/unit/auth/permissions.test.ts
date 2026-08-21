import { describe, expect, test } from "bun:test";
import { validateAuthEnvironment } from "@/lib/auth/env";
import { isAdminRole } from "@/lib/auth/roles";
import {
  AuthenticationError,
  AuthorizationError,
  isAuthError,
} from "@/lib/auth/errors";

describe("isAdminRole", () => {
  test("accepts admin role only", () => {
    expect(isAdminRole("admin")).toBe(true);
    expect(isAdminRole("user")).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
    expect(isAdminRole(null)).toBe(false);
  });
});

describe("auth errors", () => {
  test("identifies authentication and authorization errors", () => {
    expect(isAuthError(new AuthenticationError())).toBe(true);
    expect(isAuthError(new AuthorizationError())).toBe(true);
    expect(isAuthError(new Error("Unauthorized"))).toBe(false);
  });
});

describe("validateAuthEnvironment", () => {
  test("does not throw when AUTH_SECRET is unset in non-production", () => {
    expect(() => validateAuthEnvironment()).not.toThrow();
  });
});
