"use client"

import { BookOpenIcon, HomeIcon, LucideIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react"

import { NavbarItem } from "./NavbarItem"
import { UserDropdown } from "./UserDropdown"

export type NavItemProps = {
  id: string
  icon: LucideIcon
  label: Capitalize<string>
  href: `/${string}`
  isPrimary?: boolean
}

const navItems: NavItemProps[] = [
  { id: "home", icon: HomeIcon, label: "Start", href: "/" },
  { id: "journal", icon: BookOpenIcon, label: "Tagebuch", href: "/journal" },
  { id: "create", icon: PlusIcon, label: "Eintrag", href: "/track-food", isPrimary: true },
  { id: "more", icon: MoreHorizontalIcon, label: "Weiteres", href: "/more" },
]

export function BottomNavbar() {
  return (
    <header className="right-0 bottom-0 left-0 z-50 sticky p-2">
      <div className="relative">
        {/* backgrund blur */}
        <div className="absolute inset-0 bg-background/80 shadow-lg backdrop-blur-xl border border-border rounded-md" />

        {/* nav items */}
        <nav className="relative flex justify-between items-stretch p-2">
          {navItems.map((item) =>
            <NavbarItem key={item.id} item={item} />
          )}

          {/* user dropdown */}
          <UserDropdown />
        </nav>
      </div>
    </header>
  )
}
