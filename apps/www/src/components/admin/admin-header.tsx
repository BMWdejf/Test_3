import { UserMenu } from "@/components/admin/user-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  user: { name?: string | null; email?: string | null; role?: string | null };
};

export function AdminHeader({ user }: Props) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <h2 className="text-sm font-medium text-muted-foreground">Admin</h2>
      <div className="ml-auto flex items-center gap-2">
        <ThemeSwitcher />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
