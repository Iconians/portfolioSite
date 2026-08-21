export function isAdminRole(role: string | null | undefined): role is "admin" {
  return role === "admin";
}
