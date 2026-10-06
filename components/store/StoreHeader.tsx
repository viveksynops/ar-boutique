import Link from "next/link"
import { Search, User, ShoppingBag, Menu } from "lucide-react"

export function StoreHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 lg:hidden">
          <button aria-label="Menu" className="p-2 -ml-2">
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
        
        <div className="flex-1 lg:flex-none">
          <Link href="/" className="inline-block">
            <img src="/images/logo.svg" alt="AR Boutique" className="h-10 sm:h-14 w-auto" />
          </Link>
        </div>

        <nav className="hidden lg:flex flex-1 justify-center gap-8 text-[15px] font-normal">
          <Link href="/shop/new-in" className="hover:text-muted-foreground transition-colors">New In</Link>
          <Link href="/shop" className="hover:text-muted-foreground transition-colors">Shop All</Link>
          <Link href="/shop/dresses" className="hover:text-muted-foreground transition-colors">Dresses</Link>
          <Link href="/shop/tops" className="hover:text-muted-foreground transition-colors">Tops</Link>
          <Link href="/shop/sale" className="hover:text-muted-foreground transition-colors">Sale</Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button aria-label="Search" className="hidden sm:block p-2">
            <Search className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <Link href="/account" aria-label="Account" className="hidden sm:block p-2">
            <User className="h-5 w-5" strokeWidth={1.5} />
          </Link>
          <Link href="/cart" aria-label="Cart" className="flex items-center p-2 relative">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
