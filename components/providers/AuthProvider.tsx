"use client";

import { createContext, use, useState } from "react";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";


export type AuthSession = typeof auth.$Infer.Session

type AuthContextType = {
  session: AuthSession | null
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: AuthSession | null
}) {
  const [session, setSession] = useState<AuthSession | null>(initialSession)

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
