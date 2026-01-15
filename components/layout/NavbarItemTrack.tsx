"use client"

import { useIsActiveNavItem } from "@/hooks/useIsActiveNavItem";

import { cn } from "@/lib/utils";

import { FoodTrackMenu } from "@/components/track/FoodTrackMenu";
import { NavbarItemBaseProps } from "./NavbarItem";


interface NavbarItemTrackProps extends NavbarItemBaseProps { }
export function NavbarItemTrack({ icon, label, href, isPrimary }: NavbarItemTrackProps) {
  const { isActive } = useIsActiveNavItem({ href })
  const Icon = icon

  return (
    <FoodTrackMenu>
      <button className="group/nav-item flex flex-col items-center gap-1 min-w-14">
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
      </button>
    </FoodTrackMenu>
  )
}
