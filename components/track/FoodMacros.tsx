"use client"

import { Separator } from "@/components/ui/separator"
import { useFormContext, useWatch } from "react-hook-form"
import { FoodTrackFormProps } from "./FoodTrackForm"


type FoodMacrosProps = Pick<FoodTrackFormProps, "consumable">
export function FoodMacros({ consumable }: FoodMacrosProps) {
  const { control } = useFormContext()

  const formattedMacro = (macroValue: number) => {
    return macroValue === 0 ? 0 : String(macroValue).replace(".", ",")
  }

  const portionData = useWatch({
    name: ["portionId", "portionAmount"],
    control: control,
    compute: ([portionId, portionAmount]) => {
      const currentPortion = consumable.portions.find((portion) => portion.id === portionId)
      if (!currentPortion) return { // fallback (should never happen)
        kcal: "0",
        fats: "0",
        carbs: "0",
        proteins: "0"
      }

      const kcal = +(((currentPortion.grams / 100) * consumable.kcal) * portionAmount).toFixed(0)
      const fats = +(((currentPortion.grams / 100) * consumable.fats) * portionAmount).toFixed(1)
      const carbs = +(((currentPortion.grams / 100) * consumable.carbs) * portionAmount).toFixed(1)
      const proteins = +(((currentPortion.grams / 100) * consumable.protein) * portionAmount).toFixed(1)

      return {
        kcal: formattedMacro(kcal),
        fats: formattedMacro(fats),
        carbs: formattedMacro(carbs),
        proteins: formattedMacro(proteins)
      }
    }
  })

  return (
    <div className="flex justify-between items-center gap-2 h-10">
      <div className="flex flex-col flex-1 gap-1 text-center">
        <span className="text-muted-foreground text-xs">Kalorien</span>
        <span>{portionData.kcal} kcal</span>
      </div>

      <Separator orientation="vertical" className="h-4/5!" />

      <div className="flex flex-col flex-1 gap-1 text-center">
        <span className="text-muted-foreground text-xs">Fette</span>
        <span>{portionData.fats} g</span>
      </div>

      <Separator orientation="vertical" className="h-4/5!" />

      <div className="flex flex-col flex-1 gap-1 text-center">
        <span className="text-muted-foreground text-xs">Kohlenhydrate</span>
        <span>{portionData.carbs} g</span>
      </div>

      <Separator orientation="vertical" className="h-4/5!" />

      <div className="flex flex-col flex-1 gap-1 text-center">
        <span className="text-muted-foreground text-xs">Proteine</span>
        <span>{portionData.proteins} g</span>
      </div>
    </div>
  );
}
