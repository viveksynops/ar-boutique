import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function SectionHeading({ className, children, ...props }: SectionHeadingProps) {
  return (
    <h2 
      className={cn("text-center font-heading text-2xl uppercase tracking-[0.08em]", className)}
      {...props}
    >
      {children}
    </h2>
  )
}
