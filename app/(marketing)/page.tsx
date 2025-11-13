import { HouseIcon } from "lucide-react";

import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Button } from "@/components/ui/button";


export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">
        <Button asChild variant="outline">
          <NoPrefetchLink href="/app">
            <HouseIcon /> Go to dashboard
          </NoPrefetchLink>
        </Button>
      </div>
    </main>
  );
}
