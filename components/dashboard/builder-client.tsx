"use client"

import { useState } from "react"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sparkles,
  Loader2,
  Save,
  Globe,
  Trash2,
  ExternalLink,
  Eye,
} from "lucide-react"
import { toast } from "sonner"
import {
  saveProject,
  publishProject,
  deleteProject,
} from "@/app/dashboard/builder/actions"
import { useRouter } from "next/navigation"

const examples = [
  "A cozy neighborhood coffee shop with online ordering",
  "A freelance photographer portfolio for weddings",
  "A local plumbing company offering 24/7 emergency service",
  "A yoga studio with class schedules and memberships",
]

export function BuilderClient({
  initialProjects,
  credits,
}: {
  initialProjects: Project[]
  credits: number
}) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [projectName, setProjectName] = useState("")
  const [html, setHtml] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewProject, setPreviewProject] = useState<Project | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Describe the website you want to build first.")
      return
    }
    if (credits <= 0) {
      toast.error("You're out of AI credits.")
      return
    }
    setIsGenerating(true)
    setHtml("")
    try {
      const res = await fetch("/api/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok || !res.body) {
        const msg = await res.text()
        throw new Error(msg || "Generation failed")
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        acc += decoder.decode(value, { stream: true })
        setHtml(acc)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!html) return
    setIsSaving(true)
    const result = await saveProject({ projectName, prompt, html })
    setIsSaving(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Project saved")
    setHtml("")
    setPrompt("")
    setProjectName("")
    router.refresh()
  }

  const handlePublish = async (id: string) => {
    const result = await publishProject(id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Published to " + result.domain)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Project deleted")
    router.refresh()
  }

  // strip markdown fences if model added them
  const cleanHtml = html.replace(/^```html\n?/i, "").replace(/```\s*$/i, "")

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          AI Website Builder
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe a website and Foundry will generate it. Each generation uses
          1 credit.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Prompt panel */}
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="Acme Coffee Co."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="prompt">Describe the website</Label>
              <Textarea
                id="prompt"
                rows={5}
                placeholder="A cozy coffee shop landing page with a menu, our story, and a contact section..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setPrompt(ex)}
                  className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                Generate
              </Button>
              {html && !isGenerating && (
                <Button
                  variant="secondary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  Save project
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live preview */}
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Eye className="size-4 text-muted-foreground" />
              Live preview
            </span>
            {isGenerating && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Generating…
              </span>
            )}
          </div>
          <div className="h-[420px] bg-white">
            {cleanHtml ? (
              <iframe
                title="Generated site preview"
                srcDoc={cleanHtml}
                className="size-full"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted/30 text-sm text-muted-foreground">
                Your generated website will appear here
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Saved projects */}
      <div>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Your projects
        </h2>
        {initialProjects.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No projects yet. Generate and save your first website above.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {initialProjects.map((project) => (
              <Card key={project.id} className="flex flex-col">
                <CardContent className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium leading-tight">
                      {project.project_name}
                    </h3>
                    <Badge
                      variant={
                        project.status === "published" ? "default" : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {project.prompt_used}
                  </p>
                  {project.domain_url && (
                    <a
                      href={project.domain_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="size-3" />
                      {project.domain_url.replace("https://", "")}
                    </a>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setPreviewProject(project)}
                    >
                      <Eye className="size-4" />
                      Preview
                    </Button>
                    {project.status !== "published" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePublish(project.id)}
                      >
                        <Globe className="size-4" />
                        Publish
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Preview dialog */}
      <Dialog
        open={!!previewProject}
        onOpenChange={(open) => !open && setPreviewProject(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewProject?.project_name}</DialogTitle>
          </DialogHeader>
          <div className="h-[60vh] overflow-hidden rounded-lg border border-border bg-white">
            {previewProject?.generated_html && (
              <iframe
                title="Project preview"
                srcDoc={previewProject.generated_html}
                className="size-full"
                sandbox="allow-scripts"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
