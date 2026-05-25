import { auth } from "@/lib/auth/server";

/**
 * Catch-all proxy that forwards Neon Auth requests
 * (sign-in, sign-up, callback, sign-out, session, admin, …) to the upstream service.
 *
 * The dynamic segment MUST be named [...path] — required by Neon Auth SDK.
 */
export const { GET, POST } = auth.handler();
