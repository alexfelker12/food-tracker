"use client"

import { createContext, use } from "react";

type ContextProps = {
  referer: string | null
}

export const RefererContext = createContext<ContextProps | undefined>(undefined);

export function useRefererUrl() {
  const ctx = use(RefererContext)
  if (!ctx) throw new Error("useReferer must be used within RefererContext");
  const refererUrl = new URL(ctx.referer || "")
  return { refererUrl }
}

export function RefererContextProvider({
  children, ...contextValues
}: { children: React.ReactNode, } & ContextProps
) {
  return (
    <RefererContext.Provider value={contextValues}>
      {children}
    </RefererContext.Provider>
  );
}
