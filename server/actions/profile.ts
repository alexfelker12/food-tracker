import { db } from "@/lib/db";

import { changedProfileCalculation, ChangedProfileCalculationProps } from "../helpers/changedProfileCalculation";


//* steps profile
interface getUserProfileProps {
  userId: string
}
export async function getUserProfile({ userId }: getUserProfileProps) {
  const profileWithNutritionResult = await db.metricsProfile.findFirst({
    where: { userId },
    include: {
      nutritionResult: {
        orderBy: { date: "desc" },
        take: 1, // ^ get latest nutritionResult
        omit: { profileSnapshot: true } // not needed for profile display
      },
      user: {
        select: {
          name: true,
          displayUsername: true
        }
      }
    }
  })

  if (!profileWithNutritionResult || profileWithNutritionResult.nutritionResult.length !== 1) return null

  const { nutritionResult, ...rest } = profileWithNutritionResult
  const currentNutritionResult = profileWithNutritionResult.nutritionResult[0] // allowed because we explicitly check if nutritionResult has a length of 1

  //* return a object which includes the latest nutritionResult data as an object instead of an array 
  return {
    ...rest,
    nutritionResult: currentNutritionResult
  }
}


//* update profile
interface UpdateUserProfileProps extends Pick<ChangedProfileCalculationProps, "profileData"> {
  userId: string
}
export async function updateUserProfile({
  userId,
  profileData,
}: UpdateUserProfileProps) {
  return await db.metricsProfile.update({
    where: {
      userId
    },
    data: {
      ...profileData
    }
  })
}


//* create nutrition result from updated 
interface UpsertNutritionResultFromProfileChangeProps extends ChangedProfileCalculationProps {
  metricsProfileId: string
  updateDay: Date
}
export async function upsertNutritionResultFromProfileChange({
  metricsProfileId,
  updateDay: date,
  profileData,
  useRecommended
}: UpsertNutritionResultFromProfileChangeProps) {
  const { ...nutritionData } = await changedProfileCalculation({ profileData, useRecommended })

  return await db.nutritionResult.upsert({
    where: {
      metricsProfileId_date: {
        metricsProfileId, date
      }
    },
    update: {
      ...nutritionData,
      // connect to metricsProfile (id)
    },
    create: {
      ...nutritionData,
      metricsProfile: { connect: { id: metricsProfileId } }
    }
  })
}