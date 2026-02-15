"use client"

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

import type { DetailedOptionLabel } from "@/schemas/labels/profileSchemaLabels";

import { cn } from "@/lib/utils";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface DetailedEnumFieldProps<TEnum extends string> extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder: string
  options: readonly TEnum[]
  labels: DetailedOptionLabel<TEnum>
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
  compact?: boolean
}
export function DetailedEnumField<TEnum extends string>({
  label, description, placeholder, compact, // text elements
  options, labels, // enum data
  field, fieldState, // Controller-render props
  orientation = "horizontal", className, ...props // Field props
}: DetailedEnumFieldProps<TEnum>) {
  return (
    <Field
      orientation={orientation}
      data-invalid={fieldState.invalid}
      className={cn(
        "",
        compact && "items-center",
        className
      )}
      {...props}
    >
      <FieldContent className={cn(compact && "sr-only")}>
        <FieldLabel htmlFor={field.name}>
          {label}
        </FieldLabel>
        <FieldDescription className={cn(compact && "sr-only")}>
          {description}
        </FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>

      <DetailedEnumFieldInput
        field={field}
        fieldState={fieldState}
        options={options}
        labels={labels}
        placeholder={placeholder}
      />
    </Field>
  );
}

interface DetailedEnumFieldInputProps extends Pick<DetailedEnumFieldProps<string>, "field" | "fieldState" | "options" | "labels" | "placeholder"> { }
export function DetailedEnumFieldInput({
  field, fieldState,
  options, labels,
  placeholder
}: DetailedEnumFieldInputProps) {
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
        className="w-full h-auto! **:data-[slot=item-description]:hiddenn"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper" align="center">
        {options.map((option) => {
          const { label, description, icon, disabled } = labels[option]
          const Icon = icon

          return (
            <SelectItem key={option} value={option} disabled={disabled}
              //// limit max width relativ to trigger width + container padding
              // popper: max-w-[calc(var(--radix-select-trigger-width)-var(--spacing)*2)]
              // item-aligned: max-w-[calc(100vw-var(--spacing)*10)]
              className="[&[data-state=checked]_[data-slot=item-media]>svg]:text-accent-foreground max-w-[calc(var(--radix-select-trigger-width)-var(--spacing)*2)]"
            >
              <Item size="option">
                <ItemMedia variant="icon-fit"><Icon /></ItemMedia>
                <ItemContent>
                  <ItemTitle>{label}</ItemTitle>
                  <ItemDescription className="text-start text-wrap">{description}</ItemDescription>
                </ItemContent>
              </Item>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  );
}
