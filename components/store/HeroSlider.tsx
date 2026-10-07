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

  const slides = [
    {
      id: 1,
      imageSrc: "/images/hero_1.png",
      alt: "Timeless Indian Boutique Elegance",
    },
    {
      id: 2,
      imageSrc: "/images/hero_2.png",
      alt: "Burgundy Boutique Elegance",
    },
    {
      id: 3,
      imageSrc: "/images/hero_3.png",
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
              <div className="relative w-full">
                {/* Desktop Image */}
                <Image
                  src={slide.imageSrc}
                  alt={slide.alt}
                  width={1920}
                  height={800}
                  className={`w-full ${slide.mobileImageSrc ? 'hidden md:block h-auto' : 'h-[450px] md:h-auto'} object-cover object-center`}
                  priority={slide.id === 1}
                />
                {/* Mobile Image (Optional) */}
                {slide.mobileImageSrc && (
                  <Image
                    src={slide.mobileImageSrc}
                    alt={`${slide.alt} mobile`}
                    width={750}
                    height={1000}
                    className="w-full h-auto block md:hidden object-cover object-center"
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
