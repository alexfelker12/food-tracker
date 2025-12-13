"use client"

import { createContext, use } from "react";

import { UserProfileType } from "@/orpc/router/profile/get";


type UserProfileContextType = {
  profile: UserProfileType
  editMode: boolean
  queryKey: readonly unknown[] | undefined
  cancelEdit: () => void
}

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)
export function useUserProfile() {
  const ctx = use(UserProfileContext)
  if (!ctx) throw new Error("useUserProfile must be used within JournalEntry")
  return ctx
}
