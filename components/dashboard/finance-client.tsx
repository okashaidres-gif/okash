"use client"

import { useState } from "react"
import type { Invoice } from "@/lib/types"
import { InvoiceWizard } from "./invoice-wizard"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { deleteInvoice, updateInvoiceStatus } from "@/app/dashboard/finance/actions"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const STATUS_OPTIONS = ["Draft", "Sent", "Paid"]

export function FinanceClient({ invoices }: { invoices: Invoice[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    const result = await deleteInvoice(id)
    setIsDeleting(null)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success("Invoice deleted")
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsUpdating(id)
    const result = await updateInvoiceStatus(id, status)
    setIsUpdating(null)
    if (result.error) {
      toast.error(result.error)
      return
    }
    toast.success(`Status updated to ${status}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Finance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your invoices and billing.
          </p>
        </div>
        <InvoiceWizard />
      </div>

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-sm text-muted-foreground">
            No invoices yet. Create your first invoice to get started.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.client_name}
                    {invoice.client_email && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        {invoice.client_email}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex cursor-pointer items-center outline-none">
                        <Badge
                          variant={
                            invoice.status === "Paid"
                              ? "default"
                              : invoice.status === "Sent"
                                ? "secondary"
                                : "outline"
                          }
                          className="hover:opacity-80"
                        >
                          {isUpdating === invoice.id ? (
                            <Loader2 className="mr-1 size-3 animate-spin" />
                          ) : null}
                          {invoice.status}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {STATUS_OPTIONS.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleUpdateStatus(invoice.id, status)}
                            disabled={invoice.status === status || isUpdating === invoice.id}
                          >
                            Mark as {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(invoice.id)}
                      disabled={isDeleting === invoice.id}
                    >
                      {isDeleting === invoice.id ? (
                        <Loader2 className="size-4 animate-spin text-destructive" />
                      ) : (
                        <Trash2 className="size-4 text-destructive" />
                      )}
                      <span className="sr-only">Delete invoice</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
