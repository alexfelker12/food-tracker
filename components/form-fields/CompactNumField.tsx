"use client"

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";

import { NumFieldInput } from "@/components/form-fields/NumField";


interface CompactNumFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder?: `${number}`
  unit: string
  min?: number
  max?: number
  step?: number
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function CompactNumField({
  label, description, placeholder, unit, // text elements
  min, max, step, // value range check
  field, fieldState, // Controller-render props
  orientation = "horizontal", className, ...props // Field props
}: CompactNumFieldProps) {
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
      <div className="flex flex-col flex-1 gap-0.5">
        <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
        <FieldDescription className="sr-only">{description}</FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </div>
      <InputGroup className="flex-1">
        <NumFieldInput
          field={field}
          fieldState={fieldState}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
        <InputGroupAddon align="inline-end">{unit}</InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
