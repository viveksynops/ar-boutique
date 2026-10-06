import Image from "next/image"
import { StoreButton } from "./StoreButton"

interface HeroBannerProps {
  imageSrc: string
  eyebrow: string
  title: React.ReactNode
  description: React.ReactNode
  buttonText: string
}

export function HeroBanner({ imageSrc, eyebrow, title, description, buttonText }: HeroBannerProps) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[600px] w-full md:h-[700px] lg:h-[800px]">
        <Image
          src={imageSrc}
          alt={typeof title === "string" ? title : "Hero banner"}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-md bg-transparent p-6 sm:p-0">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] mb-4 text-primary/80">
                {eyebrow}
              </p>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[64px] leading-[1.05] mb-6 text-primary">
                {title}
              </h1>
              <p className="text-base text-primary/80 mb-8 max-w-sm">
                {description}
              </p>
              <StoreButton className="px-8">{buttonText}</StoreButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
