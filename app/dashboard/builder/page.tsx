import { createClient } from "@/lib/supabase/server"
import { BuilderClient } from "@/components/dashboard/builder-client"

export default async function BuilderPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: projects }, { data: profile }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, project_name, prompt_used, generated_html, status, domain_url, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("users_profile")
      .select("credits")
      .eq("id", user!.id)
      .single(),
  ])

  return (
    <BuilderClient
      initialProjects={projects ?? []}
      credits={profile?.credits ?? 0}
    />
  )
}
