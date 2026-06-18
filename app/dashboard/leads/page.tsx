import { createClient } from "@/lib/supabase/server"
import { LeadsClient } from "@/components/dashboard/leads-client"

export default async function LeadsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: leads } = await supabase
    .from("leads")
    .select("id, business_name, phone, location, has_website, saved_at")
    .eq("user_id", user!.id)
    .order("saved_at", { ascending: false })

  return <LeadsClient savedLeads={leads ?? []} />
}
