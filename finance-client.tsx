"use client"

import { useState } from "react"
import type { Invoice } from "@/lib/types"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DollarSign,
  FileText,
  TrendingUp,
  Clock,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { updateInvoiceStatus, deleteInvoice } from "@/app/dashboard/finance/actions"
import { InvoiceWizard } from "@/components/dashboard/invoice-wizard"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = ["Draft", "Sent", "Paid", "Overdue"]

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Paid: "default",
  Sent: "secondary",
  Draft: "outline",
  Overdue: "destructive",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function FinanceClient({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter()
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Summary stats
  const totalRevenue = invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const outstanding = invoices
    .filter((inv) => inv.status === "Sent" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0)

  const draftCount = invoices.filter((inv) => inv.status === "Draft").length
  const totalCount = invoices.length

  const handleStatusChange = async (id: string, status: string) => {
    setUpdatingId(id)
    const result = await updateInvoiceStatus(id, status)
    setUpdatingId(null)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(`Invoice marked as ${status}`)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const result = await deleteInvoice(id)
    setDeletingId(null)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Invoice deleted")
    if (selectedInvoice?.id === id) setSelectedInvoice(null)
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage client invoices.
          </p>
        </div>
        <InvoiceWizard />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <DollarSign className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Earned</p>
              <p className="text-xl font-semibold">{formatCurrency(totalRevenue)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <TrendingUp className="size-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Outstanding</p>
              <p className="text-xl font-semibold">{formatCurrency(outstanding)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Invoices</p>
              <p className="text-xl font-semibold">{totalCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-secondary">
              <Clock className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Drafts</p>
              <p className="text-xl font-semibold">{draftCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices table */}
      {invoices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <FileText className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium">No invoices yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first invoice to start tracking payments.
            </p>
            <InvoiceWizard />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.client_name}</p>
                      {invoice.client_email && (
                        <p className="text-xs text-muted-foreground">
                          {invoice.client_email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(invoice.created_at)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(invoice.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {updatingId === invoice.id ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Select
                          value={invoice.status}
                          onValueChange={(val) =>
                            handleStatusChange(invoice.id, val)
                          }
                        >
                          <SelectTrigger className="h-7 w-28 text-xs">
                            <SelectValue>
                              <Badge
                                variant={statusVariant[invoice.status] ?? "outline"}
                                className="text-xs"
                              >
                                {invoice.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => setSelectedInvoice(invoice)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        disabled={deletingId === invoice.id}
                        onClick={() => handleDelete(invoice.id)}
                      >
                        {deletingId === invoice.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Trash2 className="size-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Invoice detail dialog */}
      <Dialog
        open={!!selectedInvoice}
        onOpenChange={(open) => !open && setSelectedInvoice(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice — {selectedInvoice?.client_name}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              {/* Client info */}
              <div className="rounded-lg bg-secondary/40 p-4 text-sm">
                <p className="text-xs text-muted-foreground">Bill to</p>
                <p className="font-medium">{selectedInvoice.client_name}</p>
                {selectedInvoice.client_email && (
                  <p className="text-muted-foreground">{selectedInvoice.client_email}</p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Created {formatDate(selectedInvoice.created_at)}
                </p>
              </div>

              {/* Line items */}
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Line Items
                </p>
                {selectedInvoice.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {item.description}{" "}
                      <span className="text-xs">× {item.quantity}</span>
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.quantity * item.rate)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-semibold">
                  {formatCurrency(selectedInvoice.amount)}
                </span>
              </div>

              {/* Status + delete */}
              <div className="flex items-center justify-between pt-1">
                <Badge variant={statusVariant[selectedInvoice.status] ?? "outline"}>
                  {selectedInvoice.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={deletingId === selectedInvoice.id}
                  onClick={() => handleDelete(selectedInvoice.id)}
                >
                  {deletingId === selectedInvoice.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4 text-destructive" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
