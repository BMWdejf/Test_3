import { redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth/server";

// Auth-gated subtree: must render dynamically so the session check runs on every request.
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in?redirectTo=/admin");
  }

  // Admin role is granted via Neon Console (Auth → Users → "Make admin").
  const role = (session.user as { role?: string | null }).role;
  if (role !== "admin") {
    redirect("/");
  }

  // Email must be verified before entering the admin panel.
  if (!session.user.emailVerified) {
    const email = encodeURIComponent(session.user.email ?? "");
    redirect(`/auth/verify-email?email=${email}&redirectTo=/admin`);
  }

  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    role: role ?? null,
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader user={user} />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
