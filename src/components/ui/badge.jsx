import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  default: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-slate-700 text-slate-200 hover:bg-slate-600",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "border border-slate-600 text-slate-300",
  success: "bg-green-500 text-white hover:bg-green-600",
  warning: "bg-yellow-500 text-white hover:bg-yellow-600",
}

function Badge({ className, variant = "default", ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
