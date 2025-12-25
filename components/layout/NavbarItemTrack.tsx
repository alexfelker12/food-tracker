"use client"

import Link from "next/link";
import { useRef, useState } from "react";

import { useIsActiveNavItem } from "@/hooks/useIsActiveNavItem";

import { APP_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ArrowLeftIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, NestedDrawer } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";

import { NavbarDrawerIntakeTimeLinks } from "./NavbarDrawerIntakeTimeLinks";
import { NavbarItemBaseProps } from "./NavbarItem";


interface NavbarItemTrackProps extends NavbarItemBaseProps { }
export function NavbarItemTrack({ icon, label, href, isPrimary }: NavbarItemTrackProps) {
  const [open, setOpen] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const nestedFirstButtonRef = useRef<HTMLButtonElement>(null)

  const { isActive } = useIsActiveNavItem({ href })
  const Icon = icon

  return (
    <Drawer open={open} onOpenChange={setOpen} >
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
          <DrawerTitle className="text-lg">Tracken</DrawerTitle>
          <DrawerDescription className="text-base sr-only">Finde Lebensmittel und Mazhlzeiten per Suche oder mit dem Barcode-Scanner</DrawerDescription>
        </DrawerHeader>

        <DrawerFooter className="pt-0">

          <NestedDrawer>
            <DrawerTrigger className="flex-1" ref={firstButtonRef} asChild>
              <Button variant="outline" >
                Lebensmittel
              </Button>
            </DrawerTrigger>
            <DrawerContent onOpenAutoFocus={() => nestedFirstButtonRef.current?.focus()}>
              <DrawerHeader>
                <DrawerTitle className="text-lg">Lebensmittel tracken für...</DrawerTitle>
                <DrawerDescription className="text-base">Wähle eine Tageszeit, zu der ein Lebensmittel getrackt werden soll</DrawerDescription>
              </DrawerHeader>

              <NavbarDrawerIntakeTimeLinks
                href={APP_BASE_URL + "/track/food"}
                ref={nestedFirstButtonRef}
                onOptionClick={() => setOpen(false)}
              />

              <div className="px-4 w-full"><Separator /></div>

              <DrawerFooter className="flex-col-reverse">
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1"><ArrowLeftIcon /> Zurück</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </NestedDrawer>


          <DrawerClose asChild>
            <Button asChild variant="outline">
              <Link href={APP_BASE_URL + "/track/meal"}>
                Mahlzeit
              </Link>
            </Button>
          </DrawerClose>

        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
