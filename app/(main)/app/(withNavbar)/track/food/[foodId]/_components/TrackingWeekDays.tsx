"use client"

import { useMemo } from "react";

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


interface CompactNumFieldProps extends React.ComponentProps<"div"> {
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function TrackingWeekDays({
  field, fieldState, // Controller-render props
  className, ...props // Field props
}: CompactNumFieldProps) {
  const trackingDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date()
      const day = date.getDate()
      date.setDate(day + index)
      date.setHours(0, 0, 0, 0)
      return date
    })
  }, [(new Date()).getDate()]) // should only be reevaluated when day changes

  const toWeekDay = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit"
    })
  }

  const toWeekDayName = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      weekday: "short"
    })
  }

  const toDate = (date: Date) => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }


  return (
    <div
      data-invalid={fieldState.invalid}
      {...props}
    >
      <ToggleGroup
        type="multiple"
        id={field.name}
        className={cn(
          "justify-between w-full",
          className
        )}
        spacing={0.5}
        // map from Date to String and back
        value={field.value?.map((date: Date) => date.toISOString()) ?? []}
        onValueChange={(dates) => {
          field.onChange(dates.map((date) => new Date(date)))
        }}
      >
        {trackingDays.map((day) => {
          const key = day.getDate()
          const weekDayName = toWeekDayName(day)
          const weekDay = toWeekDay(day)
          const date = toDate(day)
          return (
            <div key={key} className="flex flex-col items-center gap-1.5">
              <span className="text-muted-foreground text-sm">{weekDayName}.</span>
              <ToggleGroupItem
                value={day.toISOString()}
                aria-label={`Tracke für den ${date}`}
                className="justify-center items-center rounded-full size-9"
              >
                <span className="text-base leading-none">{weekDay}</span>
              </ToggleGroupItem>
            </div>
          )
        })}
      </ToggleGroup>
    </div>
  );
}
