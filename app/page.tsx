import { AnnouncementBar } from "@/components/store/AnnouncementBar"
import { StoreHeader } from "@/components/store/StoreHeader"
import { HeroBanner } from "@/components/store/HeroBanner"
import { SectionHeading } from "@/components/store/SectionHeading"
import { CategoryCircle } from "@/features/categories/components/CategoryCircle"
import { ProductCard } from "@/components/store/ProductCard"
import { StoreButton } from "@/components/store/StoreButton"
import { TrustStrip } from "@/components/store/TrustStrip"
import { PromoBanner } from "@/components/store/PromoBanner"
import { BlogCard } from "@/features/blog/components/BlogCard"
import { StoreFooter } from "@/components/store/StoreFooter"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar text="FREE SHIPPING ON ORDERS OVER 150 AED | EASY RETURNS WITHIN 14 DAYS" />
      <StoreHeader />

      <main className="flex-1">
        <HeroBanner 
          imageSrc="/images/hero_banner.png" 
          mobileImageSrc="/images/hero_banner_mobile.jpg" 
        />

        <section className="pt-10 md:pt-24 pb-6 md:pb-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading className="mb-8 md:mb-12">Shop by Category</SectionHeading>
          <div className="flex gap-8 md:gap-12 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { name: "Dresses", img: "/images/cat_dresses.jpg" },
              { name: "Tops", img: "/images/cat_tops.jpg" },
              { name: "Bottoms", img: "/images/cat_bottoms.jpg" },
              { name: "Accessories", img: "/images/cat_accessories.jpg" },
              { name: "Outerwear", img: "/images/cat_outerwear.jpg" },
              { name: "Sale", img: "/images/cat_sale.jpg" },
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

        <section className="py-6 md:py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading className="mb-8 md:mb-12">New Arrivals</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 mb-8 md:mb-12">
            {[
              { name: "Ribbed Knit Top", price: "AED 490", img: "/images/cat_tops.jpg", swatches: ["#FFFFFF", "#000000"] },
              { name: "Oversized Blazer", price: "AED 890", img: "/images/cat_outerwear.jpg", swatches: ["#F5F5DC"] },
              { name: "Classic White Shirt", price: "AED 590", img: "/images/product_photo.jpg", swatches: ["#FFFFFF"] },
              { name: "Tailored Wide Leg Pants", price: "AED 790", img: "/images/cat_bottoms.jpg", swatches: ["#FFFFFF", "#000000"] },
            ].map((prod, i) => (
              <ProductCard
                key={i}
                name={prod.name}
                price={prod.price}
                imageSrc={prod.img}
                href="/products/product-slug"
                swatches={prod.swatches}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <StoreButton variant="outline" className="px-8 border-input text-foreground hover:bg-accent hover:text-accent-foreground">
              View All New Arrivals
            </StoreButton>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 mb-6 md:mt-16 md:mb-12">
          <div className="flex flex-col w-full gap-4 md:gap-6">
            <TrustStrip />
            <PromoBanner
              imageSrc="/images/promo_banner.jpg"
              eyebrow="LIMITED TIME ONLY"
              title="Summer Refresh"
              description="Enjoy up to 30% off selected styles."
              buttonText="SHOP THE SALE"
            />
          </div>
        </section>

        <section className="pt-6 pb-12 md:pt-12 md:pb-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading className="mb-2">From the Journal</SectionHeading>
          <p className="text-[13px] text-muted-foreground mb-8 md:mb-12">Discover the latest trends, styling tips, and brand news.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             {[
               { title: "How to transition your wardrobe for the new season", category: "Style Guide", img: "/images/cat_outerwear.jpg" },
               { title: "Behind the scenes: The making of our latest collection", category: "Brand News", img: "/images/hero_banner.jpg" },
               { title: "5 effortless looks for your next summer getaway", category: "Inspiration", img: "/images/promo_banner.jpg" }
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
