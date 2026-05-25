import { redirect } from "next/navigation";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { auth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  email?: string;
  redirectTo?: string;
}>;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { email: emailParam, redirectTo } = await searchParams;
  const { data: session } = await auth.getSession();

  const email = emailParam ?? session?.user?.email;
  if (!email) {
    redirect("/auth/sign-in");
  }

  // Už je verified → skip rovnou na cíl.
  if (session?.user?.emailVerified) {
    redirect(redirectTo ?? "/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <VerifyEmailForm email={email} redirectTo={redirectTo ?? "/admin"} />
    </main>
  );
}
