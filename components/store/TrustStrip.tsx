import { Truck, Package, Lock, Award, LucideIcon } from "lucide-react"

interface TrustItem {
  icon: LucideIcon
  title: string
  description: string
}

const trustItems: TrustItem[] = [
  { icon: Truck, title: "FREE SHIPPING", description: "On orders over $150" },
  { icon: Package, title: "EASY RETURNS", description: "30 days return policy" },
  { icon: Lock, title: "SECURE PAYMENT", description: "100% secure checkout" },
  { icon: Award, title: "QUALITY GUARANTEE", description: "Premium materials" },
]

export function TrustStrip() {
  return (
    <div className="bg-secondary py-6 px-6 md:px-12 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
        {trustItems.map((item, i) => (
          <div key={i} className="flex items-center gap-4 text-left">
            <item.icon className="h-6 w-6 text-foreground" strokeWidth={1.5} />
            <div>
              <h3 className="text-[11px] font-semibold tracking-wide uppercase text-foreground">{item.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
