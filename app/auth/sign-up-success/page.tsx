import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { MailCheck } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <MailCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Check your inbox
            </h1>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              We&apos;ve sent a confirmation link to your email. Confirm your
              address to activate your workspace, then log in.
            </p>
          </div>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
