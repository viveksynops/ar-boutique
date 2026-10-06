import { Cormorant_Garamond, Geist_Mono, Montserrat } from "next/font/google";

export const fontSans = Montserrat({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const fontHeading = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["500", "600"],
    variable: "--font-heading",
});

export const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
});