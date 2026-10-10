import { AnnouncementBar } from "@/components/store/AnnouncementBar"
import { StoreHeader } from "@/components/store/StoreHeader"
import { StoreFooter } from "@/components/store/StoreFooter"
import { ProductCard } from "@/components/store/ProductCard"
import { SidebarFilters } from "@/features/catalog/components/SidebarFilters"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Filter } from "lucide-react"

// Mock Data
const MOCK_PRODUCTS = [
  { brand: "AR Boutique Exclusive", name: "Midnight Blue Fusion Saree Gown", compareAtPrice: "349.00 AED", price: "299.99 AED", savePercentage: "Save 14%", img: "/images/new_arrival_1.jpg", isNew: true, isSale: true, swatches: ["#1e3a8a", "#000000"] },
  { brand: "AR Boutique Exclusive", name: "Sunshine Yellow Anarkali Suit", compareAtPrice: "299.00 AED", price: "269.99 AED", savePercentage: "Save 10%", img: "/images/new_arrival_2.jpg", isNew: true, isSale: true, swatches: ["#fde047"] },
  { brand: "AR Boutique Exclusive", name: "Blush Pink Cotton Kurti Set", compareAtPrice: "249.00 AED", price: "235.99 AED", savePercentage: "Save 5%", img: "/images/new_arrival_3_new.jpg", isNew: true, isSale: true, swatches: ["#fbcfe8", "#ffffff"] },
  { brand: "AR Boutique Exclusive", name: "Emerald Silk Lehenga Choli", compareAtPrice: "329.00 AED", price: "289.99 AED", savePercentage: "Save 12%", img: "/images/new_arrival_4.jpg", isNew: true, isSale: true, swatches: ["#10b981"] },
  { brand: "AR Boutique Exclusive", name: "Ivory Embroidered Anarkali Gown", compareAtPrice: "279.00 AED", price: "249.99 AED", savePercentage: "Save 10%", img: "/images/new_arrival_5.jpg", isNew: true, isSale: true, swatches: ["#fefcbf"] },
  { brand: "AR Boutique Exclusive", name: "Royal Maroon Velvet Lehenga", compareAtPrice: "499.00 AED", price: "450.00 AED", savePercentage: "Save 10%", img: "/images/new_arrival_1.jpg", isNew: false, isSale: true, swatches: ["#831843"] },
  { brand: "AR Boutique Exclusive", name: "Pastel Mint Green Sharara", price: "275.00 AED", img: "/images/new_arrival_2.jpg", isNew: false, isSale: false, swatches: ["#6ee7b7"] },
  { brand: "AR Boutique Exclusive", name: "Classic Golden Saree", price: "320.00 AED", img: "/images/new_arrival_3_new.jpg", isNew: false, isSale: false, swatches: ["#eab308"] },
  { brand: "AR Boutique Exclusive", name: "Ruby Red Festive Kurta", compareAtPrice: "220.00 AED", price: "199.99 AED", savePercentage: "Save 9%", img: "/images/new_arrival_4.jpg", isNew: false, isSale: true, swatches: ["#b91c1c"] },
  { brand: "AR Boutique Exclusive", name: "Ocean Blue Satin Gown", price: "310.00 AED", img: "/images/new_arrival_5.jpg", isNew: true, isSale: false, swatches: ["#0284c7"] },
  { brand: "AR Boutique Exclusive", name: "Rose Gold Embellished Suit", price: "285.00 AED", img: "/images/new_arrival_1.jpg", isNew: false, isSale: false, swatches: ["#fda4af"] },
  { brand: "AR Boutique Exclusive", name: "Charcoal Black Indo-Western", price: "340.00 AED", img: "/images/new_arrival_2.jpg", isNew: false, isSale: false, swatches: ["#1f2937"] },
]



export default function ShopPage() {

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AnnouncementBar text="FREE SHIPPING ON ORDERS OVER 150 AED | EASY RETURNS WITHIN 14 DAYS" />
      <StoreHeader />
      
      <div className="flex-1 pb-16">
        {/* Page Header */}
      <div className="bg-muted py-6 md:py-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb className="mb-4 md:mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>All Collections</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-heading text-foreground mb-3">All Collections</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Discover our complete range of timeless designs, crafted to bring elegance and heritage to your everyday wardrobe.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Desktop Sidebar */}
          <div data-lenis-prevent className="hidden md:block w-52 shrink-0 sticky top-24 self-start h-[calc(100vh-10rem)] overflow-y-auto overscroll-contain pr-4 pb-8 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <SidebarFilters />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger render={<button className="md:hidden flex items-center gap-2 text-sm font-medium border border-border px-3 py-1.5 bg-background" />}>
                      <Filter className="w-4 h-4" />
                      Filter
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px]">
                    <div data-lenis-prevent className="p-6 pt-12 h-full overflow-y-auto overscroll-contain pb-24">
                      <h2 className="font-heading text-xl mb-6">Filters</h2>
                      <SidebarFilters />
                    </div>
                  </SheetContent>
                </Sheet>
                <span className="text-sm text-muted-foreground hidden sm:inline-block">{MOCK_PRODUCTS.length} products</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">Sort by</span>
                <Select defaultValue="Newest Arrivals">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} align="start">
                    <SelectItem value="Newest Arrivals">Newest Arrivals</SelectItem>
                    <SelectItem value="Price: Low to High">Price: Low to High</SelectItem>
                    <SelectItem value="Price: High to Low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-6 sm:gap-x-4 sm:gap-y-8">
              {MOCK_PRODUCTS.map((prod, i) => (
                <ProductCard
                  key={i}
                  brand={prod.brand}
                  name={prod.name}
                  compareAtPrice={prod.compareAtPrice}
                  price={prod.price}
                  imageSrc={prod.img}
                  href="/products/product-slug"
                />
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-16 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

          </div>
        </div>
      </div>

      </div>
      <StoreFooter />
    </div>
  )
}
