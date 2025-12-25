"use client"

import { usePathname } from "next/navigation"

import { APP_BASE_URL } from "@/lib/constants"


type UseIntakeTimeParamProps = {
  href: string
}
type UseIntakeTimeParamReturn = {
  isActive: boolean
  isCurrentPage: boolean
}
export function useIsActiveNavItem({ href }: UseIntakeTimeParamProps): UseIntakeTimeParamReturn {
  // check if href is startpage, else if current pathname is a descendant of nav item
  const pathname = usePathname()
  const isActive = (href === APP_BASE_URL && pathname === APP_BASE_URL) || (href !== APP_BASE_URL && pathname.startsWith(href))
  const isCurrentPage = href === pathname

  return { isActive, isCurrentPage }
}
