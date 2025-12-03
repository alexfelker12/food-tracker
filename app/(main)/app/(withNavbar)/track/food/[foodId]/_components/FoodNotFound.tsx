"use client"

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { APP_BASE_URL } from "@/lib/constants";
import { ArchiveXIcon, PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

export function FoodNotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ArchiveXIcon />
        </EmptyMedia>
        <EmptyTitle>Hmm...</EmptyTitle>
        <EmptyDescription>
          Dieses Lebensmittel konnte scheinbar nicht gefunden werden
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex flex-col gap-2">
          <Button asChild>
            <Link href={APP_BASE_URL + "/track/food"}><SearchIcon /> Zurück zur Suche</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={APP_BASE_URL + "/create/food"}><PlusIcon /> Lebensmittel erstellen</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
