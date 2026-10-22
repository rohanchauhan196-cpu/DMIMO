import AdminShell from "@/components/admin/AdminShell";
import { auth } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return <AdminShell userEmail={session?.user?.email ?? ""}>{children}</AdminShell>;
}
