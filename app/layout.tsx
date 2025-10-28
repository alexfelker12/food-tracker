import type { Metadata } from "next"
import { headers } from "next/headers"

import { auth } from "@/lib/auth"

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

import "./globals.css"

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
  description: "Track calories and reach your fitness goals!"
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  console.log("fetched session in root")

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <AuthProvider initialSession={session}>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
