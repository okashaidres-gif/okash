import { generateText, Output } from "ai"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 60

const schema = z.object({
  leads: z.array(
    z.object({
      business_name: z.string(),
      phone: z.string(),
      location: z.string(),
      category: z.string(),
      has_website: z.boolean(),
    }),
  ),
})

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { niche, location } = await req.json()

  if (!niche || !location) {
    return Response.json({ error: "Missing niche or location" }, { status: 400 })
  }

  const { experimental_output } = await generateText({
    model: "openai/gpt-5.4-mini",
    experimental_output: Output.object({ schema }),
    prompt: `Generate 8 realistic but FICTIONAL local business leads for the niche "${niche}" in "${location}".
These represent small businesses a freelancer might pitch web design services to.
Make names, phone numbers, and street/area locations plausible for ${location}.
About half should have has_website = false (these are the best prospects).
Use realistic local phone number formatting for the region.`,
  })

  return Response.json(experimental_output)
}
