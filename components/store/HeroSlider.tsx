"use client"

import * as React from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

export function HeroSlider() {
  const pluginAutoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  type Slide = {
    id: number
    imageSrc: string
    alt: string
    mobileImageSrc?: string
  }

  const slides: Slide[] = [
    {
      id: 1,
      imageSrc: "/images/hero_1.png",
      mobileImageSrc: "/images/hero_1_mobile_v3.jpg",
      alt: "Timeless Indian Boutique Elegance",
    },
    {
      id: 2,
      imageSrc: "/images/hero_2.png",
      mobileImageSrc: "/images/hero_2_mobile_v2.jpg",
      alt: "Burgundy Boutique Elegance",
    },
    {
      id: 3,
      imageSrc: "/images/hero_3.png",
      mobileImageSrc: "/images/hero_3_mobile_v2.jpg",
      alt: "Timeless Traditions Heritage Elegance",
    },
  ]

  return (
    <section className="relative w-full">
      <Carousel
        plugins={[pluginAutoplay.current]}
        className="w-full"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative w-full aspect-[5/6] md:aspect-[2.4/1]">
                {/* Desktop Image */}
                <Image
                  src={slide.imageSrc}
                  alt={slide.alt}
                  fill
                  className={`object-cover object-center ${slide.mobileImageSrc ? 'hidden md:block' : 'block'}`}
                  priority={slide.id === 1}
                />
                {/* Mobile Image (Optional) */}
                {slide.mobileImageSrc && (
                  <Image
                    src={slide.mobileImageSrc}
                    alt={`${slide.alt} mobile`}
                    fill
                    className="object-cover object-center block md:hidden"
                    priority={slide.id === 1}
                  />
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
