import { MetricsProfileModel } from "@/generated/prisma/models";
import { calculateBMR, calculateCaloryGoal, calculateRecommendedSplitsByBodyType, calculateTDEE, calculateTEFQuota, calculateTotalSplitValues, calculateWaterDemand } from "@/lib/calculations/profile";
import { db } from "@/lib/db";
import { flatProfileSchemaMapping } from "@/schemas/mappings/profileSchemaMappings";
import { profileSchema } from "@/schemas/profileSchema";
import { FlatProfileSchema, ProfileSchema } from "@/schemas/types";


//* steps profile
interface CreateProfileFromStepsProps {
  userProfileData: ProfileSchema
  userId: string
}
export async function createProfileFromSteps({ userProfileData, userId }: CreateProfileFromStepsProps) {
  const hasProfile = await db.metricsProfile.findFirst({
    where: {
      userId
    }
  })

  if (hasProfile) return "has profile";

  const { success, data } = await profileSchema.safeParseAsync(userProfileData)

  if (!success) return "parsing error"; // parse failed -> bad request

  const {
    userDataStep,
    bodyDataStep,
    fitnessProfileStep,
    macroSplitStep: { useRecommended, ...partialMacroSplitStep }
  } = data

  return await db.metricsProfile.create({
    data: {
      ...userDataStep,
      ...bodyDataStep,
      ...fitnessProfileStep,
      ...partialMacroSplitStep,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}


//* flat profile
interface createProfileFromMergedProps {
  userProfileData: FlatProfileSchema
  userId: string
}
export async function createProfileFromMerged({ }: createProfileFromMergedProps) { }


//* create nutrition result
interface CreateNutritionResultFromProfileProps {
  profileData: MetricsProfileModel,
  useRecommended: boolean
}
export async function createNutritionResultFromProfile({ profileData, useRecommended }: CreateNutritionResultFromProfileProps) {
  const { id, userId, ...actualProfileData } = profileData
  const { weightKg, fitnGoalMap, activityMap, trainingDaysPerWeek, kfaMap, proteinSplit, fatSplit, carbSplit } = flatProfileSchemaMapping({ ...actualProfileData, useRecommended })

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

  return await db.nutritionResult.create({
    data: {
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
      profileSnapshot: actualProfileData,
      usedRecommendedSplits: useRecommended,
      // connect to metricsProfile (id)
      metricsProfile: { connect: { id } }
    }
  })
}
