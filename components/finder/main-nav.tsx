"use client"

import * as React from "react"
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
      href: "/finder",
      label: "Home",
      active: pathname === "/finder"
    },
    {
      href: "/finder/results",
      label: "Find Providers",
      active:
        pathname.startsWith("/finder/results") ||
        pathname.startsWith("/finder/profile")
    }
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-4 md:flex lg:gap-6">
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
        {/* Placeholder Favorites Button */}
        <Button variant="outline" size="sm" className="gap-1">
          <Heart className="size-4" /> Favorites
        </Button>
      </nav>

      {/* Mobile Navigation */}
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
            <Link href="/finder/favorites" className="flex items-center gap-2">
              <Heart className="size-4" /> Favorites
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
