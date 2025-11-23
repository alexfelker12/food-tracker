//* maybe keep this if we need more navigation routes

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">

        <Button asChild variant="outline">
          <Link href="/app/create/food">
            Lebensmittel erstellen
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href="/app/create/meal">
            Mahlzeit erstellen
          </Link>
        </Button>

      </div>
    </main>
  );
}
