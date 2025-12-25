"use client"

import Link from "next/link";
import { useRef } from "react";

import { useIsActiveNavItem } from "@/hooks/useIsActiveNavItem";

import { APP_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

import { NavbarItemBaseProps } from "./NavbarItem";


interface NavbarItemCreateProps extends NavbarItemBaseProps { }
export function NavbarItemCreate({ icon, label, href, isPrimary }: NavbarItemCreateProps) {
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  const { isActive } = useIsActiveNavItem({ href })
  const Icon = icon

  return (
    <Drawer>
      <DrawerTrigger className="group/nav-item flex flex-col items-center gap-1 min-w-14">
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
      </DrawerTrigger>

      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
        <DrawerHeader>
          <DrawerTitle className="text-lg">Erstellen</DrawerTitle>
          <DrawerDescription className="text-base sr-only">Erstelle Lebensmittel und Mahlzeiten um diese per Suche oder dem Barcode-Scanner zu tracken</DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-0">

          <DrawerClose ref={firstButtonRef} asChild>
            <Button asChild variant="outline">
              <Link href={APP_BASE_URL + "/create/food"}>
                Lebensmittel
              </Link>
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button asChild variant="outline">
              <Link href={APP_BASE_URL + "/create/meal"}>
                Mahlzeit
              </Link>
            </Button>
          </DrawerClose>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
