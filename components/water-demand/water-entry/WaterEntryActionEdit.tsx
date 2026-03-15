"use client"

import { PencilIcon } from "lucide-react";

import { Button } from "@/components/ui/button";


export function WaterEntryActionEdit() {

  return (
    <Button variant="secondary" size="icon-sm" disabled>
      <PencilIcon /> <span className="sr-only">Menge bearbeiten</span>
    </Button>
  );
}
