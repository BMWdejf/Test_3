import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/server";

export default async function AdminDashboardPage() {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  const role = (user as { role?: string | null } | undefined)?.role ?? "admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name ?? user?.email ?? "admin"}.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total users</CardDescription>
            <CardTitle className="text-3xl">—</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Wire to <code>authClient.admin.listUsers()</code> later.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active sessions</CardDescription>
            <CardTitle className="text-3xl">—</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Placeholder
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Your role</CardDescription>
            <CardTitle className="text-3xl capitalize">{role}</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Live from current session
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
