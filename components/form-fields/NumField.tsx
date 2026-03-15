"use client"

import { useState } from "react";

import { ControllerFieldState, ControllerRenderProps, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";


export interface NumFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder?: `${number}`
  unit: string
  min?: number
  max?: number
  step?: number
  autoWidth?: boolean

  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function NumField({
  label, description, placeholder, unit, // text elements
  min, max, step, autoWidth, // value range check
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
          step={step}
          autoWidth={autoWidth}
        />
        <InputGroupAddon align="inline-end">{unit}</InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

interface NumFieldInputProps extends Pick<NumFieldProps, "field" | "fieldState" | "autoWidth">, React.ComponentProps<typeof Input> {
  asInput?: boolean
}
export function NumFieldInput({
  field, fieldState,
  onInput, min = 0, max = 999, step = 0.001,
  placeholder, asInput, autoWidth,
  className, ...props
}: NumFieldInputProps) {
  // const [inputCh, setInputCh] = useState(String(field.value ?? "").length)

  // ensure proper input logic if min is bigger than max
  const isMinMaxinvalid = min > max
  const minSafe = isMinMaxinvalid ? max : min
  const maxSafe = isMinMaxinvalid ? min : max

  // calculate width of text with character length of value string multiplied with 1 ch ("ch": 0-digit width of font)
  const inputCh = Math.min(Math.max((String((isNaN(field.value) ? 1 : field.value) || 1).length), 1), String(maxSafe).length)

  // both components use <Input /> under the hood, but InputGroupInput gets additional attributes/classnames 
  const InputComp = asInput ? Input : InputGroupInput

  return (
    <InputComp
      id={field.name}
      className={cn("text-right flex-none pr-1! max-w-auto", className)}
      type="number"
      inputMode="decimal"
      autoComplete="off"
      min={minSafe}
      max={maxSafe}
      step={step}
      placeholder={placeholder}
      aria-invalid={fieldState.invalid}
      {...field}
      value={field.value ?? ""}
      onChange={event => {
        const value = event.target.value
        const numValue = +value
        const onChangeValue = value === "" || isNaN(numValue)
          ? null
          : Math.min(Math.max(numValue, +minSafe), +maxSafe)
        field.onChange(onChangeValue)
        if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
      }}
      // onFocus={(e) => e.target.select()}
      onInput={(e) => {
        onInput?.(e)
        //// always execute auto width logic (at least 1ch, max 4ch)
        // setInputCh(Math.min(Math.max(e.currentTarget.value.length, 1), 5))
      }}
      {...(
        autoWidth && { style: { width: `calc(${inputCh}ch + 1rem)` } }
      )}
      {...props}
    />
  );
}
