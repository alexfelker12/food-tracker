import { profileSchema } from "@/schemas/profileSchema";
import { FlatProfileSchema, ProfileSchema } from "@/schemas/types";

import { db } from "@/lib/db";

import { changedProfileCalculation, ChangedProfileCalculationProps } from "../helpers/changedProfileCalculation";


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
// interface createProfileFromMergedProps {
//   userProfileData: FlatProfileSchema
//   userId: string
// }
// export async function createProfileFromMerged({ }: createProfileFromMergedProps) { }


//* create nutrition result
interface CreateNutritionResultFromProfileProps extends ChangedProfileCalculationProps {
  metricsProfileId: string
}
export async function createNutritionResultFromProfile({
  metricsProfileId,
  profileData,
  useRecommended
}: CreateNutritionResultFromProfileProps) {
  const nutritionData = await changedProfileCalculation({ profileData, useRecommended })

  return await db.nutritionResult.create({
    data: {
      ...nutritionData,
      // connect to metricsProfile (id)
      metricsProfile: { connect: { id: metricsProfileId } }
    }
  })
}
