"use client"

import { ControllerRenderProps, ControllerFieldState } from "react-hook-form";

import { cn } from "@/lib/utils";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface EnumFieldProps<TEnum extends string> extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder: string
  options: readonly TEnum[]
  labels: Record<TEnum, string>
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function EnumField<TEnum extends string>({
  label, description, placeholder, // text elements
  options, labels, // enum data
  field, fieldState, // Controller-render props
  orientation = "horizontal", className, ...props // Field props
}: EnumFieldProps<TEnum>) {
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

      <EnumFieldInput
        field={field}
        fieldState={fieldState}
        options={options}
        labels={labels}
        placeholder={placeholder}
      />

    </Field>
  );
}

interface EnumFieldInputProps extends Pick<EnumFieldProps<string>, "field" | "fieldState" | "options" | "labels" | "placeholder"> { }
export function EnumFieldInput({
  field, fieldState,
  options, labels,
  placeholder
}: EnumFieldInputProps) {
  return (
    <Select
      name={field.name}
      value={field.value ?? ""}
      onValueChange={(value) => {
        field.onChange(value)
        field.onBlur() // trigger onBlur at onChange event (level): onBlur on SelectTrigger triggers validation before selection because of focus change into select options
      }}
    >
      <SelectTrigger
        id={field.name}
        aria-invalid={fieldState.invalid}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {labels[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

