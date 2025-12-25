"use client"

import NoPrefetchLink from "@/components/NoPrefetchLink"
import { Button } from "@/components/ui/button"
import { DrawerClose } from "@/components/ui/drawer"


interface IntakeTimeOptionProps extends React.ComponentPropsWithRef<typeof Button> {
  onOptionSelect: () => void
  label: string
}
export function IntakeTimeOption({ onOptionSelect, label, ...props }: IntakeTimeOptionProps) {
  return (
    <DrawerClose asChild>
      <Button variant="outline" onClick={() => onOptionSelect()} {...props}>{label}</Button>
    </DrawerClose>
  )
}

interface IntakeTimeOptionLinkProps extends Omit<IntakeTimeOptionProps, "onOptionSelect"> {
  href: string
}
export function IntakeTimeOptionLink({ label, href, ...props }: IntakeTimeOptionLinkProps) {
  return (
    <DrawerClose asChild>
      <Button variant="outline" asChild {...props}>
        <NoPrefetchLink href={href}>
          {label}
        </NoPrefetchLink>
      </Button>
    </DrawerClose>
  );
}
