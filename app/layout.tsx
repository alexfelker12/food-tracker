import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google";

import { cn } from "@/lib/utils";

import { ThemeProvider } from "@/components/providers/ThemeProvider"
import "@/app/globals.css"


const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MFoody",
  description: "Track calories and reach your fitness goals!",
  robots: {
    index: false, //* should be removed some time
    follow: false, //* should be removed some time
  },
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de-DE" suppressHydrationWarning>
      {/* <head>
        <script
          async
          crossOrigin="anonymous"
          src="https://tweakcn.com/live-preview.min.js"
        />
      </head> */}
      <body className={cn("grid grid-rows-[auto_1fr_auto] **:[main,header]:mx-auto **:[main,header]:w-full **:[main,header]:max-w-md antialiased", plusJakartaSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
