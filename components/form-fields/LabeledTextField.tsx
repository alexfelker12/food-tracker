"use client"

import { ControllerFieldState, ControllerRenderProps } from "react-hook-form";

import { cn } from "@/lib/utils";

import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";


interface LabeledTextFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  placeholder: string
  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}

export function LabeledTextField({
  label, description, placeholder, // text elements
  field, fieldState, // Controller-render props
  className, ...props // Field props
}: LabeledTextFieldProps) {
  return (
    <Field
      data-invalid={fieldState.invalid}
      className={cn(
        "gap-1.5",
        className
      )}
      {...props}
    >
      <FieldDescription className="sr-only">{description}</FieldDescription>

      <ButtonGroup>
        <ButtonGroupText asChild>
          <FieldLabel htmlFor={field.name} className="justify-center w-16">{label}</FieldLabel>
        </ButtonGroupText>
        <InputGroup>
          <LabeledTextFieldInput
            field={field}
            fieldState={fieldState}
            placeholder={placeholder}
          />
        </InputGroup>
      </ButtonGroup>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}

interface LabeledTextFieldInputProps extends Pick<LabeledTextFieldProps, "field" | "fieldState" | "placeholder"> { }
export function LabeledTextFieldInput({
  field, fieldState,
  placeholder
}: LabeledTextFieldInputProps) {
  return (
    <InputGroupInput
      id={field.name}
      className=""
      placeholder={placeholder}
      aria-invalid={fieldState.invalid}
      {...field}
    />
  );
}
