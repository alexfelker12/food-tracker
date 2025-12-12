"use client";

import { useState } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'
//TODO: look up if getQueryClient would be doing problems because of react's cache
import { createQueryClient } from '@/lib/query/client'
import { getQueryClient } from '@/lib/query/hydration';


export function QueryProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
