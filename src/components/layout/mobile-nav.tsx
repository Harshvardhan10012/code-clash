"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Swords } from "lucide-react"

import type { NavItem } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"

interface MobileNavProps {
  items?: NavItem[]
}

const defaultNavItems: NavItem[] = [
  {
    title: "Challenges",
    href: "/",
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
  },
];


export function MobileNav({ items = defaultNavItems }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const [pathname, setPathname] = React.useState("")

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname)
    }
  }, [open]) // Re-check pathname when sheet opens/closes

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
        >
          <Logo className="mr-2 h-6 w-6" />
          <span className="font-bold">Code Clash</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {items?.map(
              (item) =>
                item.href && (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-muted-foreground transition-colors hover:text-foreground",
                       pathname === item.href && "text-foreground font-semibold"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.title}
                  </Link>
                )
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
