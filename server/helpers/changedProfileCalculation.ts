import { MetricsProfileModel } from "@/generated/prisma/models";
import { calculateBMR, calculateCaloryGoal, calculateRecommendedSplitsByBodyType, calculateTDEE, calculateTEFQuota, calculateTotalSplitValues, calculateWaterDemand } from "@/lib/calculations/profile";
import { db } from "@/lib/db";
import { flatProfileSchemaMapping } from "@/schemas/mappings/profileSchemaMappings";


//* create nutrition result
export interface ChangedProfileCalculationProps {
  profileData: Omit<MetricsProfileModel, "id" | "userId"> //TODO: correct profile type
  useRecommended: boolean
}
export async function changedProfileCalculation({ profileData, useRecommended }: ChangedProfileCalculationProps) {
  const { weightKg, fitnGoalMap, activityMap, trainingDaysPerWeek, kfaMap, proteinSplit, fatSplit, carbSplit } = flatProfileSchemaMapping({ ...profileData, useRecommended })

  const bmr = calculateBMR({ weightKg, kfaMap })
  const tefQuota = calculateTEFQuota({ carbSplit, fatSplit, proteinSplit })
  const tdee = calculateTDEE({ activityMap, bmr, tefQuota, trainingDaysPerWeek })
  const caloryGoal = calculateCaloryGoal({ fitnGoalMap, tdee })
  const waterDemand = calculateWaterDemand({ trainingDaysPerWeek, weightKg })

  let finalProteinSplit = proteinSplit
  let finalFatSplit = fatSplit
  let finalCarbSplit = carbSplit
  if (useRecommended) {
    const {
      proteinSplit: recProteinSplit,
      fatSplit: recFatSplit,
      carbSplit: recCarbSplit
    } = calculateRecommendedSplitsByBodyType({
      bodyType: profileData.bodyType,
      fitnessGoal: profileData.fitnessGoal
    })

    finalProteinSplit = recProteinSplit
    finalFatSplit = recFatSplit
    finalCarbSplit = recCarbSplit
  }

  const { amountCarbs, amountFats, amountProtein } = calculateTotalSplitValues({
    caloryGoal,
    proteinSplit: finalProteinSplit,
    fatSplit: finalFatSplit,
    carbSplit: finalCarbSplit,
  })

  return {
    bmr,
    tdee,
    caloryGoal,
    tefQuota,
    waterDemand,
    // gram amounts from splits
    amountCarbs,
    amountFats,
    amountProtein,
    // snapshot/extra data
    profileSnapshot: profileData,
    usedRecommendedSplits: useRecommended,
  }
}
