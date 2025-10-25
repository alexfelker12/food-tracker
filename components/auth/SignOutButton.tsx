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
          // router.push("/sign-in")
          //* refresh current page on sign out to trigger middleware redirect to sign-in page with current url search params (if not "/")
          if (callbackUrl) {
            router.push(callbackUrl)
          } else {
            router.refresh()
            toast.success("Erfolgreich abgemeldet")
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