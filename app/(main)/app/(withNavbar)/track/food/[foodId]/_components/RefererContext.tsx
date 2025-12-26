"use client"

import { createContext, use } from "react";

type RefererContextType = {
  referer: string | null
}

export const RefererContext = createContext<RefererContextType | undefined>(undefined);

export function useRefererUrl() {
  const ctx = use(RefererContext)
  if (!ctx) throw new Error("useReferer must be used within RefererContext");
  const refererUrl = new URL(ctx.referer || "")
  return { refererUrl }
}

export function RefererContextProvider({
  children, referer
}: { children: React.ReactNode, } & RefererContextType
) {
  return (
    <RefererContext.Provider value={{ referer }}>
      {children}
    </RefererContext.Provider>
  );
}
