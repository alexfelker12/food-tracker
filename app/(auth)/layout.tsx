import type { Metadata } from "next"
import { Suspense } from "react"

import { Toaster } from "@/components/ui/sonner"
import { Spinner } from "@/components/ui/spinner"
import { ThemeProvider } from "@/components/providers/ThemeProvider"

import "../globals.css"


export const metadata: Metadata = {
  title: "Auth - MFoody",
  description: "Authorize to use the application",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="grid grid-rows-[1fr] antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={<AppLoader />}>
            {children}
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

function AppLoader() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Spinner className="text-primary size-6" />
    </div>
  );
}
