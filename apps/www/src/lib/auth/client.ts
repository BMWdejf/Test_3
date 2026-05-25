"use client";

import { createAuthClient } from "@neondatabase/auth/next";

/**
 * Client-side Neon Auth singleton.
 * Exposes the Better Auth API plus React hooks (e.g. useSession()).
 *
 * The base URL is auto-detected from the current origin.
 */
export const authClient = createAuthClient();
