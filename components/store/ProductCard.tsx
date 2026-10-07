import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export interface ProductCardProps {
  name: string
  price: string
  imageSrc: string
  href: string
  swatches?: string[]
  brand?: string
  compareAtPrice?: string
  savePercentage?: string
  isNew?: boolean
  isSale?: boolean
}

export function ProductCard({ name, price, imageSrc, href, swatches, brand, compareAtPrice, savePercentage, isNew, isSale }: ProductCardProps) {
  return (
    <Card className="group flex flex-col h-full overflow-hidden border-x border-b border-t-0 border-border/60 bg-background rounded-none shadow-none p-0">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted block shrink-0">
        <Link href={href} className="absolute inset-0 z-0">
          <Image 
            src={imageSrc} 
            alt={name} 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        </Link>
        {/* Plus Button Overlay */}
        <button className="absolute top-3 right-3 z-10 w-9 h-9 bg-background/95 backdrop-blur rounded-full flex items-center justify-center text-foreground hover:bg-background transition-colors border border-border shadow-sm">
          <Plus className="w-5 h-5 opacity-70" strokeWidth={1.5} />
        </button>
      </div>
      <CardContent className="flex flex-col gap-1.5 pt-3 pb-2 px-3 flex-grow">
        {brand && (
          <span className="text-[12px] text-muted-foreground tracking-wide">{brand}</span>
        )}
        <Link href={href} className="hover:underline">
          <CardTitle className="font-heading text-lg font-normal leading-tight line-clamp-1 text-foreground">
            {name}
          </CardTitle>
        </Link>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through opacity-70">{compareAtPrice}</span>
          )}
          <span className="text-[15px] font-semibold text-foreground tracking-tight">{price}</span>
          {savePercentage && (
            <span className="bg-secondary/50 px-2 py-1 text-[11px] font-medium text-foreground ml-auto rounded-sm">{savePercentage}</span>
          )}
        </div>
        {swatches && swatches.length > 0 && (
          <div className="flex gap-2 mt-3">
            {swatches.map((swatch, idx) => (
              <div 
                key={idx} 
                className="w-4 h-4 rounded-full border border-border/60 shadow-sm" 
                style={{ backgroundColor: swatch }} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
