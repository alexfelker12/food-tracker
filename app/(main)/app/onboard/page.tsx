import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

import { FullScreenLoader } from "@/components/FullScreenLoader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertCircleIcon, FileUserIcon, LayoutDashboardIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Page() {
  return (
    <main className="flex justify-center items-center p-4 h-full">
      <Suspense fallback={<FullScreenLoader />}>
        <PageWrap />
      </Suspense>
    </main>
  );
}

async function PageWrap() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) redirect("/auth")

  const alreadyHasProfile = await db.metricsProfile.findFirst({
    where: {
      userId: session.user.id
    }
  })

  // await new Promise(r => setTimeout(r, 20000));
  // redirect(`/app?toast-msg=${encodeURIComponent("Du hast bereits ein Profil")}`)

  if (alreadyHasProfile) return <UserHasProfile />
  return <ProfileForm />
}

function UserHasProfile() {
  return (
    <Alert className="p-3 [&>svg]:size-4.5">
      <AlertCircleIcon />
      <AlertTitle className="text-lg leading-normal">Du hast bereits ein Profil!</AlertTitle>
      <AlertDescription className="flex flex-col items-end gap-4">
        <span>Du kannst das Onboarding nicht noch einmal durchlaufen</span>
        <div className="flex justify-between items-center w-full">
          <Button asChild variant="outline">
            <Link href="/app/user"><FileUserIcon /> Zum Profil</Link>
          </Button>
          <Button asChild>
            <Link href="/app"><LayoutDashboardIcon /> Zum Dashboard</Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}