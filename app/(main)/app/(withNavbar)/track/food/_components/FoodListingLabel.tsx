"use client"

import { cn } from "@/lib/utils";

export function FoodListingLabel({
  classname,
  labelLeft,
  labelRight
}: {
  classname?: string
  labelLeft?: React.ReactNode
  labelRight?: React.ReactNode | string
}) {
  return (
    <div
      className={cn(
        "flex justify-between items-center gap-4 [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        classname
      )}
    >
      {labelLeft
        ? <span className="inline-flex items-center gap-1">{labelLeft}</span>
        : null
      }
      {labelRight
        ? <span className="text-muted-foreground text-sm leading-none self-end">{labelRight}</span>
        : null
      }
    </div>
  );
}

