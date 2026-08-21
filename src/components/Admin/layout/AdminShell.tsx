import { AdminShellClient } from "@/components/Admin/layout/AdminShellClient";

import type { ReactNode } from "react";

interface AdminShellProps {
  userEmail?: string | null;
  logoutAction: () => Promise<void>;
  children: ReactNode;
}

export function AdminShell({
  userEmail,
  logoutAction,
  children,
}: AdminShellProps) {
  return (
    <AdminShellClient userEmail={userEmail} logoutAction={logoutAction}>
      {children}
    </AdminShellClient>
  );
}
