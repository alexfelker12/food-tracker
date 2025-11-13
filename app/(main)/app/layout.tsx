import type { Metadata } from "next"
import { headers } from "next/headers"
import { Suspense } from "react"

import { auth } from "@/lib/auth"

import { BottomNavbar } from "@/components/layout/BottomNavbar"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"

import "@/app/globals.css"
import "@/lib/orpc.server"; // for pre-rendering

// import { Geist, Geist_Mono } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });
// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
// -> pass as classNames to body: ${geistSans.variable} ${geistMono.variable}


export const metadata: Metadata = {
  title: "MFoody",
  description: "Track calories and reach your fitness goals!",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="grid grid-rows-[1fr_auto] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <BottomNavbar />
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
