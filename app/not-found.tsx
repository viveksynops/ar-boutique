import Link from "next/link"
import { StoreHeader } from "@/components/store/StoreHeader"
import { StoreFooter } from "@/components/store/StoreFooter"
import { StoreButton } from "@/components/store/StoreButton"
import { SectionHeading } from "@/components/store/SectionHeading"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <StoreHeader />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] mb-4 text-primary">
          404
        </p>
        <SectionHeading className="mb-4">Page Not Found</SectionHeading>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <StoreButton>Return to Home</StoreButton>
        </Link>
      </main>
      <StoreFooter />
    </div>
  )
}
