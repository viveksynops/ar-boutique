import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function SectionHeading({ className, children, ...props }: SectionHeadingProps) {
  return (
    <h2 
      className={cn("text-center font-heading text-2xl md:text-[32px] leading-[1.2] font-normal", className)}
      {...props}
    >
      {children}
    </h2>
  )
}
