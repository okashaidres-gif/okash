import { createClient } from "@/lib/supabase/server"
import { FinanceClient } from "@/components/dashboard/finance-client"
import type { Invoice } from "@/lib/types"

export default async function FinancePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, client_name, client_email, amount, status, items, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })

  return <FinanceClient invoices={(invoices as Invoice[]) ?? []} />
}
