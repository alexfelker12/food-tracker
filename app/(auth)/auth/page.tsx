import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { APP_BASE_URL } from "@/lib/constants";

import { HouseIcon } from "lucide-react";

import { OAuthLoginButton } from "@/components/auth/OAuthLoginButton";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { AuthSession } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";


export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">
        <Button asChild variant="outline">
          <NoPrefetchLink href="/">
            <HouseIcon /> Go to home
          </NoPrefetchLink>
        </Button>
        <div className="space-y-1 text-center">
          {session
            ? <AuthedUser session={session} />
            : <UnauthedUser />
          }
        </div>
      </div>
    </main>
  );
}

function AuthedUser({
  session
}: {
  session: AuthSession
}) {
  return (
    <>
      <p>Hallo, {session.user.name}!</p>
      <p>Du bist schon angemeldet.</p>
    </>
  );
}

function UnauthedUser() {
  return (
    <>
      <p>Du bist nicht angemeldet</p>
      <OAuthLoginButton
        callbackURL={APP_BASE_URL}
      />
    </>
  );
}
