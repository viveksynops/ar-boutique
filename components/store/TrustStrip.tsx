import { Truck, RotateCcw, Lock, Award, LucideIcon } from "lucide-react"

interface TrustItem {
  icon: LucideIcon
  title: string
  description: string
}

const trustItems: TrustItem[] = [
  { icon: Truck, title: "FREE SHIPPING", description: "On orders over 150 AED" },
  { icon: RotateCcw, title: "EASY RETURNS", description: "14 days return policy" },
  { icon: Lock, title: "SECURE PAYMENT", description: "100% secure checkout" },
  { icon: Award, title: "QUALITY GUARANTEE", description: "Premium materials" },
]

export function TrustStrip() {
  return (
    <section className="bg-secondary py-12 my-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {trustItems.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" strokeWidth={1.5} />
              <div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em]">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
