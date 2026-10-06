import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const StoreButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn("h-12 uppercase tracking-[0.12em] text-[12px] rounded-none", className)}
        {...props}
      />
    )
  }
)
StoreButton.displayName = "StoreButton"
