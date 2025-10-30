"use client"

//* react/next
import { useRouter } from "next/navigation"

//* packages
import { Slot } from "@radix-ui/react-slot"
import { toast } from "sonner"

//* components
import { Button, buttonVariants } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { VariantProps } from "class-variance-authority"


interface SignOutButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  callbackUrl?: string
  asChild?: Boolean
}
export const SignOutButton = ({
  callbackUrl,
  asChild,
  children,
  ...props
}: SignOutButtonProps) => {
  const router = useRouter()
  const Comp = asChild ? Slot : Button

  const handleSignOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    authClient.signOut({
      fetchOptions: {
        // ctx: SuccessContext
        onSuccess: () => {
          toast.success("Erfolgreich abgemeldet", {
            position: "top-right"
          })
          if (callbackUrl) {
            router.push(callbackUrl)
          } else {
            router.refresh()
          }
        },
      }
    })
  }

  return (
    <Comp
      onClick={handleSignOut}
      {...props}
    >
      {children}
    </Comp>
  )
}