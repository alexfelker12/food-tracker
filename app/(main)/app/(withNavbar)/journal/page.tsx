import { Suspense } from "react";

import { FullScreenLoader } from "@/components/FullScreenLoader";

import { JournalCalendar } from "./_components/JournalCalendar";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4 w-full">
        <Suspense fallback={<FullScreenLoader />}>
          <PageWrap />
        </Suspense>
      </div>
    </main>
  );
}

// TODO: create procedure for getting journal days
async function PageWrap() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) return null;

  const journalDays = await db.journalDay.findMany({
    where: {
      userId: session.user.id
    }
  })

  return (
    <JournalCalendar
      journalDays={journalDays}
    />
  );
}

