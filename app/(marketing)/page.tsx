import { HouseIcon } from "lucide-react";

import NoPrefetchLink from "@/components/NoPrefetchLink";
import { Button } from "@/components/ui/button";
import { APP_BASE_URL } from "@/lib/constants";


export default function Page() {
  return (
    <>
      <header></header>
      <main className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center gap-4">
          <Button asChild variant="outline">
            <NoPrefetchLink href={APP_BASE_URL}>
              <HouseIcon /> Go to dashboard
            </NoPrefetchLink>
          </Button>
        </div>
      </main>
      <footer></footer>
    </>
  );
}
