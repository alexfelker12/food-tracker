import type { Metadata } from "next"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { Toaster } from "@/components/ui/sonner"

import "@/lib/orpc.server"; // for pre-rendering


// TODO: check if profile middleware is enough to ensure user has a profile


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
    <QueryProvider>
      <div className="-mt-px w-full h-px"></div>
      {children}
      <Toaster />
    </QueryProvider>
  )
}
