import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ProductType } from "./ProductInfo"

export function ProductAccordions({ product }: { product: ProductType }) {
  return (
    <Accordion defaultValue={[]} className="w-full flex flex-col gap-0 border-b border-border mb-8">
      <AccordionItem value="specifications" className="border-t border-border">
        <AccordionTrigger className="text-[15px] font-medium hover:no-underline py-4">Specifications</AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground pb-4">
          Material: 100% Cotton. Fit: Regular. Pattern: Floral Print.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="description" className="border-t border-border">
        <AccordionTrigger className="text-[15px] font-medium hover:no-underline py-4">Description</AccordionTrigger>
        <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground pb-4">
          {product.description}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="feeding" className="border-t border-border">
        <AccordionTrigger className="text-[15px] font-medium hover:no-underline py-4">Feeding Friendly</AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground pb-4">
          Yes, features concealed zippers for easy access.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="wash" className="border-t border-border">
        <AccordionTrigger className="text-[15px] font-medium hover:no-underline py-4">Wash Care</AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground pb-4">
          Machine wash cold with like colors. Do not bleach. Line dry.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="shipping" className="border-t border-border">
        <AccordionTrigger className="text-[15px] font-medium hover:no-underline py-4">Shipping Information</AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground pb-4">
          Usually dispatches within 24 hours. Delivery within 2-3 business days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="color" className="border-t border-border border-b-0">
        <AccordionTrigger className="text-[15px] font-medium hover:no-underline py-4">Color Disclaimer</AccordionTrigger>
        <AccordionContent className="text-[14px] text-muted-foreground pb-4">
          Actual colors may vary slightly due to photographic lighting sources or your monitor settings.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
