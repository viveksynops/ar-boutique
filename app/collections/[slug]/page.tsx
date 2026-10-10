import * as React from "react"
import { StoreHeader } from "@/components/store/StoreHeader"
import { StoreFooter } from "@/components/store/StoreFooter"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ProductGallery } from "@/components/store/ProductGallery"
import { SyncScrollLayout } from "@/components/store/SyncScrollLayout"
import { ProductInfo } from "@/components/store/ProductInfo"
import { ProductCard } from "@/components/store/ProductCard"

const MOCK_PRODUCT = {
  id: "1",
  name: "Midnight Blue Fusion Saree Gown",
  brand: "Lilium By Shrivha",
  sku: "LS1150",
  price: "299.99 AED",
  compareAtPrice: "349.00 AED",
  description: "A stunning fusion of traditional saree draping with the modern silhouette of a gown. Featuring intricate embroidery along the bodice and a sweeping georgette skirt, this piece is perfect for evening receptions.",
  images: [
    "/images/JAA25DR01202.jpeg",
    "/images/JAA25DR01202-1.jpeg",
    "/images/JAA25DR01202-2.jpeg",
    "/images/JAA25DR01202-3.jpeg",
    "/images/JAA25DR01202-4.jpeg",
    "/images/JAA25DR01202-5.jpeg",
    "/images/JAA25DR01202-6.jpeg",
    "/images/JAA25DR01202-7.jpeg",
    "/images/JAA25DR01202-8.jpeg",
  ],
  sizes: [
    { id: "s1", name: "XS-32" },
    { id: "s2", name: "S-34" },
    { id: "s3", name: "M-36" },
    { id: "s4", name: "L-38" },
    { id: "s5", name: "XL-40" },
    { id: "s6", name: "2XL-42" },
    { id: "s7", name: "3XL-44" },
  ]
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const product = MOCK_PRODUCT
  
  // Format slug to Title Case
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <StoreHeader />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Breadcrumb>
            <BreadcrumbList className="text-xs sm:text-sm">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-primary hover:text-primary/80">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/collections" className="text-primary hover:text-primary/80">New Arrivals</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-muted-foreground">{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pb-24">
          <SyncScrollLayout
            left={<ProductGallery images={product.images} />}
            right={<ProductInfo product={product} title={title} />}
          />

          {/* Recommended Products */}
          <div className="mt-24 pt-16 border-t border-border">
            <h2 className="font-heading text-2xl sm:text-3xl text-foreground text-center mb-10">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  id: "2",
                  name: "Emerald Green Satin Gown",
                  brand: "Lilium By Shrivha",
                  price: "349.00 AED",
                  imageSrc: "/images/JAA25DR01202-6.jpeg",
                  href: "/collections/emerald-green-satin-gown"
                },
                {
                  id: "3",
                  name: "Ruby Red Anarkali Suit",
                  brand: "Aura Collection",
                  price: "499.00 AED",
                  compareAtPrice: "599.00 AED",
                  imageSrc: "/images/JAA25DR01202-7.jpeg",
                  href: "/collections/ruby-red-anarkali-suit"
                },
                {
                  id: "4",
                  name: "Pearl White Lehenga Choli",
                  brand: "Lilium By Shrivha",
                  price: "699.00 AED",
                  imageSrc: "/images/JAA25DR01202-8.jpeg",
                  href: "/collections/pearl-white-lehenga-choli"
                },
                {
                  id: "5",
                  name: "Midnight Blue Lehenga",
                  brand: "Lilium By Shrivha",
                  price: "799.00 AED",
                  imageSrc: "/images/JAA25DR01202.jpeg",
                  href: "/collections/midnight-blue-lehenga"
                },
                {
                  id: "6",
                  name: "Rose Pink Silk Kurta",
                  brand: "Aura Collection",
                  price: "249.00 AED",
                  imageSrc: "/images/JAA25DR01202-1.jpeg",
                  href: "/collections/rose-pink-silk-kurta"
                }
              ].map((rec, index) => (
                <div key={rec.id} className={index === 4 ? "hidden md:block" : "block"}>
                  <ProductCard
                    name={rec.name}
                    brand={rec.brand}
                    price={rec.price}
                    compareAtPrice={rec.compareAtPrice}
                    imageSrc={rec.imageSrc}
                    href={rec.href}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  )
}
