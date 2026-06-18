import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Sparkles,
  Search,
  ReceiptText,
  ArrowRight,
  FolderGit2,
} from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userId = user!.id

  const [{ count: projectCount }, { count: leadCount }, { data: invoices }] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase.from("invoices").select("amount, status").eq("user_id", userId),
    ])

  const paidRevenue = (invoices ?? [])
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + Number(i.amount), 0)
  const outstanding = (invoices ?? [])
    .filter((i) => i.status === "Sent")
    .reduce((sum, i) => sum + Number(i.amount), 0)

  const stats = [
    {
      label: "Projects",
      value: projectCount ?? 0,
      icon: FolderGit2,
    },
    {
      label: "Saved leads",
      value: leadCount ?? 0,
      icon: Search,
    },
    {
      label: "Revenue (paid)",
      value: `$${paidRevenue.toLocaleString()}`,
      icon: ReceiptText,
    },
    {
      label: "Outstanding",
      value: `$${outstanding.toLocaleString()}`,
      icon: ReceiptText,
    },
  ]

  const tools = [
    {
      href: "/dashboard/builder",
      title: "Website Builder",
      desc: "Generate a landing page from a prompt.",
      icon: Sparkles,
    },
    {
      href: "/dashboard/leads",
      title: "Lead Finder",
      desc: "Find local businesses that need a website.",
      icon: Search,
    },
    {
      href: "/dashboard/finance",
      title: "Finance",
      desc: "Create and track client invoices.",
      icon: ReceiptText,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s what&apos;s happening across your workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <stat.icon className="size-5" />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Jump back in
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => (
            <Card key={tool.href} className="group">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <tool.icon className="size-5" />
                </span>
                <CardTitle className="pt-2">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
                <Button asChild variant="secondary" size="sm" className="w-full">
                  <Link href={tool.href}>
                    Open
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Make the most of Foundry</h3>
              <Badge>Tip</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Find a lead, build their site with AI, then send an invoice — all
              in one place.
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/leads">Find your first lead</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
