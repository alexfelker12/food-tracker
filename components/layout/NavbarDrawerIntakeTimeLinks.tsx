"use client"

import { IntakeTime as intakeTimeEnum } from "@/generated/prisma/enums";

import { useIntakeTimeParam } from "@/hooks/useIntakeTimeParam";

import { IntakeTimeOptionLink } from "@/components/journal/IntakeTimeOption";


interface NavbarDrawerIntakeTimeLinksProps {
  href: string
  ref: React.RefObject<HTMLButtonElement | null>
  onOptionClick?: () => void
}
export function NavbarDrawerIntakeTimeLinks({ href, ref, onOptionClick }: NavbarDrawerIntakeTimeLinksProps) {
  const { intakeTimeKey } = useIntakeTimeParam()

  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <IntakeTimeOptionLink
        label="Frühstück"
        href={`${href}?${intakeTimeKey}=${intakeTimeEnum.BREAKFAST}`}
        ref={ref}
        onClick={onOptionClick}
      />
      <IntakeTimeOptionLink
        label="Mittagessen"
        href={`${href}?${intakeTimeKey}=${intakeTimeEnum.LUNCH}`}
        onClick={onOptionClick}
      />
      <IntakeTimeOptionLink
        label="Abendessen"
        href={`${href}?${intakeTimeKey}=${intakeTimeEnum.DINNER}`}
        onClick={onOptionClick}
      />
      <IntakeTimeOptionLink
        label="Snacks"
        href={`${href}?${intakeTimeKey}=${intakeTimeEnum.SNACKS}`}
        onClick={onOptionClick}
      />
    </div>
  )
}
