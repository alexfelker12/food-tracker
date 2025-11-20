"use client"

import { orpc } from "@/lib/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

export function TestORPCListing() {
  const { data: { tests } } = useSuspenseQuery(orpc.test.list.queryOptions())

  return (
    <div className="space-y-4">
      {tests.map((t) => (
        <div className="flex flex-col gap-1" key={t.id}>
          <span>{t.name}</span>
          <span className="text-muted-foreground text-sm">{t.testProp}</span>
        </div>
      ))}
    </div>
  );
}