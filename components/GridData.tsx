"use client"

import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";


interface GridDataSectionProps extends React.ComponentProps<"section"> {
  label: string
  listingClassNames?: string
}
function GridDataSection({
  label, listingClassNames,
  className, children, ...props
}: GridDataSectionProps) {
  return (
    <section
      className={cn(
        "space-y-2",
        className
      )}
      {...props}
    >
      <div>
        <span>{label}</span>
        <Separator />
      </div>
      <div className={cn(
        "flex flex-col gap-2 text-sm",
        listingClassNames
      )}>
        {children}
      </div>
    </section>
  );
}

interface GridDataProps extends React.ComponentProps<"div"> { }
function GridData({ className, ...props }: GridDataProps) {
  return (
    <div
      className={cn(
        "flex justify-between gap-4 text-end **:data-[slot=grid-data-label]:text-muted-foreground **:data-[slot=grid-data-label]:text-start",
        className
      )}
      {...props}
    />
  );
}


export {
  type GridDataProps,
  type GridDataSectionProps,
  GridData,
  GridDataSection
}
