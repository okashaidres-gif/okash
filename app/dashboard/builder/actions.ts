"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProject(input: {
  projectName: string
  prompt: string
  html: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Decrement a credit (server-side, scoped to the user)
  const { data: profile } = await supabase
    .from("users_profile")
    .select("credits")
    .eq("id", user.id)
    .single()

  if (!profile || profile.credits <= 0) {
    return { error: "No credits remaining" }
  }

  const { error: creditError } = await supabase
    .from("users_profile")
    .update({ credits: profile.credits - 1 })
    .eq("id", user.id)

  if (creditError) {
    return { error: creditError.message }
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      project_name: input.projectName || "Untitled site",
      prompt_used: input.prompt,
      generated_html: input.html,
      status: "draft",
    })
    .select("id")
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/builder")
  revalidatePath("/dashboard")
  return { id: data.id }
}

export async function publishProject(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const domain = `https://${crypto.randomUUID().slice(0, 8)}.foundry.site`

  const { error } = await supabase
    .from("projects")
    .update({ status: "published", domain_url: domain })
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/builder")
  return { domain }
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/builder")
  revalidatePath("/dashboard")
  return { success: true }
}
