"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { FoodWithPortionsSchema } from "@/schemas/types";

import { cn } from "@/lib/utils";

import { BarcodeIcon, ScanBarcodeIcon, Trash2Icon, XIcon } from "lucide-react";

import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";


export function FoodBarcodes() {
  //* barcode scanner drawer & a11y
  const [open, setOpen] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  //* form context and state
  const { control, setValue, formState } = useFormContext<FoodWithPortionsSchema>();
  const params = useSearchParams()

  //* initial barcode(s)
  useEffect(() => {
    const barcode = params.get("barcode")
    const initialBarcodes = barcode ? [{ barcode }] : []
    setValue("barcodes", initialBarcodes)
  }, [])

  //* barcodes field array
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "barcodes",
  })

  return (
    <FieldSet className="gap-4">
      <FieldLegend>Barcodes</FieldLegend>
      <FieldDescription>
        Produkte mit hinterlegten Barcodes lassen sich schnell über den Barcode Scanner finden
      </FieldDescription>
      {/* <FieldDescription>
        Füge hier die Barcodes des Produkts hinzu, um dieses über den Barcode Scanner schnell auffindbar zu machen
      </FieldDescription> */}
      <FieldGroup className="gap-2">
        {fields.map((arrayField, index) => (
          <Controller name={`barcodes.${index}.barcode`}
            key={arrayField.id}
            control={control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="gap-1.5"
                orientation="vertical"
              >
                <FieldLabel htmlFor={field.name} className="sr-only">Barcode</FieldLabel>
                <FieldDescription className="sr-only">Barcode des Produkts</FieldDescription>
                <ButtonGroup>

                  {/* barcode input */}
                  <ButtonGroup className="flex-1">
                    <InputGroup className="flex-1">
                      <InputGroupInput
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        {...field}
                      />
                      <InputGroupAddon align="inline-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => field.onChange("")}
                          className={cn(
                            "transition-opacity duration-150",
                            !field.value && "opacity-0 pointer-events-none"
                          )}
                        >
                          <XIcon />
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </ButtonGroup>

                  {/* barcode scanner */}
                  <ButtonGroup>
                    <Drawer open={open} onOpenChange={setOpen}>
                      <DrawerTrigger className="flex-1" asChild>
                        <Button type="button" variant="outline" size="icon"><ScanBarcodeIcon /></Button>
                      </DrawerTrigger>
                      <DrawerContent onOpenAutoFocus={() => firstButtonRef.current?.focus()}>
                        <DrawerHeader>
                          <DrawerTitle className="text-lg">Barcode scannen</DrawerTitle>
                          <DrawerDescription className="text-base sr-only">Scanne den Barcode eines Produkts, um es direkt als Barcode hinzuzufügen</DrawerDescription>
                        </DrawerHeader>

                        <DrawerFooter className="gap-4 pt-0">
                          <BarcodeScanner
                            onDetected={(results) => {
                              if (results.length !== 1) return
                              const barcode = results[0].rawValue
                              field.onChange(barcode)
                              setOpen(false)
                              // if (results.length === 1) {
                              // } else { handle multiple scanned? ... }
                            }}
                          />

                          <Separator />

                          <DrawerClose asChild>
                            <Button className="flex-1" variant="outline" ref={firstButtonRef}>
                              <XIcon /> Abbrechen
                            </Button>
                          </DrawerClose>
                        </DrawerFooter>

                      </DrawerContent>
                    </Drawer>
                  </ButtonGroup>

                  {/* remove barcode */}
                  <ButtonGroup>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2Icon />
                    </Button>
                  </ButtonGroup>

                </ButtonGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        ))}
        {formState.errors.barcodes && (
          <FieldError errors={[formState.errors.barcodes]} />
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => append({
            barcode: ""
          }, { shouldFocus: false })}
        >
          <BarcodeIcon /> Barcode hinzufügen
        </Button>
      </FieldGroup>
    </FieldSet >
  );
}
