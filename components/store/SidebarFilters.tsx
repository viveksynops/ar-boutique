import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

export const SidebarFilters = () => (
  <div className="space-y-6">
    <Accordion multiple defaultValue={["category", "size", "fabric", "pattern", "price"]} className="w-full">
      <AccordionItem value="category">
        <AccordionTrigger className="text-[13px] font-semibold uppercase tracking-widest text-foreground">Category</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-1">
            {["Co-ord Sets", "Dresses", "Kurta Sets", "Tops"].map((cat) => (
              <div key={cat} className="flex items-center space-x-2">
                <Checkbox id={`cat-${cat}`} />
                <label htmlFor={`cat-${cat}`} className="text-sm font-medium text-foreground/80 leading-none cursor-pointer hover:text-foreground transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="size">
        <AccordionTrigger className="text-[13px] font-semibold uppercase tracking-widest text-foreground">Size</AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-4 gap-2 pt-1">
            {["M", "L", "XL", "XXL"].map((size) => (
              <div key={size} className="border border-border flex items-center justify-center py-2.5 text-[13px] font-medium text-foreground/80 cursor-pointer hover:border-primary hover:text-foreground hover:bg-muted/50 transition-colors">
                {size}
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="fabric">
        <AccordionTrigger className="text-[13px] font-semibold uppercase tracking-widest text-foreground">Fabric</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-1">
            {["Cotton", "Georgette", "Silk Blend", "Rayon", "Chiffon", "Chanderi"].map((fabric) => (
              <div key={fabric} className="flex items-center space-x-2">
                <Checkbox id={`fabric-${fabric}`} />
                <label htmlFor={`fabric-${fabric}`} className="text-sm font-medium text-foreground/80 leading-none cursor-pointer hover:text-foreground transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {fabric}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="pattern">
        <AccordionTrigger className="text-[13px] font-semibold uppercase tracking-widest text-foreground">Pattern</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-1">
            {["Floral", "Solid", "Embroidered", "Tie & Dye", "Ethnic Motifs", "Self Design"].map((pattern) => (
              <div key={pattern} className="flex items-center space-x-2">
                <Checkbox id={`pattern-${pattern}`} />
                <label htmlFor={`pattern-${pattern}`} className="text-sm font-medium text-foreground/80 leading-none cursor-pointer hover:text-foreground transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {pattern}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="price">
        <AccordionTrigger className="text-[13px] font-semibold uppercase tracking-widest text-foreground">Price</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-1">
            {["Under 100 AED", "100 - 150 AED", "Over 150 AED"].map((price) => (
              <div key={price} className="flex items-center space-x-2">
                <Checkbox id={`price-${price}`} />
                <label htmlFor={`price-${price}`} className="text-sm font-medium text-foreground/80 leading-none cursor-pointer hover:text-foreground transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {price}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
      
    </Accordion>
  </div>
)
