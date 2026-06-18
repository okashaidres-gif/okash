"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { InvoiceItem } from "@/lib/types"

export async function createInvoice(input: {
  client_name: string
  client_email: string
  items: InvoiceItem[]
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const amount = input.items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.rate),
    0,
  )

  const { error } = await supabase.from("invoices").insert({
    user_id: user.id,
    client_name: input.client_name,
    client_email: input.client_email || null,
    amount,
    status: "Draft",
    items: input.items,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/finance")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function updateInvoiceStatus(id: string, status: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/finance")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteInvoice(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/finance")
  revalidatePath("/dashboard")
  return { success: true }
}
