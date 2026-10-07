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
      imageSrc: "/images/hero_banner_black_v2.png",
      mobileImageSrc: "/images/hero_banner_mobile_black_v2.png",
      alt: "Timeless Fashion, Modern You",
    },
    {
      id: 2,
      imageSrc: "/images/hero_banner_dawn.png",
      mobileImageSrc: "/images/hero_banner_dawn_mobile_v4.jpg",
      alt: "The Dawn Collection: True Radiance",
    },
    {
      id: 3,
      imageSrc: "/images/hero_banner_timeless.png",
      mobileImageSrc: "/images/hero_banner_timeless_mobile_v4.jpg",
      alt: "Timeless Style, Curated Boutique",
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
