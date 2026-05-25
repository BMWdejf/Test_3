import { AuthView } from "@neondatabase/auth-ui";

export const dynamic = "force-dynamic";

type Params = Promise<{ pathname: string }>;

/**
 * Renders the appropriate auth screen (sign-in, sign-up, forgot-password,
 * callback, magic-link, …) based on the URL segment.
 *
 * Routes handled (examples):
 *   /auth/sign-in
 *   /auth/sign-up
 *   /auth/forgot-password
 *   /auth/reset-password
 *   /auth/callback
 */
export default async function AuthCatchAllPage({ params }: { params: Params }) {
  const { pathname } = await params;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <AuthView pathname={pathname} redirectTo="/admin" />
    </main>
  );
}
