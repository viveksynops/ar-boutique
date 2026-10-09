import { AnnouncementBar } from "@/components/store/AnnouncementBar"
import { StoreHeader } from "@/components/store/StoreHeader"
import { HeroBanner } from "@/components/store/HeroBanner"
import { HeroSlider } from "@/components/store/HeroSlider"
import { SectionHeading } from "@/components/store/SectionHeading"
import { CategoryCircle } from "@/features/categories/components/CategoryCircle"
import { ProductCard } from "@/components/store/ProductCard"
import { StoreButton } from "@/components/store/StoreButton"
import { PromoBanner } from "@/components/store/PromoBanner"
import { BlogCard } from "@/features/blog/components/BlogCard"
import { StoreFooter } from "@/components/store/StoreFooter"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar text="FREE SHIPPING ON ORDERS OVER 150 AED | EASY RETURNS WITHIN 14 DAYS" />
      <StoreHeader />

      <main className="flex-1">
        <HeroSlider />

        <section className="pt-8 md:pt-12 pb-6 md:pb-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading className="mb-8 md:mb-12">Shop by Occasion</SectionHeading>
          <div className="flex gap-8 md:gap-12 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { name: "Wedding", img: "/images/cat_wedding.jpg" },
              { name: "Festive", img: "/images/cat_festive.jpg" },
              { name: "Party", img: "/images/cat_party.jpg" },
              { name: "Mehendi", img: "/images/cat_mehendi.jpg" },
              { name: "Sangeet", img: "/images/cat_sangeet.jpg" },
              { name: "Everyday", img: "/images/cat_everyday.jpg" },
            ].map((cat, i) => (
              <CategoryCircle 
                key={i} 
                name={cat.name} 
                imageSrc={cat.img} 
                href={`/shop/${cat.name.toLowerCase()}`} 
              />
            ))}
          </div>
        </section>

        <section className="py-6 md:py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading className="mb-8 md:mb-12">New Arrivals</SectionHeading>
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full relative mb-8 md:mb-12"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {[
                { brand: "AR Boutique Exclusive", name: "Midnight Blue Fusion Saree Gown", compareAtPrice: "349.00 AED", price: "299.99 AED", savePercentage: "Save 14%", img: "/images/new_arrival_1.jpg", isNew: true, isSale: true },
                { brand: "AR Boutique Exclusive", name: "Sunshine Yellow Anarkali Suit", compareAtPrice: "299.00 AED", price: "269.99 AED", savePercentage: "Save 10%", img: "/images/new_arrival_2.jpg", isNew: true, isSale: true },
                { brand: "AR Boutique Exclusive", name: "Blush Pink Cotton Kurti Set", compareAtPrice: "249.00 AED", price: "235.99 AED", savePercentage: "Save 5%", img: "/images/new_arrival_3_new.jpg", isNew: true, isSale: true },
                { brand: "AR Boutique Exclusive", name: "Emerald Silk Lehenga Choli", compareAtPrice: "329.00 AED", price: "289.99 AED", savePercentage: "Save 12%", img: "/images/new_arrival_4.jpg", isNew: true, isSale: true },
                { brand: "AR Boutique Exclusive", name: "Ivory Embroidered Anarkali Gown", compareAtPrice: "279.00 AED", price: "249.99 AED", savePercentage: "Save 10%", img: "/images/new_arrival_5.jpg", isNew: true, isSale: true },
                { brand: "AR Boutique Exclusive", name: "Midnight Blue Fusion Saree Gown", compareAtPrice: "349.00 AED", price: "299.99 AED", savePercentage: "Save 14%", img: "/images/new_arrival_1.jpg", isNew: true, isSale: true },
              ].map((prod, i) => (
                <CarouselItem key={i} className="pl-4 md:pl-6 basis-[45%] sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <ProductCard
                    brand={prod.brand}
                    name={prod.name}
                    compareAtPrice={prod.compareAtPrice}
                    price={prod.price}
                    savePercentage={prod.savePercentage}
                    imageSrc={prod.img}
                    href="/products/product-slug"
                    isNew={prod.isNew}
                    isSale={prod.isSale}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="-left-4 lg:-left-12 bg-background/90 hover:bg-background border-border" />
              <CarouselNext className="-right-4 lg:-right-12 bg-background/90 hover:bg-background border-border" />
            </div>
          </Carousel>
          <div className="flex justify-center">
            <StoreButton variant="outline" className="px-8 border-input text-foreground hover:bg-accent hover:text-accent-foreground">
              View All New Arrivals
            </StoreButton>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 mb-6 md:mt-10 md:mb-8">
          <div className="flex flex-col w-full gap-4 md:gap-6">
            <PromoBanner
              imageSrc="/images/promo_banner_new.jpg"
              eyebrow="LIMITED TIME ONLY"
              title="Summer Refresh"
              description="Enjoy up to 30% off selected styles."
              buttonText="SHOP THE SALE"
            />
          </div>
        </section>

        <section className="pt-6 pb-10 md:pt-8 md:pb-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading className="mb-2">From the Journal</SectionHeading>
          <p className="text-[13px] text-muted-foreground mb-8 md:mb-12">Discover the latest trends, styling tips, and brand news.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             {[
               { title: "How to transition your wardrobe for the new season", category: "Style Guide", img: "/images/journal_style.jpg" },
               { title: "Behind the scenes: The making of our latest collection", category: "Brand News", img: "/images/journal_bts_2.jpg" },
               { title: "5 effortless looks for your next summer getaway", category: "Inspiration", img: "/images/journal_inspiration.jpg" }
             ].map((post, i) => (
                <BlogCard
                  key={i}
                  title={post.title}
                  category={post.category}
                  imageSrc={post.img}
                  href="/journal/post-slug"
                />
             ))}
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
