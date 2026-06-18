import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Topbar } from "@/components/dashboard/topbar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("users_profile")
    .select("subscription_plan, credits")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex min-h-svh bg-background">
      <SidebarNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          email={user.email ?? "user@foundry.app"}
          plan={profile?.subscription_plan ?? "Free"}
          credits={profile?.credits ?? 0}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
