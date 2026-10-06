import { Inter, Newsreader, Geist_Mono } from "next/font/google"

export const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
})

export const fontHeading = Newsreader({
    subsets: ["latin"],
    axes: ["opsz"],
    variable: "--font-heading",
    display: "swap",
})

export const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
})