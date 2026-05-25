import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/server";

export async function Header() {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  const role = (user as { role?: string | null } | undefined)?.role;
  const isAdmin = role === "admin";
  const isVerified = user?.emailVerified === true;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-5">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-semibold"
          aria-label="Loci home"
        >
          <Image
            alt="Loci logo"
            src="/logo.svg"
            width={18}
            height={18}
            className="dark:invert"
          />
          <span className="text-xl">Loci</span>
        </a>
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-8 text-sm"
        >
          <a
            href="#problem"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Problem
          </a>
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#open-source"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Open Source
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {user ? (
            !isVerified ? (
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/auth/verify-email?email=${encodeURIComponent(user.email ?? "")}`}
                >
                  Ověřit email
                </Link>
              </Button>
            ) : isAdmin ? (
              <Button asChild size="sm">
                <Link href="/admin">Go to admin</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href="/auth/sign-out">Sign out</Link>
              </Button>
            )
          ) : (
            <Button asChild size="sm">
              <Link href="/auth/sign-in?redirectTo=/admin">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
