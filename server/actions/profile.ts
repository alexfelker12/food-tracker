import { db } from "@/lib/db";

import { profileSchema } from "@/schemas/profileSchema";
import type { ProfileSchema } from "@/schemas/types";

import { changedProfileCalculation } from "../helpers/changedProfileCalculation.v2";


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
interface UpdateUserProfileProps {
  userProfileData: ProfileSchema
  userId: string
  date: Date
}
export async function updateUserProfileAndLatestResult({ userProfileData, userId, date }: UpdateUserProfileProps) {
  const { success, data } = await profileSchema.safeParseAsync(userProfileData)
  if (!success) return "parsing error" // parse failed -> bad request

  const userProfile = await db.metricsProfile.findFirst({ where: { userId } })
  if (!userProfile) return "no profile"

  const mergedProfileData = {
    ...data.userDataStep,
    ...data.bodyDataStep,
    ...data.fitnessProfileStep,
    ...data.macroSplitStep,
  }

  const nutritionData = changedProfileCalculation(mergedProfileData)
  if (!nutritionData) return "invalid plan"

  const updatedProfile = await db.metricsProfile.update({
    where: { id: userProfile.id, userId },
    data: {
      ...mergedProfileData,
      nutritionResult: {
        upsert: {
          where: { metricsProfileId_date: { date, metricsProfileId: userProfile.id } },
          create: { date, ...nutritionData },
          update: { ...nutritionData }
        }
      }
    },
    include: {
      nutritionResult: {
        orderBy: {
          date: "asc"
        },
        take: 1 // latest nutritionResult
      }
    }
  })

  if (updatedProfile.nutritionResult.length === 0) return "no result"

  return updatedProfile
}
