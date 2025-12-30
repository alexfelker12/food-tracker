"use client"

import { createContext, use } from 'react';

//* ------------------ Context ------------------
type ContextProps = {
  // scanned barcode
  barcode: string
  setBarcode: (barcode: string) => void
  lastBarcode: string
  setLastBarcode: (barcode: string) => void

  closeNestedDrawer: () => void
  closeMainDrawer: () => void

  enabled: boolean
}

export const BarcodeScanContext = createContext<ContextProps | undefined>(undefined);

export function useBarcodeScan() {
  const ctx = use(BarcodeScanContext)
  if (!ctx) throw new Error("useBarcodeScan must be used within BarcodeScanContext")
  return ctx
}

export function BarcodeScanProvider({
  children, ...contextValues
}: { children: React.ReactNode, } & ContextProps
) {
  return (
    <BarcodeScanContext.Provider value={contextValues}>
      {children}
    </BarcodeScanContext.Provider>
  );
}
