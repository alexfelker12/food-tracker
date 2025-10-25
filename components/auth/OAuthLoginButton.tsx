"use client"

import { useState } from "react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

import { GoogleIcon } from "../icons/google-logo"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"


interface OAuthLoginButtonProps extends React.ComponentPropsWithRef<typeof Button> {
  callbackURL: string
  provider?: "google"
  loading?: boolean
}

export const OAuthLoginButton = ({
  provider = "google",
  callbackURL,
  loading,
  asChild,
  size = "sm",
  variant = "outline",
  className,
  ref,
  children,
  ...props
}: OAuthLoginButtonProps) => {
  const [internalLoading, setInternalLoading] = useState<boolean>(false)

  function handleSocialSignIn() {
    setInternalLoading(true)

    authClient.signIn.social({
      provider,
      callbackURL,
      //? not working as intended
      // fetchOptions: {
      //   // ctx: SuccessContext
      //   onSuccess() {
      //     toast.success("Signed in successfully")
      //   },
      //   // ctx: ErrorContext
      //   onError() {
      //     toast.error("Sign in failed")
      //   },
      //   onResponse(ctx) {
      //     console.log(ctx.request)
      //     toast("Response completed")
      //     setInternalLoading(false)
      //   }
      // }
    })
  }

  //* passed "loading" overwrites internal loading state
  const loadingState = loading || !loading && internalLoading

  return (
    <Button
      className={cn("items-center gap-2.5 px-3 py-2.5 rounded-full h-auto text-sm", className)}
      onClick={handleSocialSignIn}
      size={size}
      variant={variant}
      ref={ref}
      disabled={loadingState}
      {...props}
    >
      {children || <>
        <div className="relative">
          <GoogleIcon
            className={cn("transition-all size-[20px]",
              loadingState ? "scale-0 opacity-0" : "scale-100 opacity-100"
            )}
          />
          <Spinner
            className={cn("top-1/2 left-1/2 absolute transition-all -translate-1/2 size-[20px]",
              loadingState ? "scale-100 opacity-100" : "scale-0 opacity-0"
            )}
          />
        </div>
        <span>Mit Google anmelden</span>
      </>}
    </Button>
  )
}
