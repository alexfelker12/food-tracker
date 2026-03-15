"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { waterDemandSchema } from "@/schemas/journal/journalEntrySchema";
import type { WaterDemandSchema } from "@/schemas/types";

import { orpc } from "@/lib/orpc";
import { cn } from "@/lib/utils";

import { PlusIcon, RotateCcwIcon, SaveIcon } from "lucide-react";

import { CompactNumField } from "@/components/form-fields/CompactNumField";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";


export interface AddWaterFormBaseProps {
  currentAmountMl: number
  minAmountMl: number
  maxAmountMl: number
}
interface AddWaterFormProps extends AddWaterFormBaseProps, React.ComponentProps<"form"> {
  onSuccessComplete?: () => void
}
export function AddWaterForm({ currentAmountMl, minAmountMl, maxAmountMl, onSuccessComplete, className, children, ...props }: AddWaterFormProps) {
  const qc = useQueryClient()

  //* main form
  const form = useForm({
    resolver: zodResolver(waterDemandSchema),
    mode: "onTouched",
  })

  //* create food mutation
  const { mutate: trackWater, isPending } = useMutation(orpc.journal.day.trackWater.mutationOptions({
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message)
      } else {
        toast.error("Es gab Probleme beim Tracken. Versuche es nochmal!")
      }
    },
    // onSuccess parameters: (data, variables, onMutateResult, context)
    onSuccess: (data) => {
      form.reset()
      qc.invalidateQueries({ queryKey: [["journal", "day", "getWaterDemand"]] })
      qc.invalidateQueries({ queryKey: [["journal", "day", "water"]] })
      toast("Wasser wurde getrackt", { description: `${data.waterEntry?.amountMl} ml` })
      onSuccessComplete?.()
    }
  }))

  // formatted text/state
  const minGoalMl = +(minAmountMl).toFixed(0)
  const maxGoalMl = +(maxAmountMl).toFixed(0)
  const minAmountLeftMl = +(minAmountMl - currentAmountMl).toFixed(0)
  const maxAmountLeftMl = +(maxAmountMl - currentAmountMl).toFixed(0)

  return (
    <FormProvider {...form}>
      <form
        className={cn("flex flex-col gap-4 p-4 w-full", className)}
        onSubmit={form.handleSubmit((values) => trackWater({
          date: (new Date()),
          waterDemandSchema: values
        }))}
        // onSubmit={form.handleSubmit((values) => console.log(values))}
        {...props}
      >

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-sm">
            <span>Tages-Ziel:</span>
            <span>
              {minGoalMl} <span className="text-muted-foreground">ml</span> - {" "}
              {maxGoalMl} <span className="text-muted-foreground">ml</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Noch übrig:</span>
            <span>
              {minAmountLeftMl} <span className="text-muted-foreground">ml</span> - {" "}
              {maxAmountLeftMl} <span className="text-muted-foreground">ml</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Bisher getrackt:</span>
            <span>{currentAmountMl} <span className="text-muted-foreground">ml</span></span>
          </div>
        </div>

        <Separator />

        <ButtonGroup orientation="vertical" className="items-center w-full">
          <ButtonGroup className="w-full">
            <AmountInput />
          </ButtonGroup>

          <ButtonGroup className="*:[button]:flex-1 w-full">
            <IncrementButton reset />
            <IncrementButton amount={50} />
            <IncrementButton amount={100} />
            <IncrementButton amount={500} />
            {/* <Button size="sm" variant="outline"><PenIcon /></Button> */}
          </ButtonGroup>

          {/* <ButtonGroup className="w-full"></ButtonGroup> */}

        </ButtonGroup>

        <div className="flex flex-col gap-2">
          <Button disabled={isPending} className="w-full">
            {isPending ? <Spinner /> : <SaveIcon />} Speichern
          </Button>

          {children}
        </div>
      </form>
    </FormProvider>
  );
}

function AmountInput() {
  const { control } = useFormContext<WaterDemandSchema>();

  return (
    <Controller name="amountMl"
      control={control}
      render={({ field, fieldState }) => (
        <CompactNumField
          field={field}
          fieldState={fieldState}
          label="Menge"
          description="Menge in ml"
          unit="ml"
          className="*:first:flex-row flex-1 *:first:justify-between"
          placeholder="0"
          max={9999}
          step={10}
          autoWidth
        />
      )}
    />
  );
}

function IncrementButton({
  amount,
  reset,
  size = "sm",
  variant = "outline",
  onClick,
  className,
  ...props
}: React.ComponentProps<typeof Button> & ({
  reset?: false
  amount: number
} | {
  reset: true
  amount?: undefined
})) {
  const { getValues, setValue, trigger } = useFormContext<WaterDemandSchema>();

  // handles increment of water amount for tracking
  const handleAmountChange = () => {
    const currentAmountMl = getValues("amountMl") || 0
    const newAmountMl = currentAmountMl + (amount ?? 0) // add amount (should be defined when not reseting)
    setValue("amountMl", newAmountMl)
    trigger("amountMl")
  }

  const resetAmountChange = () => setValue("amountMl", 0)

  return (
    <Button
      type="button"
      className={cn("gap-0.5", reset && "flex-none!", className)}
      variant={variant}
      size={size}
      onClick={(e) => {
        onClick?.(e);
        if (reset) {
          resetAmountChange()
        } else {
          handleAmountChange()
        }
      }}
      {...props}
    >
      {!reset
        ? <>
          <PlusIcon className="size-3" />
          {amount}
          <span className="text-muted-foreground">ml</span>
        </>
        : <RotateCcwIcon />
      }
    </Button>
  );
}

// function LabeledSeparator({
//   className,
//   children,
//   ...props
// }: React.ComponentProps<typeof Separator>) {
//   return (
//     <Separator
//       className={cn(
//         "relative",
//         className
//       )}
//       {...props}
//     >
//       <span className="top-0 left-1/2 absolute bg-background px-2 text-muted-foreground text-sm -translate-1/2">
//         {children}
//       </span>
//     </Separator>
//   );
// }
