import { OAuthLoginButton } from "@/components/auth/OAuthLoginButton";
import { SignOutButton } from "@/components/auth/SignOutButton";
import NoPrefetchLink from "@/components/NoPrefetchLink";
import { AuthSession } from "@/components/providers/AuthProvider";
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
        {session
          ? <AuthedUser session={session} />
          : <UnauthedUser />
        }
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
    <div>
      <p>Hallo {session.user.name}!</p>
      <SignOutButton
        callbackUrl="/auth"
        variant="secondary"
      >
        <LogOutIcon /> Ausloggen
      </SignOutButton>
    </div>
  );
}

function UnauthedUser() {
  return (
    <div>
      <p>Du bist nicht angemeldet,</p>
      <OAuthLoginButton
        callbackURL="/auth"
      />
    </div>
  );
}
