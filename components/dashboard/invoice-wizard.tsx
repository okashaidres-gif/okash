"use client"

import { useState } from "react"
import type { InvoiceItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, ArrowLeft, ArrowRight, Loader2, Check } from "lucide-react"
import { toast } from "sonner"
import { createInvoice } from "@/app/dashboard/finance/actions"
import { useRouter } from "next/navigation"

const STEPS = ["Client", "Line items", "Review"]

const emptyItem: InvoiceItem = { description: "", quantity: 1, rate: 0 }

export function InvoiceWizard() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([{ ...emptyItem }])
  const [isSaving, setIsSaving] = useState(false)

  const total = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.rate || 0),
    0,
  )

  const reset = () => {
    setStep(0)
    setClientName("")
    setClientEmail("")
    setItems([{ ...emptyItem }])
  }

  const updateItem = (index: number, patch: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    )
  }

  const canNext =
    step === 0
      ? clientName.trim().length > 0
      : step === 1
        ? items.every((i) => i.description.trim().length > 0) && total > 0
        : true

  const handleSubmit = async () => {
    setIsSaving(true)
    const result = await createInvoice({
      client_name: clientName,
      client_email: clientEmail,
      items: items.map((i) => ({
        description: i.description,
        quantity: Number(i.quantity),
        rate: Number(i.rate),
      })),
    })
    setIsSaving(false)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Invoice created")
    setOpen(false)
    reset()
    router.refresh()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          New invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create invoice</DialogTitle>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span
                className={`text-xs ${i <= step ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="h-px flex-1 bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[220px] py-2">
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="client-name">Client name</Label>
                <Input
                  id="client-name"
                  placeholder="Acme Coffee Co."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="client-email">Client email (optional)</Label>
                <Input
                  id="client-email"
                  type="email"
                  placeholder="billing@acme.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex flex-1 flex-col gap-1.5">
                    {i === 0 && <Label className="text-xs">Description</Label>}
                    <Input
                      placeholder="Website design"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(i, { description: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex w-16 flex-col gap-1.5">
                    {i === 0 && <Label className="text-xs">Qty</Label>}
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(i, { quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="flex w-24 flex-col gap-1.5">
                    {i === 0 && <Label className="text-xs">Rate ($)</Label>}
                    <Input
                      type="number"
                      min={0}
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(i, { rate: Number(e.target.value) })
                      }
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={items.length === 1}
                    onClick={() =>
                      setItems((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setItems((prev) => [...prev, { ...emptyItem }])}
              >
                <Plus className="size-4" />
                Add line item
              </Button>
              <div className="flex justify-end pt-2 text-sm">
                <span className="text-muted-foreground">
                  Total:&nbsp;
                  <span className="font-semibold text-foreground">
                    ${total.toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 rounded-lg border border-border bg-secondary/30 p-4">
              <div>
                <p className="text-xs text-muted-foreground">Bill to</p>
                <p className="font-medium">{clientName}</p>
                {clientEmail && (
                  <p className="text-sm text-muted-foreground">{clientEmail}</p>
                )}
              </div>
              <div className="space-y-1.5">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-muted-foreground"
                  >
                    <span>
                      {item.description} × {item.quantity}
                    </span>
                    <span>
                      ${(Number(item.quantity) * Number(item.rate)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-border pt-3 font-semibold">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext}
            >
              Next
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Create invoice
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
