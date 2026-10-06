import Link from "next/link"

export function StoreFooter() {
  return (
    <footer className="bg-secondary pt-16 pb-8 border-t border-border mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-heading tracking-wide mb-4 inline-block">
              AR BOUTIQUE
            </Link>
            <p className="text-[13px] text-muted-foreground max-w-xs">
              Timeless style meets modern elegance. Designed for the way you live.
            </p>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-6">Shop</h4>
            <ul className="flex flex-col gap-4 text-[13px] text-muted-foreground">
              <li><Link href="/shop/new-in" className="hover:text-foreground transition-colors">New In</Link></li>
              <li><Link href="/shop/clothing" className="hover:text-foreground transition-colors">Clothing</Link></li>
              <li><Link href="/shop/dresses" className="hover:text-foreground transition-colors">Dresses</Link></li>
              <li><Link href="/shop/sale" className="hover:text-foreground transition-colors">Sale</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-6">Customer Care</h4>
            <ul className="flex flex-col gap-4 text-[13px] text-muted-foreground">
              <li><Link href="/policies/shipping" className="hover:text-foreground transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/policies/returns" className="hover:text-foreground transition-colors">Returns</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link href="/size-guide" className="hover:text-foreground transition-colors">Size Guide</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-6">Legal</h4>
            <ul className="flex flex-col gap-4 text-[13px] text-muted-foreground">
              <li><Link href="/policies/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-muted-foreground">
            © 2026 AR BOUTIQUE. All Rights Reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-[13px] font-semibold">VISA</span>
            <span className="text-[13px] font-semibold">MASTERCARD</span>
            <span className="text-[13px] font-semibold">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
