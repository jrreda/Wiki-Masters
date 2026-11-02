import { createNeonAuth } from "@neon/auth/next/server";

// Server-side Neon Auth (managed Better Auth): API proxy, proxy.ts route
// protection, and session reads in server components / actions.
export const auth = createNeonAuth({
  // biome-ignore lint/style/noNonNullAssertion: required env, set in .env
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    // biome-ignore lint/style/noNonNullAssertion: required env, set in .env
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
