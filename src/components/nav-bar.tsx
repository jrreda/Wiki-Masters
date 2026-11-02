import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { signOut } from "@/app/auth/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { auth } from "@/lib/auth/server";

export default function NavBar() {
  return (
    <nav className="top-0 z-50 sticky bg-white/80 supports-backdrop-filter:bg-white/60 backdrop-blur border-b w-full">
      <div className="flex justify-between items-center mx-auto px-4 h-16 container">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-gray-900 text-xl tracking-tight"
          >
            Wikimasters
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            {/* Reading the session uses request cookies, so it streams in. */}
            <Suspense fallback={<div className="w-40 h-8" />}>
              <AuthControls />
            </Suspense>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

async function AuthControls() {
  // Stop prerendering here; otherwise the SDK catches and logs Next's
  // prerender bail-out from cookies() as an error.
  await connection();
  const { data: session } = await auth.getSession();

  if (session?.user) {
    return (
      <>
        <NavigationMenuItem>
          <span className="text-muted-foreground text-sm">
            {session.user.name || session.user.email}
          </span>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <form action={signOut}>
            <Button type="submit" variant="outline">
              Sign Out
            </Button>
          </form>
        </NavigationMenuItem>
      </>
    );
  }

  return (
    <>
      <NavigationMenuItem>
        <Link
          href="/auth/sign-in"
          className={buttonVariants({ variant: "outline" })}
        >
          Sign In
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/auth/sign-up" className={buttonVariants()}>
          Sign Up
        </Link>
      </NavigationMenuItem>
    </>
  );
}
