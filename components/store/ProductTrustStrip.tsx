import { HeartHandshake, Truck, Award } from "lucide-react"

export function ProductTrustStrip() {
  return (
    <div className="flex items-center justify-between text-xs sm:text-[13px] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <HeartHandshake className="w-4 h-4 stroke-[1.5]" />
        <span>Trusted by 1L+</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Truck className="w-4 h-4 stroke-[1.5]" />
        <span>Fast Delivery</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Award className="w-4 h-4 stroke-[1.5]" />
        <span>Quality Guaranteed</span>
      </div>
    </div>
  )
}
