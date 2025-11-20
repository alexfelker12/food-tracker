
import { LogInIcon } from "lucide-react";

import NoPrefetchLink from "@/components/NoPrefetchLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";


export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <Button asChild variant="link">
          <NoPrefetchLink href="/app/onboard">
            <LogInIcon /> Zum Onbaord
          </NoPrefetchLink>
        </Button>
        {/* <Suspense>
          <ShowRedirectToasts />
        </Suspense> */}
      </div>
    </main>
  );
}
