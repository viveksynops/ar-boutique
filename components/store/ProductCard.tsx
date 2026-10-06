import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardTitle } from "@/components/ui/card"

export interface ProductCardProps {
  name: string
  price: string
  imageSrc: string
  href: string
  swatches?: string[]
}

export function ProductCard({ name, price, imageSrc, href, swatches }: ProductCardProps) {
  return (
    <Card className="group flex flex-col h-full overflow-hidden">
      <Link href={href} className="relative aspect-[4/5] overflow-hidden bg-muted block shrink-0">
        <Image 
          src={imageSrc} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </Link>
      <CardContent className="flex flex-col gap-2 pt-4 flex-grow">
        <Link href={href} className="hover:underline">
          <CardTitle className="text-base font-normal">
            {name}
          </CardTitle>
        </Link>
        <span className="text-base font-medium">{price}</span>
        {swatches && swatches.length > 0 && (
          <div className="flex gap-2 mt-1">
            {swatches.map((swatch, idx) => (
              <div 
                key={idx} 
                className="w-4 h-4 rounded-full border border-border shadow-sm" 
                style={{ backgroundColor: swatch }} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
