"use client"

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { de } from "react-day-picker/locale"


interface DateFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder: string
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function DateField({
  label, description, placeholder, // text elements
  field, fieldState, // Controller-render props
  orientation = "horizontal", className, ...props // Field props
}: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(field.value)

  return (
    <Field
      orientation={orientation}
      data-invalid={fieldState.invalid}
      className={cn(
        "",
        className
      )}
      {...props}
    >
      <FieldContent>
        <FieldLabel htmlFor={field.name}>
          {label}
        </FieldLabel>
        <FieldDescription>
          {description}
        </FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={field.name}
            aria-invalid={fieldState.invalid}
            className="justify-between font-normal"
          >
            {field.value
              ? <span>{field.value.toLocaleDateString()}</span>
              : <span className="text-muted-foreground">{placeholder}</span>
            }
            <ChevronDownIcon className="opacity-50 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto overflow-hidden" align="start" collisionPadding={8}>
          <Calendar
            mode="single"
            captionLayout="dropdown"
            month={selectedMonth}
            onMonthChange={(month) => setSelectedMonth(month)}
            selected={field.value}
            onSelect={(date) => {
              console.log(date)
              field.onChange(date ?? null)
              field.onBlur()
              setOpen(false)
              //? maybe reset selected month to today's month if user unselects current selection?
            }}
            disabled={{
              after: new Date() // disable all future dates
            }}
            locale={de}
            timeZone="Europe/Berlin"
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
