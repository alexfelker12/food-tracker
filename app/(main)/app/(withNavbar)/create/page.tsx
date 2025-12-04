import Link from "next/link";

import { APP_BASE_URL } from "@/lib/constants";

import { Button } from "@/components/ui/button";


export default function Page() {
  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">

        <Button asChild variant="outline">
          <Link href={APP_BASE_URL + "/create/food"}>
            Lebensmittel erstellen
          </Link>
        </Button>

        <Button asChild variant="outline">
          <Link href={APP_BASE_URL + "/create/meal"}>
            Mahlzeit erstellen
          </Link>
        </Button>

      </div>
    </main>
  );
}
