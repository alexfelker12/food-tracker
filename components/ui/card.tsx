import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva("flex flex-col bg-card shadow-sm border text-card-foreground", {
  variants: {
    size: {
      default: "gap-4 rounded-xl py-4",
      sm: "gap-3 rounded-lg py-3",
      widget: cn(
        "gap-2 py-3 rounded-md",
        "*:data-[slot=card-header]:gap-0 *:data-[slot=card-header]:px-3",
        "**:data-[slot=card-title]:text-center **:data-[slot=card-title]:text-lg **:data-[slot=card-title]:leading-none",
        "*:data-[slot=card-content]:px-3 *:data-[slot=card-content]:leading-snug",
        "has-data-[slot=card-action]:**:data-[slot=card-title]:text-start has-data-[floating]:mt-2"
      )
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function Card({
  className,
  size,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVariants({ size }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "items-start gap-2 grid has-data-[slot=card-action]:grid-cols-[1fr_auto] grid-rows-[auto_auto] auto-rows-min px-4 [.border-b]:pb-6 @container/card-header",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "justify-self-end col-start-2 row-span-2 row-start-1 self-start",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-4 [.border-t]:pt-4", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
