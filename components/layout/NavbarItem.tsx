"use client"

import Link from "next/link"

import { LucideIcon } from "lucide-react"

import { useIsActiveNavItem } from "@/hooks/useIsActiveNavItem"
import { cn } from "@/lib/utils"


export interface NavbarItemBaseProps {
  label: Capitalize<string>
  icon: LucideIcon
  href: `/${string}`
  isPrimary?: boolean
}
interface NavbarItemProps extends NavbarItemBaseProps {
  prefetch?: boolean
}
export function NavbarItem({ href, icon, label, isPrimary, prefetch }: NavbarItemProps) {
  const { isActive, isCurrentPage } = useIsActiveNavItem({ href })
  const Icon = icon

  return (
    <div className={isPrimary ? "flex items-center" : ""}>
      <Link
        data-component="nav-item"
        href={href}
        prefetch={prefetch}
        onClick={(e) => {
          if (isCurrentPage) e.preventDefault();
        }}
        className="group/nav-item flex flex-col items-center gap-1 min-w-14"
      >
        <div
          className={cn(
            "flex justify-center items-center group-hover/nav-item:bg-accent/50 rounded-xl transition-all duration-200 group-active/nav-item:scale-95 size-10",
            isPrimary && "bg-primary rounded-2xl size-12 text-primary-foreground group-hover/nav-item:bg-primary/85",
            (!isPrimary && isActive) && "bg-accent group-hover/nav-item:bg-accent",
            (isPrimary && isActive) && "shadow-xl shadow-primary/50",
          )}
        >
          <Icon
            className={cn(
              "transition-colors size-5",
              (!isPrimary && isActive) ? "text-foreground" : "text-muted-foreground",
              isPrimary && "size-6 text-primary-foreground"
            )}
          />
        </div>
        {!isPrimary &&
          <span
            className={cn(
              "font-medium text-xs transition-colors",
              isActive ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        }
      </Link>
    </div>
  )
}
