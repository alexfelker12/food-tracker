import NoPrefetchLink from "@/components/NoPrefetchLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { calculateBMR, calculateCaloryGoal, calculateRecommendedSplitsByBodyType, calculateTDEE, calculateTEFQuota, calculateWaterDemand, testData } from "@/lib/calculations/profile";
import { flatProfileSchemaMapping } from "@/schemas/mappings/profileSchemaMappings";
import { LogInIcon } from "lucide-react";

export default function Page() {
  const { bodyType, fitnessGoal } = testData
  const { weightKg, fitnGoalMap, activityMap, trainingDaysPerWeek, kfaMap, proteinSplit, fatSplit, carbSplit } = flatProfileSchemaMapping({ ...testData })

  const bmr = calculateBMR({ weightKg, kfaMap })
  const tefQuota = calculateTEFQuota({ carbSplit, fatSplit, proteinSplit })
  const tefQuotaNormalized = calculateTEFQuota({ carbSplit, fatSplit, proteinSplit, normalizePercent: true })
  const tdee = calculateTDEE({ activityMap, bmr, tefQuota, trainingDaysPerWeek })
  const caloryGoal = calculateCaloryGoal({ fitnGoalMap, tdee })
  const recommendedMacroSplits = calculateRecommendedSplitsByBodyType({ bodyType, fitnessGoal })
  const waterDemand = calculateWaterDemand({ trainingDaysPerWeek, weightKg })

  console.log("calculateBMR:", bmr)
  console.log("tefQuota (normalized):", `${tefQuotaNormalized}%`)
  console.log("calculateTDEE:", tdee)
  console.log("calculateCaloryGoal:", caloryGoal)
  console.log("calculateRecommendedSplitsByBodyType:", recommendedMacroSplits)
  console.log("waterDemand:", `${waterDemand}L`)


  return (
    <main className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center gap-4">
        <ThemeToggle />
        <Button asChild variant="link">
          <NoPrefetchLink href="/onboard">
            <LogInIcon /> Zum Onbaord
          </NoPrefetchLink>
        </Button>
      </div>
    </main>
  );
}
