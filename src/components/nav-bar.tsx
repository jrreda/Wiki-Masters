import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function NavBar() {
  return (
    <nav className="top-0 z-50 sticky bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur border-b w-full">
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
            <NavigationMenuItem>
              <Button variant="outline">
                <Link href="/signin">Sign In</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
