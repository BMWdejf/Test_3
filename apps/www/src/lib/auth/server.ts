import "server-only";
import { createNeonAuth } from "@neondatabase/auth/next/server";

function requireEnv(name: "NEON_AUTH_BASE_URL" | "NEON_AUTH_COOKIE_SECRET") {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. See apps/www/.env.example.`,
    );
  }
  return value;
}

/**
 * Server-side Neon Auth singleton.
 * Used in Server Components, Server Actions, Route Handlers and middleware.
 *
 * Reads:
 *   NEON_AUTH_BASE_URL          — Neon Auth instance URL
 *   NEON_AUTH_COOKIE_SECRET     — 32+ char secret for session cookie signing
 */
export const auth = createNeonAuth({
  baseUrl: requireEnv("NEON_AUTH_BASE_URL"),
  cookies: {
    secret: requireEnv("NEON_AUTH_COOKIE_SECRET"),
  },
});
