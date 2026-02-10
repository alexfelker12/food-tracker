import { profileSchema } from "@/schemas/profileSchema";
import { ProfileSchema } from "@/schemas/types";

import { db } from "@/lib/db";

import { changedProfileCalculation } from "../helpers/changedProfileCalculation.v2";


//* steps profile
interface CreateProfileFromStepsProps {
  userProfileData: ProfileSchema
  userId: string
  date: Date
}
export async function createInitialProfileAndResult({ userProfileData, userId, date }: CreateProfileFromStepsProps) {
  const { success, data } = await profileSchema.safeParseAsync(userProfileData)
  if (!success) return "parsing error" // parse failed -> bad request

  const hasProfile = await db.metricsProfile.findFirst({ where: { userId } })
  if (hasProfile) return "has profile"

  const mergedProfileData = {
    ...data.userDataStep,
    ...data.bodyDataStep,
    ...data.fitnessProfileStep,
    ...data.macroSplitStep,
  }

  //* first nutrition result
  const nutritionData = changedProfileCalculation(mergedProfileData)
  if (!nutritionData) return "invalid plan"

  const initialProfile = await db.metricsProfile.create({
    data: {
      ...mergedProfileData,
      user: {
        connect: {
          id: userId
        }
      },
      nutritionResult: {
        create: {
          ...nutritionData,
          date
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

  if (initialProfile.nutritionResult.length === 0) return "no result"

  return initialProfile
}


//* flat profile
// interface createProfileFromMergedProps {
//   userProfileData: FlatProfileSchema
//   userId: string
// }
// export async function createProfileFromMerged({ }: createProfileFromMergedProps) { }
