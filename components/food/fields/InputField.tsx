"use client"

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";


interface InputFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder: string
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function InputField({
  label, description, placeholder, // text elements
  field, fieldState, // Controller-render props
  className, ...props // Field props
}: InputFieldProps) {
  return (
    <Field
      data-invalid={fieldState.invalid}
      className={cn(
        "gap-1.5",
        className
      )}
      {...props}
    >
      <FieldLabel htmlFor={field.name}>
        {label}
      </FieldLabel>
      <Input
        id={field.name}
        className={cn(
          "",
        )}
        placeholder={placeholder}
        aria-invalid={fieldState.invalid}
        {...field}
      // value={field.value ?? ""}
      // onChange={event => {
      //   const value = event.target.value
      //   const numValue = +value
      //   const onChangeValue = value === "" || isNaN(numValue)
      //     ? null
      //     : Math.min(Math.max(numValue, min), max)
      //   field.onChange(onChangeValue)
      //   if (fieldState.isTouched) field.onBlur() // trigger onBlur at onChange event (level): onBlur triggers validation "onInput"
      // }}
      />
      <FieldDescription>
        {description}
      </FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
