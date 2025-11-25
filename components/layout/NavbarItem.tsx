"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { APP_BASE_URL } from "@/lib/constants"

import { NavItemProps } from "./NavbarItems"


interface NavbarItemProps {
  item: NavItemProps
  prefetch?: boolean
}

export function NavbarItem({ item, prefetch }: NavbarItemProps) {
  const pathname = usePathname()
  // check if href is startpage, else if current pathname is a descendant of nav item
  const isActive = (item.href === APP_BASE_URL && pathname === APP_BASE_URL) || (item.href !== APP_BASE_URL && pathname.startsWith(item.href))
  const isCurrentPage = item.href === pathname
  const Icon = item.icon

  return (
    <div className={item.isPrimary ? "flex items-center" : ""}>
      <Link
        data-component="nav-item"
        href={item.href}
        prefetch={prefetch}
        onClick={(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (isCurrentPage) e.preventDefault();
        }}
        className="group/nav-item flex flex-col items-center gap-1 min-w-14"
      >
        <div
          className={cn(
            "flex justify-center items-center group-hover/nav-item:bg-accent/50 rounded-xl transition-all duration-200 group-active/nav-item:scale-95 size-10",
            item.isPrimary && "bg-primary rounded-2xl size-12 text-primary-foreground group-hover/nav-item:bg-primary/85",
            (!item.isPrimary && isActive) && "bg-accent group-hover/nav-item:bg-accent",
            (item.isPrimary && isActive) && "shadow-xl shadow-primary/50",
          )}
        >
          <Icon
            className={cn(
              "transition-colors size-5",
              (!item.isPrimary && isActive) ? "text-foreground" : "text-muted-foreground",
              item.isPrimary && "size-6 text-primary-foreground"
            )}
          />
        </div>
        {!item.isPrimary &&
          <span
            className={cn(
              "font-medium text-xs transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {item.label}
          </span>
        }
      </Link>
    </div>
  )
}
