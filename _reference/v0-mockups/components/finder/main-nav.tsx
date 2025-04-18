"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/"
    },
    {
      href: "/results",
      label: "Find Providers",
      active: pathname === "/results" || pathname.startsWith("/profile")
    },
    {
      href: "/specialties",
      label: "Specialties",
      active: pathname === "/specialties"
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about"
    }
  ]

  return (
    <>
      <nav className="hidden items-center gap-6 md:flex">
        {routes.map(route => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "hover:text-primary text-sm font-medium transition-colors",
              route.active ? "text-primary" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
        <Button variant="outline" size="sm" className="gap-1">
          <Heart className="size-4" /> Favorites
        </Button>
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon">
            <Menu className="size-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {routes.map(route => (
            <DropdownMenuItem key={route.href} asChild>
              <Link href={route.href}>{route.label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild>
            <Link href="/favorites" className="flex items-center gap-2">
              <Heart className="size-4" /> Favorites
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
