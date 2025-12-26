import type { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import "@/app/globals.css"

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
      <body className="grid grid-rows-[auto_1fr_auto] **:[main,header]:mx-auto **:[main,header]:w-full **:[main,header]:max-w-md antialiased">
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
