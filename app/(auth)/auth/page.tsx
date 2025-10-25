import { OAuthLoginButton } from "@/components/auth/OAuthLoginButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { HouseIcon, LogOutIcon } from "lucide-react";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-start gap-4">
        <Button asChild variant="link">
          <NoPrefetchLink href="/">
            <HouseIcon /> Go to home
          </NoPrefetchLink>
        </Button>
        {session && session.user
          ?
          <SignOutButton
            callbackUrl="/auth"
            variant="secondary"
          >
            <LogOutIcon /> Ausloggen
          </SignOutButton>
          :
          <OAuthLoginButton
            callbackURL="/"
          />}
      </div>
    </main>
  );
}
