"use client"

import { HomeIcon, LucideIcon, NotebookIcon, NotebookPenIcon, NotebookTextIcon, PlusIcon } from "lucide-react"
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
  { id: "journal", icon: NotebookTextIcon, label: "Tagebuch", href: "/app/journal" },
  { id: "track", icon: NotebookPenIcon, label: "Eintrag", href: "/app/track", isPrimary: true },
  // { id: "more", icon: MoreHorizontalIcon, label: "Weiteres", href: "/app/more" },
  { id: "create", icon: PlusIcon, label: "Erstellen", href: "/app/create" },
]

export function NavbarItems() {
  return (
    navItems.map((item) =>
      <NavbarItem key={item.id} item={item} />
    )
  );
}
