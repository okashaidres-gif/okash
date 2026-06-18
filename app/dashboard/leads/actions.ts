"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveLead(input: {
  business_name: string
  phone: string
  location: string
  has_website: boolean
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase.from("leads").insert({
    user_id: user.id,
    business_name: input.business_name,
    phone: input.phone,
    location: input.location,
    has_website: input.has_website,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard")
  return { success: true }
}

export async function deleteLead(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/leads")
  revalidatePath("/dashboard")
  return { success: true }
}
