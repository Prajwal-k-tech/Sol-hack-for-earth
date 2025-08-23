import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-surface-overlay-1/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
