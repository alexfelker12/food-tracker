"use client"

import { ControllerRenderProps, ControllerFieldState } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";


interface NumFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder: `${number}`
  unit: string
  min?: number
  max?: number
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function NumField({
  label, description, placeholder, unit, // text elements
  min, max, // value range check
  field, fieldState, // Controller-render props
  orientation = "horizontal", className, ...props // Field props
}: NumFieldProps) {
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
      <InputGroup className="flex-none w-auto">
        <NumFieldInput
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

interface NumFieldInputProps extends Pick<NumFieldProps, "field" | "fieldState" | "min" | "max" | "placeholder"> { }
export function NumFieldInput({
  field, fieldState,
  min = 0, max = 999,
  placeholder
}: NumFieldInputProps) {
  if (min > max) return null; // input logic not executable if max is bigger than min

  return (
    <InputGroupInput
      id={field.name}
      className={cn(
        "text-right flex-none max-w-[68px]",
        // (field.value || +placeholder) > 99
        //   ? "max-w-11"
        //   : (field.value || +placeholder) > 9
        //     ? "max-w-9"
        //     : "max-w-7"
      )}
      type="number"
      min={min}
      max={max}
      placeholder={placeholder}
      aria-invalid={fieldState.invalid}
      {...field}
      value={field.value ?? ""}
      onChange={event => {
        const value = event.target.value
        const numValue = +value
        const onChangeValue = value === "" || isNaN(numValue)
          ? null
          : Math.min(Math.max(numValue, min), max)
        field.onChange(onChangeValue)
        if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
      }}
      onFocus={(e) => e.target.select()}
    />
  );
}
