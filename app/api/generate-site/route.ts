import { createClient } from "@/lib/supabase/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 60

const SYSTEM_PROMPT = `Act as an elite frontend developer.
Based on the user's input prompt, generate a fully responsive, stunning, modern landing page.
Return ONLY raw HTML with inline Tailwind CSS. Do not wrap it in markdown code blocks (like \`\`\`html), and do not include any conversational text or explanations. Just pure code.
Use dynamic image placeholders from Unsplash (e.g., https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80) that match the user's business industry.
Write professional, high-converting copy tailored to the business name and niche (Never use "Lorem Ipsum").`

export async function POST(req: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response("Unauthorized", { status: 401 })
  }

  const { data: profile } = await supabase
    .from("users_profile")
    .select("credits")
    .eq("id", user.id)
    .single()

  if (!profile || profile.credits <= 0) {
    return new Response("No credits remaining", { status: 402 })
  }

  const { prompt } = await req.json()

  if (!prompt || typeof prompt !== "string") {
    return new Response("Missing prompt", { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response("Missing Gemini API Key", { status: 500 })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
  })

  try {
    const result = await model.generateContentStream(`Build a landing page for: ${prompt}`)

    const stream = new ReadableStream({
      async start(controller) {
        let fullHtml = ""
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            fullHtml += text
            controller.enqueue(new TextEncoder().encode(text))
          }

          const cleanHtml = fullHtml.replace(/^```html\n?/i, "").replace(/```\s*$/i, "")

          await supabase.from("projects").insert({
            user_id: user.id,
            project_name: "AI Generated Site",
            prompt_used: prompt,
            generated_html: cleanHtml,
            status: "draft",
          })
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Generation error:", error)
    return new Response("Generation failed", { status: 500 })
  }
}
