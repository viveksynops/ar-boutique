"use client"

import * as React from "react"

interface SyncScrollLayoutProps {
  left: React.ReactNode
  right: React.ReactNode
}

export function SyncScrollLayout({ left, right }: SyncScrollLayoutProps) {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 lg:items-start relative">
      {/* Left: Gallery (Sticky) */}
      <div className="flex-1 min-w-0 lg:sticky lg:top-24">
        {left}
      </div>

      {/* Right: Details (Scrolls normally) */}
      <div className="mt-8 lg:mt-0">
        {right}
      </div>
    </div>
  )
}
