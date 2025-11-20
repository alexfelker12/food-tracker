import { BottomNavbar } from "@/components/layout/BottomNavbar"


export default function DefaultLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <BottomNavbar />
    </>
  )
}
