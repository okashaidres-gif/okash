"use client"

import { Logo } from "@/components/logo"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Sparkles,
  Search,
  ReceiptText,
} from "lucide-react"

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/builder", label: "Website Builder", icon: Sparkles },
  { href: "/dashboard/leads", label: "Lead Finder", icon: Search },
  { href: "/dashboard/finance", label: "Finance", icon: ReceiptText },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
              )}
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
