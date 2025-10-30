"use client"

import { FileUserIcon, LogInIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NoPrefetchLink from "@/components/NoPrefetchLink"
import { SignOutButton } from "@/components/auth/SignOutButton"
import { useAuth } from "@/components/providers/AuthProvider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function UserDropdown({ children }: React.ComponentProps<"button">) {
  const { session } = useAuth()
  // const pathname = usePathname()

  console.log("image", session?.user.image || undefined)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* default navbar item appearance - can be overwritten by wrapping children */}
        {children || <button className="group flex flex-col items-center gap-1 aria-invalid:border-destructive focus-visible:border-ring rounded-md min-w-14 focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none">
          <div className="flex justify-center items-center group-hover:bg-accent rounded-xl transition-all duration-200 size-10 group-active:scale-95">
            <Avatar>
              <AvatarImage src={session?.user.image || undefined} alt={session?.user.name || "Nutzer Bild"} />
              <AvatarFallback><UserIcon className="text-muted-foreground transition-colors size-5" /></AvatarFallback>
            </Avatar>
          </div>
          <span className="font-medium text-muted-foreground text-xs transition-colors">Profil</span>
        </button>}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" collisionPadding={8} className="w-48">
        <DropdownMenuLabel>
          Hallo, { }
          {session ? session.user.displayUsername || session.user.name : "Du"}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {session ?
          <>
            <DropdownMenuItem asChild>
              <NoPrefetchLink href="/user"><FileUserIcon />Profil</NoPrefetchLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NoPrefetchLink href="/user/settings"><SettingsIcon />Einstellungen</NoPrefetchLink>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <SignOutButton
              callbackUrl="/auth"
              variant="secondary"
              asChild
            >
              <DropdownMenuItem>
                <LogOutIcon /> Abmelden
              </DropdownMenuItem>
            </SignOutButton>
          </>
          :
          <DropdownMenuItem asChild>
            <NoPrefetchLink href="/auth"><LogInIcon />Anmelden</NoPrefetchLink>
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
