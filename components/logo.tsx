import { cn } from "@/lib/utils"
import { Hexagon } from "lucide-react"

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Hexagon className="size-4 fill-current" />
      </span>
      {showText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Foundry
        </span>
      )}
    </span>
  )
}
