import { AdminShell } from "@/components/Admin/layout/AdminShell";
import { signOut } from "@/lib/auth";
import { requireAdminPage } from "@/lib/permissions";

async function logoutAction() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdminPage();

  return (
    <AdminShell userEmail={admin.email} logoutAction={logoutAction}>
      {children}
    </AdminShell>
  );
}
