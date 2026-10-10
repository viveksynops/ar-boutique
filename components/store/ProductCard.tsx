"use client"

import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"

export interface ProductCardProps {
  name: string
  price: string
  imageSrc: string
  href: string
  brand?: string
  compareAtPrice?: string
}

export function ProductCard({ name, price, imageSrc, href, brand, compareAtPrice }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col w-full">


      {/* Image container and badges */}
      <div className="relative w-full">
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted rounded-sm">
          <Image 
            src={imageSrc} 
            alt={name} 
            fill 
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            unoptimized
          />
        </div>

        {/* Quick Add Button */}
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Add to cart logic will go here
          }}
          aria-label={`Add ${name} to bag`}
          className="absolute top-2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm text-foreground shadow-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring before:absolute before:-inset-2"
        >
          <Plus className="h-5 w-5 opacity-80" strokeWidth={1.5} />
        </button>
      </div>
      
      {/* Text Content */}
      <div className="flex flex-col gap-0.5 pt-3">
        {brand && (
          <span className="text-[13px] text-muted-foreground font-sans">{brand}</span>
        )}
        <div className="mt-0.5 relative z-10">
          <h3 className="font-sans text-[15px] font-medium leading-tight truncate text-foreground pointer-events-none" title={name}>
            {name}
          </h3>
        </div>
        <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
          <span className="text-[15px] font-bold text-foreground font-sans">{price}</span>
          {compareAtPrice && (
            <span className="text-[13px] text-muted-foreground line-through font-sans">{compareAtPrice}</span>
          )}
        </div>
      </div>
      
      {/* The main hit area link */}
      <Link 
        href={href} 
        className="absolute inset-0 z-[1] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" 
        aria-label={`View ${name}`}
      >
        <span className="sr-only">View {name}</span>
      </Link>
    </div>
  )
}
