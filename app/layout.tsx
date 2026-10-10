import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { fontSans, fontHeading, fontMono } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "AR Boutique",
  description: "Timeless style meets modern elegance. Designed for the way you live.",
  icons: {
    icon: "/images/logo.png",
  },
};



export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full scroll-smooth", "antialiased", "font-sans", fontSans.variable, fontHeading.variable, fontMono.variable)}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}