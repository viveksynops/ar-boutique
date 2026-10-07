import { BadgeCheck, ShieldCheck, Sparkles, LucideIcon } from "lucide-react"

interface TrustItem {
  icon: LucideIcon
  title: string
  description: string
}

const trustItems: TrustItem[] = [
  { icon: BadgeCheck, title: "Premium Craftsmanship", description: "Our products are made with the highest quality materials and expert craftsmanship." },
  { icon: ShieldCheck, title: "Trusted Payments", description: "Shop safely with our fully encrypted, secure payment system." },
  { icon: Sparkles, title: "Quality Assurance", description: "Crafted with care, each piece guarantees exceptional quality and attention to detail." },
]

export function TrustStrip() {
  return (
    <div className="bg-foreground text-background py-10 px-6 md:px-12 w-full">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {trustItems.map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <item.icon className="h-6 w-6 opacity-90" strokeWidth={1.5} />
            <div>
              <h3 className="text-[15px] font-medium tracking-wide mb-2">{item.title}</h3>
              <p className="text-[13px] opacity-70 italic max-w-[280px] mx-auto leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
