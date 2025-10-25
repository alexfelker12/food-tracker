"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const handleClick = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <Sun className="transition-all size-[1.2rem] scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute transition-all size-[1.2rem] scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
