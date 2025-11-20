"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ShowRedirectToasts() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const message = searchParams.get('toast-msg')

    if (message && message !== "") {
      toast.info(message, {
        position: "top-center",
      })

      const updatedSearchparams = new URLSearchParams(searchParams.toString())
      updatedSearchparams.delete('toast-msg')
      const updatedURL = `${pathname}?${updatedSearchparams.toString()}`

      // use native api because router.replace triggers a page reload
      window.history.replaceState(null, "", updatedURL)
    }
  }, [])

  return null;
}
