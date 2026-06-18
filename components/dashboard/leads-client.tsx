"use client"

import { useState } from "react"
import type { Lead } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Loader2, Plus, Trash2, Phone, MapPin } from "lucide-react"
import { toast } from "sonner"
import { saveLead, deleteLead } from "@/app/dashboard/leads/actions"
import { useRouter } from "next/navigation"

type SearchResult = {
  business_name: string
  phone: string
  location: string
  category: string
  has_website: boolean
}

export function LeadsClient({ savedLeads }: { savedLeads: Lead[] }) {
  const router = useRouter()
  const [niche, setNiche] = useState("")
  const [location, setLocation] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!niche.trim() || !location.trim()) {
      toast.error("Enter both a niche and a location.")
      return
    }
    setIsSearching(true)
    setResults([])
    try {
      const res = await fetch("/api/find-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, location }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Search failed")
      setResults(data.leads ?? [])
      if ((data.leads ?? []).length === 0) {
        toast.message("No results — try a different search.")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Search failed")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSave = async (lead: SearchResult) => {
    setSavingKey(lead.business_name + lead.phone)
    const result = await saveLead({
      business_name: lead.business_name,
      phone: lead.phone,
      location: lead.location,
      has_website: lead.has_website,
    })
    setSavingKey(null)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(`Saved ${lead.business_name}`)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    const result = await deleteLead(id)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Lead removed")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Lead Finder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover local businesses by niche and location. Save the best
          prospects to your pipeline.
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="flex flex-col gap-2">
              <Label htmlFor="niche">Niche / industry</Label>
              <Input
                id="niche"
                placeholder="Coffee shops"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Austin, TX"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {(results.length > 0 || isSearching) && (
        <div>
          <h2 className="mb-4 text-sm font-medium text-muted-foreground">
            Search results
          </h2>
          {isSearching ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Finding businesses…
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {results.map((lead) => {
                const key = lead.business_name + lead.phone
                return (
                  <Card key={key}>
                    <CardContent className="flex items-start justify-between gap-4 p-4">
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-medium">
                            {lead.business_name}
                          </h3>
                          {lead.has_website ? (
                            <Badge variant="secondary">Has site</Badge>
                          ) : (
                            <Badge>No website</Badge>
                          )}
                        </div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {lead.location}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="size-3" />
                          {lead.phone}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSave(lead)}
                        disabled={savingKey === key}
                      >
                        {savingKey === key ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Plus className="size-4" />
                        )}
                        Save
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Saved leads */}
      <div>
        <h2 className="mb-4 text-sm font-medium text-muted-foreground">
          Saved leads ({savedLeads.length})
        </h2>
        {savedLeads.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              No saved leads yet. Search above and save your best prospects.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      {lead.business_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.location}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lead.phone}
                    </TableCell>
                    <TableCell>
                      {lead.has_website ? (
                        <Badge variant="secondary">Has site</Badge>
                      ) : (
                        <Badge>Prospect</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(lead.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                        <span className="sr-only">Delete lead</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  )
}
