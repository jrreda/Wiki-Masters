import { auth } from "@/lib/auth/server";

// Redirects signed-out users to the sign-in page. This is an optimistic
// check only: route handlers and server actions must still verify the session.
export default auth.middleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  // Routes that require a signed-in user (creating and editing wiki pages).
  matcher: ["/wiki/new", "/wiki/:id/edit"],
};
