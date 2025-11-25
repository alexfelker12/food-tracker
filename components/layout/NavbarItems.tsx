"use client"

import { HomeIcon, LucideIcon, NotebookIcon, NotebookPenIcon, NotebookTextIcon, PlusIcon } from "lucide-react"
import { NavbarItem } from "./NavbarItem"
import { APP_BASE_URL } from "@/lib/constants"


export type NavItemProps = {
  id: string
  icon: LucideIcon
  label: Capitalize<string>
  href: `/${string}`
  isPrimary?: boolean
}

const navItems: NavItemProps[] = [
  { id: "home", icon: HomeIcon, label: "Start", href: APP_BASE_URL },
  { id: "journal", icon: NotebookTextIcon, label: "Tagebuch", href: APP_BASE_URL + "/journal" as `/${string}` },
  { id: "track", icon: NotebookPenIcon, label: "Eintrag", href: APP_BASE_URL + "/track" as `/${string}`, isPrimary: true },
  // { id: "more", icon: MoreHorizontalIcon, label: "Weiteres", href: APP_BASE_URL + "/more" as `/${string}` },
  { id: "create", icon: PlusIcon, label: "Erstellen", href: APP_BASE_URL + "/create" as `/${string}` },
]

export function NavbarItems() {
  return (
    navItems.map((item) =>
      <NavbarItem key={item.id} item={item} />
    )
  );
}
