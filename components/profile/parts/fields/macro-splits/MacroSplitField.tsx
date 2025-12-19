"use client"

import { ControllerFieldState, ControllerRenderProps, useFormContext } from "react-hook-form";

import { ProfileSchema } from "@/schemas/types";

import { LockIcon, LockOpenIcon, MoveRightIcon } from "lucide-react";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";


interface MacroSplitFieldProps extends React.ComponentProps<typeof Field> {
  label: string
  description: string
  splitUnlocked: boolean
  useRecommended?: boolean

  value: number[]
  onValueChange: (value: number[]) => void
  onPressedChange: (pressed: boolean) => void
  splitGramAmount: number

  field: ControllerRenderProps<any, any>
  fieldState: ControllerFieldState
}
export function MacroSplitField({
  label, description, splitUnlocked, useRecommended,
  value, onValueChange, onPressedChange, splitGramAmount,
  field, fieldState
}: MacroSplitFieldProps) {
  return (
    <Field className="gap-1.5" orientation="vertical" data-invalid={fieldState.invalid}>

      {/* field label/description */}
      <FieldContent className="gap-1">
        <FieldLabel id="macroSplitStep" className="flex justify-between gap-2 w-full">
          <span>{label}</span>
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <span>{field.value}%</span>
            <MoveRightIcon aria-description="ergibt wert" />
            <span className="text-secondary-foreground">{splitGramAmount}g</span>
          </span>
        </FieldLabel>
        <FieldDescription className="sr-only">
          {description}
        </FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>

      {/* slider */}
      <div className="flex gap-3 h-8">
        <Slider
          value={value}
          onValueChange={onValueChange}
          aria-invalid={fieldState.invalid}
          className="w-full transition-opacity"
          aria-label="Price Range"
          aria-describedby="macroSplitStep"
          disabled={splitUnlocked || useRecommended}
        />
        {/* only show when not using recommended values */}
        {!useRecommended && <Toggle
          aria-label={`Entsperre ${label}`}
          pressed={splitUnlocked}
          onPressedChange={onPressedChange}
          size="sm"
        >
          {splitUnlocked ? <LockOpenIcon /> : <LockIcon />}
        </Toggle>}
      </div>

    </Field>
  );
}