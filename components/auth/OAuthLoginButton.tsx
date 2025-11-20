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
  size,
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
      newUserCallbackURL: "/app/onboard",
      fetchOptions: {
        //? not working as intended
        //   // ctx: SuccessContext
        //   onSuccess() {
        //     toast.success("Signed in successfully")
        //   },
        //   // ctx: ErrorContext
        //   onError() {
        //     toast.error("Sign in failed")
        //   },
        // // ctx: ResponseContext
        onResponse: () => {
          // console.log(ctx.request)
          // toast("Response completed")
          setInternalLoading(false)
        }
      }
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


// {
//   "id": "cmi7f4uhw0001e5eaze0n871x",
//   "date": "2025-11-20T00:00:00.000Z",
//   "bmr": 1770.98,
//   "tdee": 2358,
//   "caloryGoal": 2051,
//   "tefQuota": 0.1095,
//   "waterDemand": 3.3,
//   "amountFats": 56,
//   "amountCarbs": 205,
//   "amountProtein": 179,
//   "profileSnapshot": {
//     "gender": "MALE",
//     "bodyType": "MORE_OVERWEIGHT",
//     "fatSplit": 25,
//     "heightCm": 183,
//     "weightKg": 94,
//     "birthDate": "2000-10-25T00:00:00.000Z",
//     "carbSplit": 40,
//     "fitnessGoal": "LOSE_WEIGHT",
//     "proteinSplit": 35,
//     "activityLevel": "VERY_LOW",
//     "trainingDaysPerWeek": 0
//   },
//   "usedRecommendedSplits": true,
//   "metricsProfileId": "cmi7f4ug20000e5eayo0ohrdl"
// }