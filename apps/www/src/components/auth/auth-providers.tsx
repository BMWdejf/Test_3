"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth/client";

/**
 * Wraps the app with the Neon Auth UI context.
 *
 * Post-signup redirect logic:
 *
 * When Neon Auth has "email verification required" enabled, signUp.email()
 * returns WITHOUT a session token. The auth-ui library then calls
 * navigate('/auth/sign-in') — no session is created so onSessionChange never
 * fires. We intercept that navigate call and redirect to /auth/verify-email
 * instead, passing the email we captured from the DOM on form submit.
 *
 * If Neon Auth is configured to create a session on signup (emailVerified=false),
 * onSessionChange handles the redirect as a fallback.
 */
export function AuthProviders({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Email captured from the sign-up form at submit time; consumed by handleNavigate.
  const pendingEmail = useRef<string | null>(null);

  useEffect(() => {
    const onSubmit = (e: SubmitEvent) => {
      if (typeof window === "undefined") return;
      if (!window.location.pathname.endsWith("/sign-up")) return;
      const form = e.target as HTMLFormElement;
      const emailInput = form.querySelector<HTMLInputElement>(
        'input[name="email"]',
      );
      if (emailInput?.value) {
        pendingEmail.current = emailInput.value;
      }
    };
    window.addEventListener("submit", onSubmit);
    return () => window.removeEventListener("submit", onSubmit);
  }, []);

  const handleNavigate = (href: string) => {
    // After successful sign-up with server-side email verification required,
    // the library calls navigate('/auth/sign-in') because no session token was
    // returned. Intercept that and go to verify-email with the captured email.
    const email = pendingEmail.current;
    pendingEmail.current = null; // consume so only one redirect happens

    if (
      email &&
      typeof window !== "undefined" &&
      window.location.pathname.endsWith("/sign-up") &&
      href.includes("/sign-in")
    ) {
      const inParams = new URLSearchParams(href.split("?")[1] ?? "");
      const redirectTo = inParams.get("redirectTo") ?? "/admin";
      router.replace(
        `/auth/verify-email?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}`,
      );
      return;
    }

    router.push(href);
  };

  // Fallback: if sign-up creates a session with emailVerified=false (server
  // config without requireEmailVerification), handle it here.
  const handleSessionChange = async () => {
    const { data } = await authClient.getSession();
    if (data?.user && !data.user.emailVerified) {
      const email = encodeURIComponent(data.user.email ?? "");
      router.replace(`/auth/verify-email?email=${email}&redirectTo=/admin`);
      return;
    }
    router.refresh();
  };

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      emailVerification
      navigate={handleNavigate}
      replace={(href: string) => router.replace(href)}
      onSessionChange={handleSessionChange}
      Link={({ href, ...props }) => <a href={href as string} {...props} />}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
