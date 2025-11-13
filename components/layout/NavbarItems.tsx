"use client"

import { BookOpenIcon, HomeIcon, LucideIcon, MoreHorizontalIcon, PlusIcon } from "lucide-react"
import { NavbarItem } from "./NavbarItem"


export type NavItemProps = {
  id: string
  icon: LucideIcon
  label: Capitalize<string>
  href: `/${string}`
  isPrimary?: boolean
}

const navItems: NavItemProps[] = [
  { id: "home", icon: HomeIcon, label: "Start", href: "/app" },
  { id: "journal", icon: BookOpenIcon, label: "Tagebuch", href: "/app/journal" },
  { id: "create", icon: PlusIcon, label: "Eintrag", href: "/app/track-food", isPrimary: true },
  { id: "more", icon: MoreHorizontalIcon, label: "Weiteres", href: "/app/more" },
]

export function NavbarItems() {
  return (
    navItems.map((item) =>
      <NavbarItem key={item.id} item={item} />
    )
  );
}
