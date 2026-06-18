"use client"

import { Logo } from "@/components/logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  Sparkles,
  Search,
  ReceiptText,
  LogOut,
  Coins,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/app/dashboard/actions"

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/builder", label: "Website Builder", icon: Sparkles },
  { href: "/dashboard/leads", label: "Lead Finder", icon: Search },
  { href: "/dashboard/finance", label: "Finance", icon: ReceiptText },
]

export function Topbar({
  email,
  plan,
  credits,
}: {
  email: string
  plan: string
  credits: number
}) {
  const pathname = usePathname()
  const initials = email.slice(0, 2).toUpperCase()

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        {/* Mobile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>
              <Logo />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {links.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href}>
                  <link.icon className="size-4" />
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className="text-sm font-medium text-muted-foreground">
          {links.find((l) =>
            l.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(l.href),
          )?.label ?? "Dashboard"}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="gap-1.5">
          <Coins className="size-3.5 text-primary" />
          {credits} credits
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="size-8">
                <AvatarFallback className="bg-secondary text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-1">
              <span className="truncate text-sm font-medium">{email}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {plan} plan
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" asChild>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
