import { BASE_PORTION_NAME } from "@/lib/constants";
import { db } from "@/lib/db";
import { journalEntrySchema } from "@/schemas/journal/journalEntrySchema";
import { JournalEntrySchema } from "@/schemas/types";


//* food with portions
interface CreateJournalEntryProps extends JournalEntrySchema {
  userId: string
}
export async function createJournalEntry({ userId, ...schemaProps }: CreateJournalEntryProps) {
  //* 1. check if data is in correct shape
  const { success, data } = await journalEntrySchema.safeParseAsync(schemaProps)
  if (!success) return null; // parse failed -> bad request

  const { consumableId, consumableType, daysToTrack, intakeTime, portionId, portionAmount } = data

  //* 2. get the food with the chosen portion to track 
  const food = await db.food.findFirst({
    where: {
      id: consumableId,
    },
    include: {
      portions: {
        where: {
          id: portionId
        }
      }
    }
  })

  // bad request if both couldn't be found
  if (!food || food.portions.length !== 1) return null // portion does not exist -> bad request

  const { name, brand, kcal, fats, carbs, protein } = food
  const { name: portionName, grams: portionGrams } = food.portions[0]

  //* 3. calculate final macro values since entries are completely static. No calc in frontend needed
  const finalKcal = +((kcal * (portionGrams / 100)) * portionAmount).toFixed(0)
  const finalFats = +((fats * (portionGrams / 100)) * portionAmount).toFixed(1)
  const finalCarbs = +((carbs * (portionGrams / 100)) * portionAmount).toFixed(1)
  const finalProteins = +((protein * (portionGrams / 100)) * portionAmount).toFixed(1)


  //* 4. create journal entries
  // because of the unability of using nested creates in 'createMany()' entries will be created in parellel and awaited together. 'Promise.all()' expects every promise to resolve. In case of any error, successful queries will not be returned. 'Promise.allSettled()' always resolves with information about rejected (failed) queries, giving more control
  //? handle failed queries: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  const journalEntries = await Promise.allSettled(
    daysToTrack.map((date) => //* daysToTrack length -> amount of create queries
      db.journalEntry.create({
        data: {
          //* 4.1 connectOrCreate journal day
          journalDay: {
            connectOrCreate: {
              where: {
                journalDayId: { userId, date },
              },
              create: { userId, date }
            }
          },
          //* 4.2 create consumable reference
          // discriminate between consumable type to set correct consumable fields
          consumableReference: {
            create: {
              ...(consumableType === "FOOD"
                ? {
                  food: {
                    connect: {
                      id: consumableId
                    }
                  },
                  foodPortion: {
                    connect: {
                      id: portionId
                    }
                  },
                } : {
                  meal: {
                    connect: {
                      id: consumableId
                    }
                  },
                  mealPortion: {
                    connect: {
                      id: portionId
                    }
                  },
                }
              ),
            }
          },
          //* 4.3 fill out scalar fields
          intakeTime,
          name,
          brand,
          // portionName only when base portion was not used (for change compatability)
          portionName: portionName !== BASE_PORTION_NAME ? portionName : undefined,
          portionAmount,
          kcal: finalKcal,
          fats: finalFats,
          carbs: finalCarbs,
          proteins: finalProteins,
        }
      })
    )
  )
    //* only return fulfilled queries
    //? maybe collect rejected queries and pass them along fulfilled ones? (on hold)
    .then((results) => results.flatMap((result) => {
      // if (result.status === "rejected") console.log(result.reason);
      return result.status === "fulfilled" ? result.value : []
    }))

  return journalEntries
}


// journal day listing (for now all days - will be optimized)
interface GetJournalDaysProps {
  userId: string
}
export async function getJournalDays({ userId }: GetJournalDaysProps) {
  return await db.journalDay.findMany({
    where: {
      userId,
      journalEntries: {
        some: {}
      }
    }
  })
}


// journalDay by date
interface GetJournalDayWithEntriesProps {
  userId: string
  date: Date
}
export async function getJournalDayWithEntries({ userId, date }: GetJournalDayWithEntriesProps) {
  return await db.journalDay.findUnique({
    where: {
      journalDayId: {
        userId, date
      },
      journalEntries: {
        some: {}
      }
    },
    include: {
      journalEntries: { // with entries
        include: {
          consumableReference: true
        }
      }
    }
  })
}


// open macros and calories for a journalDay by date
interface GetJournalDayMacrosProps {
  userId: string
  date: Date
}
export async function getJournalDayMacros({ userId, date }: GetJournalDayMacrosProps) {
  const latestNutritionResult = db.nutritionResult.findFirst({
    where: {
      metricsProfile: {
        userId
      },
      date: {
        lte: date
      }
    },
    orderBy: {
      date: "desc"
    }
  })

  const currentMacros = db.journalEntry.aggregate({
    where: { journalDay: { userId, date } },
    _sum: {
      kcal: true,
      fats: true,
      carbs: true,
      proteins: true
    }
  })

  const openMacros = await Promise
    .all([latestNutritionResult, currentMacros])
    .then(([nutritionResult, { _sum: { kcal, fats, carbs, proteins } }]) => {
      if (!nutritionResult) return null; // can't calculate calories and macros if no calory goal was created

      const { caloryGoal, amountFats, amountCarbs, amountProtein } = nutritionResult

      return {
        availableMacros: {
          kcal: caloryGoal,
          fats: amountFats,
          carbs: amountCarbs,
          proteins: amountProtein,
        },
        openMacros: {
          kcal: +(caloryGoal - (kcal || 0)).toFixed(0),
          fats: +(amountFats - (fats || 0)).toFixed(1),
          carbs: +(amountCarbs - (carbs || 0)).toFixed(1),
          proteins: +(amountProtein - (proteins || 0)).toFixed(1),
        }
      }
    })

  return openMacros
}


// delete journal entry by id
interface DeleteJournalEntryProps {
  userId: string
  journalEntryId: string
}
export async function deleteJournalEntry({ userId, journalEntryId }: DeleteJournalEntryProps) {
  return await db.journalEntry.delete({
    where: {
      id: journalEntryId,
      journalDayUserId: userId
    }
  })
}
