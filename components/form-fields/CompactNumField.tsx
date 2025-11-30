"use client"

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";


interface CompactNumFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder?: `${number}`
  unit: string
  min?: number
  max?: number
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function CompactNumField({
  label, description, placeholder, unit, // text elements
  min, max, // value range check
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
        <CompactNumFieldInput
          field={field}
          fieldState={fieldState}
          placeholder={placeholder}
          min={min}
          max={max}
        />
        <InputGroupAddon align="inline-end">{unit}</InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

interface CompactNumFieldInputProps extends Pick<CompactNumFieldProps, "field" | "fieldState" | "min" | "max" | "placeholder"> { }
export function CompactNumFieldInput({
  field, fieldState,
  min = 0, max = 999,
  placeholder
}: CompactNumFieldInputProps) {
  if (min > max) return null; // input logic not executable if max is bigger than min

  return (
    <InputGroupInput
      id={field.name}
      className="text-right"
      aria-invalid={fieldState.invalid}
      type="number"
      placeholder={placeholder}
      min={min}
      max={max}
      {...field}
      value={field.value ?? ""}
      onChange={event => {
        const value = event.target.value
        const numValue = +value
        const onChangeValue = value === "" || isNaN(numValue)
          ? null
          : +(Math.min(Math.max(numValue, min), max).toFixed(2))
        field.onChange(onChangeValue)
        if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
      }}
      onFocus={(e) => e.target.select()}
    />
  );
}
