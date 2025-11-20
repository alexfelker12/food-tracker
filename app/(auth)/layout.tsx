import type { Metadata } from "next"
import { Suspense } from "react"

import { Toaster } from "@/components/ui/sonner"

import { FullScreenLoader } from "@/components/FullScreenLoader"


export const metadata: Metadata = {
  title: "Auth | MFoody",
  description: "Authenticate to use the application",
  robots: {
    index: false, //* should be removed some time
    follow: false, //* should be removed some time
  },
}

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="-mt-px w-full h-px"></div>
      <Suspense fallback={<FullScreenLoader />}>
        {children}
      </Suspense>
    </>
  )
}
