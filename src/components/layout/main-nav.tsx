import * as React from "react"
import Link from "next/link"
import type { NavItem } from "@/types"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"


interface MainNavProps {
  items?: NavItem[]
  children?: React.ReactNode
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


export function MainNav({ items = defaultNavItems, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Logo />
        <span className="hidden font-bold sm:inline-block">
          Code Clash
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                item.href.startsWith(typeof window !== 'undefined' ? window.location.pathname : '/') ? "text-foreground" : "text-foreground/60",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  )
}
