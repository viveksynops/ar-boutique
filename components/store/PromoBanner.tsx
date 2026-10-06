import Image from "next/image"
import { StoreButton } from "./StoreButton"

interface PromoBannerProps {
  imageSrc: string
  eyebrow: string
  title: string
  description: string
  buttonText: string
}

export function PromoBanner({ imageSrc, eyebrow, title, description, buttonText }: PromoBannerProps) {
  return (
    <section className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden bg-accent flex items-center justify-end">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover object-left md:w-2/3 md:max-w-[66%]"
        />
        <div className="absolute right-0 w-full md:w-1/2 p-8 md:p-16 flex flex-col items-center md:items-start text-center md:text-left z-10 bg-accent/80 md:bg-transparent">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] mb-4 text-primary">
            {eyebrow}
          </p>
          <h2 className="font-heading text-[28px] md:text-[36px] leading-[1.2] md:leading-[1.15] font-normal mb-4 text-primary">
            {title}
          </h2>
          <p className="text-base text-primary/80 mb-8 max-w-sm">
            {description}
          </p>
          <StoreButton className="px-8">{buttonText}</StoreButton>
        </div>
      </div>
    </section>
  )
}
