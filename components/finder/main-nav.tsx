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
      href: "/",
      label: "Home",
      active: pathname === "/"
    },
    {
      href: "/finder",
      label: "Find Providers",
      active: pathname.startsWith("/finder") || pathname.startsWith("/profile")
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
        {/* Favorites Button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => alert("Favorites functionality coming soon!")}
        >
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
          <DropdownMenuItem>
            <button
              className="flex w-full items-center gap-2"
              onClick={() => alert("Favorites functionality coming soon!")}
            >
              <Heart className="size-4" /> Favorites
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
