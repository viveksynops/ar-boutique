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
    <div className="flex flex-col md:flex-row w-full h-[320px] md:h-[380px] bg-accent">
      <div className="relative w-full md:w-[60%] h-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover object-center"
        />
      </div>
      <div className="w-full md:w-[40%] h-full p-8 md:p-12 flex flex-col items-center justify-center text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-4 text-foreground/70">
          {eyebrow}
        </p>
        <h2 className="font-heading text-[36px] leading-[1.1] font-normal mb-4 text-foreground">
          {title}
        </h2>
        <p className="text-[13px] text-foreground/80 mb-8 max-w-[220px] mx-auto">
          {description}
        </p>
        <StoreButton className="px-8 bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-[11px] font-semibold h-12 rounded-none">
          {buttonText}
        </StoreButton>
      </div>
    </div>
  )
}
