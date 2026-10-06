import Link from "next/link"
import Image from "next/image"

interface CategoryCircleProps {
  name: string
  imageSrc: string
  href: string
}

export function CategoryCircle({ name, imageSrc, href }: CategoryCircleProps) {
  return (
    <Link href={href} className="flex flex-col items-center gap-4 min-w-[120px] md:min-w-[160px] snap-center group">
      <div className="relative h-24 w-24 md:h-40 md:w-40 overflow-hidden rounded-full bg-muted">
        <Image 
          src={imageSrc} 
          alt={name} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500" 
        />
      </div>
      <span className="text-[12px] font-semibold uppercase tracking-[0.1em]">{name}</span>
    </Link>
  )
}
