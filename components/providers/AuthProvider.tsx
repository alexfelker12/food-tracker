"use client";

import { createContext, use, useState } from "react";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { UserModel } from "@/generated/prisma/models";
import { redirect } from "next/navigation";

// overwrite better-auth's <User> type with db's <UserModel> type
// TODO: weird type missmatch with plugin fields -> correcting manually. Future breaks need different solution
export type AuthSession = Omit<typeof auth.$Infer.Session, "user"> & {
  user: Omit<UserModel, "image" | "username" | "displayUsername" | "role" | "banned" | "banReason" | "banExpires"> & {
    image?: string | null
    username?: string | null
    displayUsername?: string | null
    role?: string | null
    banned?: boolean | null
    banReason?: String | null
    banExpires?: Date | null
  }
}

type AuthContextType = {
  session: AuthSession | null
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({
  children,
  initialSessionPromise,
}: {
  children: React.ReactNode
  initialSessionPromise: Promise<AuthSession | null>
}) {
  const [session, setSession] = useState<AuthSession | null>(use(initialSessionPromise)) // resolve promise to get session obj

  // server-side redirect can be used during render process in client components 
  if (!session) redirect("/auth");

  const refreshSession = async () => {
    const { data: newSession, error } = await authClient.getSession()

    if (error) {
      //? maybe handle error
      setSession(null)
      return
    }

    setSession(newSession)
  }

  return (
    <AuthContext.Provider value={{ session, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = use(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

export {
  AuthProvider,
  useAuth
}
