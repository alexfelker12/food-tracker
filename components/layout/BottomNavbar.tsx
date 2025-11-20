import { headers } from "next/headers"
import { Suspense } from "react"

import { auth } from "@/lib/auth"

import { AuthProvider } from "@/components/providers/AuthProvider"
import { Skeleton } from "@/components/ui/skeleton"
import { NavbarItems } from "./NavbarItems"
import { UserDropdown } from "./UserDropdown"


export function BottomNavbar() {
  return (
    <header className="right-0 bottom-0 left-0 z-50 sticky p-2">
      <div className="relative">
        {/* backgrund blur */}
        <div className="absolute inset-0 bg-background/80 shadow-lg backdrop-blur-xl border border-border rounded-md" />

        {/* nav items */}
        <nav className="relative flex justify-between items-stretch p-2">
          <NavbarItems />

          {/* user dropdown */}
          <Suspense fallback={<UserDropdownLoader />}>
            <UserDropdownWrap />
          </Suspense>
        </nav>
      </div>
    </header>
  )
}

async function UserDropdownWrap() {
  const sessionPromise = await auth.api.getSession({
    headers: await headers()
  })

  console.log("fetched session in wrap")

  return (
    <AuthProvider initialSession={sessionPromise}>
      <UserDropdown />
    </AuthProvider>
  );
}

function UserDropdownLoader() {
  return (
    <div className="flex flex-col items-center gap-1 min-w-14">
      <div className="flex justify-center items-center size-10">
        <Skeleton className="rounded-full text-primary size-9" />
      </div>
      <span className="font-medium text-muted-foreground text-xs transition-colors">Profil</span>
    </div>
  );
}
