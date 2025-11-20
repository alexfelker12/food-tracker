export type FirstNutritionResultDisplayProps = {
  caloryGoal?: number
  amountFats?: number
  amountCarbs?: number
  amountProtein?: number
}

export function FirstNutritionResultDisplay({ caloryGoal, amountFats, amountCarbs, amountProtein }: FirstNutritionResultDisplayProps) {
  if (!caloryGoal || !amountFats || !amountCarbs || !amountProtein) return null; // don't show if information is missing

  return (
    <div className="items-center gap-x-1 gap-y-2 grid grid-cols-[1fr_auto_auto] my-2 text-start">
      <span className="col-span-3 border-b text-sm"> Täglich</span>

      {/* calory goal */}
      <DisplayRow label="Kalorien-Ziel" value={caloryGoal} unit="kcal" />

      {/* fats */}
      <DisplayRow label="Fette" value={amountFats} unit="g" />

      {/* carbs */}
      <DisplayRow label="Kohlenhydrate" value={amountCarbs} unit="g" />

      {/* proteins */}
      <DisplayRow label="Proteine" value={amountProtein} unit="g" />
    </div>
  );
}

type DisplayRowProps = {
  label: string
  value: number
  unit: string
}
function DisplayRow({ label, value, unit }: DisplayRowProps) {
  return (
    <>
      <span>{label}</span>
      <span className="text-end">{value}</span>
      <span className="text-muted-foreground text-sm">{unit}</span>
    </>
  );
}