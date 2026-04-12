import { journalEntrySchema } from "@/schemas/journal/journalEntrySchema";
import { JournalEntrySchema, RetrackJournalEntrySchema, UpdateJournalEntrySchema, WaterDemandSchema } from "@/schemas/types";

import { IntakeTime } from "@/generated/prisma/enums";

import { BASE_PORTION_NAME } from "@/lib/constants";
import { db } from "@/lib/db";
import { offsetDate, tryCatch } from "@/lib/utils";


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
      deletedAt: null
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
          //* 4.1 create reference to date and user
          date,
          user: { connect: { id: userId } },
          //* 4.2 create consumable reference
          foodEntry: {
            create: {
              name,
              brand,
              food: { connect: { id: food.id } },
              foodPortion: { connect: { id: food.portions[0].id } }, // portions[0] is defined, see above
              // portionName only when base portion was not used (for change compatability)
              portionName: portionName !== BASE_PORTION_NAME ? portionName : undefined,
              portionAmount,
            }
          },
          //* 4.3 fill out nutritionData
          nutritionData: {
            create: {
              kcal: finalKcal,
              fats: finalFats,
              carbs: finalCarbs,
              proteins: finalProteins,
            }
          },
          //* 4.4 fill out scalar fields
          intakeTime,
        }
      })
    )
  )
    //* only return fulfilled queries
    //? maybe collect rejected queries and pass them along fulfilled ones? (on hold)
    .then((results) => results.flatMap((result) => {
      if (result.status === "rejected") console.log(result.reason);
      return result.status === "fulfilled" ? result.value : []
    }))

  return journalEntries
}


// journal day listing (for now all days - will be optimized)
interface GetJournalDaysProps {
  userId: string
}
export async function getJournalDays({ userId }: GetJournalDaysProps) {
  const firstNutritionResult = await db.nutritionResult.findFirst({
    where: { metricsProfile: { userId }, },
    orderBy: { date: "asc" },
  })

  if (!firstNutritionResult) return null;

  const journalDays = await db.journalEntry.findMany({
    where: {
      userId,
      date: {
        gte: firstNutritionResult.date
      }
    },
    distinct: "date",
    select: {
      date: true,
    },
  })

  return {
    journalDays,
    minDate: firstNutritionResult.date
  }
}


// journal entries by date
interface GetJournalEntriesByDateProps {
  userId: string
  date: Date
}
export async function getJournalEntriesByDate({ userId, date }: GetJournalEntriesByDateProps) {
  const journalEntries = await db.journalEntry.findMany({
    where: {
      userId,
      date,
      foodEntry: { isNot: null, },
      nutritionData: { isNot: null }
    },
    include: {
      foodEntry: {
        include: {
          food: {
            include: {
              portions: true
            }
          },
          foodPortion: true
        }
      },
      nutritionData: true
    }
  })

  return journalEntries as Array<
    typeof journalEntries[number] & {
      foodEntry: NonNullable<typeof journalEntries[number]['foodEntry']>
    } & {
      nutritionData: NonNullable<typeof journalEntries[number]['nutritionData']>
    }
  >
}

// grouped journal entries
interface GetGroupedJournalEntriesProps {
  journalEntries: Awaited<ReturnType<typeof getJournalEntriesByDate>>
}
export function getGroupedJournalEntries({ journalEntries }: GetGroupedJournalEntriesProps) {
  //* group journal entries by their intake time
  const journalEntryGroups = journalEntries.reduce<Record<IntakeTime, typeof journalEntries>>(
    (entryGroups, entry) => {
      entryGroups[entry.intakeTime].push(entry)
      return entryGroups
    }, { BREAKFAST: [], LUNCH: [], DINNER: [], SNACKS: [] }
  )

  return journalEntryGroups
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

  const currentMacros = db.nutritionData.aggregate({
    where: {
      journalEntry: {
        userId,
        date
      }
    },
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
      if (!nutritionResult) return {
        calories: {
          min: 0,
          current: 0,
          max: 0
        },
        proteins: {
          min: 0,
          current: 0,
          max: 0
        },
        carbs: {
          min: 0,
          current: 0,
          max: 0
        },
        fats: {
          min: 0,
          current: 0,
          max: 0
        },
      }; // can't calculate calories and macros if no calory goal was created

      const {
        calorieGoalMin, calorieGoalMax,
        proteinsMinGrams, proteinsMaxGrams,
        carbsMinGrams, carbsMaxGrams,
        fatsMinGrams, fatsMaxGrams
      } = nutritionResult

      // all numbers should be rounded to a full integer for the graphs display
      return {
        calories: {
          min: +(calorieGoalMin).toFixed(0),
          current: kcal ? +(kcal).toFixed(0) : 0,
          max: +(calorieGoalMax).toFixed(0)
        },
        proteins: {
          min: +(proteinsMinGrams).toFixed(0),
          current: proteins ? +(proteins).toFixed(0) : 0,
          max: +(proteinsMaxGrams).toFixed(0)
        },
        carbs: {
          min: +(carbsMinGrams).toFixed(0),
          current: carbs ? +(carbs).toFixed(0) : 0,
          max: +(carbsMaxGrams).toFixed(0)
        },
        fats: {
          min: +(fatsMinGrams).toFixed(0),
          current: fats ? +(fats).toFixed(0) : 0,
          max: +(fatsMaxGrams).toFixed(0)
        },
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
      userId
    }
  })
}


// foods tracked in the last 7 days for a user
interface PastWeekJournalEntryFoodsProps {
  userId: string
}
export async function pastWeekJournalEntryFoods({ userId }: PastWeekJournalEntryFoodsProps) {
  //* create a date object with a date one week ago to set as minimum date for the query
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoDate = offsetDate(weekAgo)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayDate = offsetDate(today)

  //* find all journal entries in the past 7 days until today
  const pastWeekJournalEntries = await db.journalEntry.findMany({
    where: {
      userId,
      date: {
        gt: weekAgoDate,
        lte: todayDate
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      foodEntry: {
        select: {
          food: {
            include: {
              portions: {
                where: {
                  isDefault: true
                }
              }
            }
          }
        }
      }
    }
  })

  //* use a Set to create an array with unique foods
  const distinctFoodIds = new Set<string>()
  const distinctFoods: NonNullable<NonNullable<typeof pastWeekJournalEntries[0]["foodEntry"]>["food"]>[] = []
  pastWeekJournalEntries.forEach((journalEntry) => {
    const food = journalEntry.foodEntry?.food
    if (!food) return;

    if (!distinctFoodIds.has(food.id)) distinctFoods.push(food)
    distinctFoodIds.add(food.id)
  })

  return distinctFoods
}


// move journal entry to different intaketime
interface JournalEntryAction {
  userId: string
  journalEntryId: string
}

interface MoveJournalEntryProps extends JournalEntryAction, Pick<JournalEntrySchema, "intakeTime"> { }
export async function moveJournalEntry({ userId, journalEntryId, intakeTime }: MoveJournalEntryProps) {
  const { data: updatedJournalEntry, error } = await tryCatch(db.journalEntry.update({
    where: {
      id: journalEntryId,
      userId,
      intakeTime: {
        not: intakeTime
      }
    },
    data: { intakeTime }
  }))

  //* if journalEntry does not exist or does not belong the user the update will fail
  if (error) return null

  return updatedJournalEntry
}


// retrack journal entry with different portion and intaketime
interface RetrackJournalEntryProps extends JournalEntryAction, RetrackJournalEntrySchema { }
export async function retrackJournalEntry({
  userId, journalEntryId, intakeTime, portionAmount, portionId
}: RetrackJournalEntryProps) {
  //* 1. get the journal entry
  const journalEntryToRetrack = await getJournalEntryWithReference({ journalEntryId, userId, portionId })

  //* journal entry does not exist or does not belong to the user
  if (!journalEntryToRetrack || !journalEntryToRetrack.foodEntry) return null

  //* 2. get the food from the journal entry
  const { date, foodEntry: { food } } = journalEntryToRetrack

  //* check if food and its portion exist
  if (!food || food.portions.length !== 1) return null // portion does not exist -> bad request
  const { name, brand, kcal, fats, carbs, protein } = food
  const { name: portionName, grams: portionGrams } = food.portions[0]

  //* 3. calculate final macro values
  const finalKcal = +((kcal * (portionGrams / 100)) * portionAmount).toFixed(0)
  const finalFats = +((fats * (portionGrams / 100)) * portionAmount).toFixed(1)
  const finalCarbs = +((carbs * (portionGrams / 100)) * portionAmount).toFixed(1)
  const finalProteins = +((protein * (portionGrams / 100)) * portionAmount).toFixed(1)

  //* 4. retrack (create) entry
  const retrackedJournalEntry = await db.journalEntry.create({
    data: {
      // food/journal entry data
      date,
      // retrack data
      intakeTime,
      // connect to user
      user: { connect: { id: userId } },
      foodEntry: {
        create: {
          name,
          brand,
          portionName,
          portionAmount,
          foodId: food.id, // connect to food
          foodPortionId: portionId // connect to food portion
        }
      },
      // macro data
      nutritionData: {
        create: {
          kcal: finalKcal,
          carbs: finalCarbs,
          fats: finalFats,
          proteins: finalProteins,
        }
      }
    }
  })

  return retrackedJournalEntry
}


// update journal entry with tracked food
interface UpdateJournalEntryProps extends JournalEntryAction, UpdateJournalEntrySchema { }
export async function updateJournalEntryFood({ journalEntryId, userId, portionAmount, portionId }: UpdateJournalEntryProps) {
  //* 1. get the journal entry
  const journalEntryToUpdate = await getJournalEntryWithReference({ journalEntryId, userId, portionId })

  //* journal entry does not exist or does not belong to the user
  if (!journalEntryToUpdate || !journalEntryToUpdate.foodEntry) return null

  //* 2. get the food from the journal entry
  const { foodEntry: { food } } = journalEntryToUpdate

  //* check if food and its portion exist
  if (!food || food.portions.length !== 1) return null
  const { kcal, fats, carbs, protein, portions } = food
  const { grams: portionGrams, name: portionName } = portions[0]

  //* 3. calculate final macro values 
  const finalKcal = +((kcal * (portionGrams / 100)) * portionAmount).toFixed(0)
  const finalFats = +((fats * (portionGrams / 100)) * portionAmount).toFixed(1)
  const finalCarbs = +((carbs * (portionGrams / 100)) * portionAmount).toFixed(1)
  const finalProteins = +((protein * (portionGrams / 100)) * portionAmount).toFixed(1)

  //* 4. update with final (macro) values 
  const updatedJournalEntry = await db.journalEntry.update({
    where: {
      id: journalEntryToUpdate.id,
      userId
    },
    data: {
      //* update portionReference 
      foodEntry: {
        update: {
          foodPortionId: portionId,
          name: food.name,
          brand: food.brand,
          portionName,
          portionAmount
        }
      },
      //* macro values and portionAmount
      nutritionData: {
        update: {
          kcal: finalKcal,
          fats: finalFats,
          carbs: finalCarbs,
          proteins: finalProteins,
        }
      }
    }
  })

  return updatedJournalEntry
}

// grouped journal entries
interface GetJournalEntryWithReferenceProps extends JournalEntryAction, Pick<JournalEntrySchema, "portionId"> { }
async function getJournalEntryWithReference({ journalEntryId, userId, portionId }: GetJournalEntryWithReferenceProps) {
  return await db.journalEntry.findFirst({
    where: {
      id: journalEntryId,
      userId
    },
    include: {
      foodEntry: {
        include: {
          food: {
            include: {
              portions: {
                where: {
                  id: portionId
                }
              }
            }
          },
        }
      }
    }
  })
}


// water demand by date
// TODO: optimize function
interface GetWaterDemandByDateProps {
  userId: string
  date: Date
}
export async function getWaterDemandByDate({ userId, date }: GetWaterDemandByDateProps) {
  const waterDemandPromise = db.nutritionResult.findFirst({
    where: {
      metricsProfile: { userId },
      date: { lte: date }
    },
    orderBy: { date: "desc" },
    select: {
      waterDemandMin: true,
      waterDemandMax: true
    }
  })

  const trackedWaterPromise = db.waterJournalEntry.aggregate({
    where: {
      journalEntry: {
        userId,
        date
      }
    },
    _sum: {
      amountMl: true
    }
  })

  const queriesResult = await Promise.all([waterDemandPromise, trackedWaterPromise])

  const waterDemand = queriesResult[0]
  const trackedWaterSum = queriesResult[1]._sum.amountMl
  const trackedWater = trackedWaterSum ?? 0

  return { waterDemand, trackedWater }
}

// water demand by date
interface TrackWaterByDateProps extends WaterDemandSchema {
  userId: string
  date: Date
}
export async function trackWaterByDate({ userId, date, amountMl }: TrackWaterByDateProps) {
  return await db.journalEntry.create({
    data: {
      date,
      userId,
      waterEntry: {
        create: {
          amountMl
        }
      }
    },
    include: {
      waterEntry: {
        select: {
          amountMl: true
        }
      }
    }
  })
}



// water (journal) entries by date
interface GetWaterEntriesByDateProps {
  userId: string
  date: Date
}
export async function getWaterEntriesByDate({ userId, date }: GetWaterEntriesByDateProps) {
  const waterEntries = await db.journalEntry.findMany({
    where: {
      userId,
      date,
      waterEntry: { isNot: null, },
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      waterEntry: true
    }
  })

  return waterEntries as Array<
    typeof waterEntries[number] & {
      waterEntry: NonNullable<typeof waterEntries[number]['waterEntry']>
    }
  >
}

// edit water entry
interface WaterEntryAction {
  userId: string
  journalEntryId: string
}

interface EditWaterEntryByIdProps extends WaterEntryAction, Pick<WaterDemandSchema, "amountMl"> { }
export async function editWaterEntryById({ userId, journalEntryId, amountMl }: EditWaterEntryByIdProps) {
  const { data: updatedWaterEntry, error } = await tryCatch(db.journalEntry.update({
    where: {
      id: journalEntryId,
      userId
    },
    data: {
      waterEntry: {
        update: {
          amountMl
        }
      }
    },
    include: {
      waterEntry: true
    }
  }))

  //* if journalEntry does not exist or does not belong to the user the update will fail
  if (error) return null

  return updatedWaterEntry as typeof updatedWaterEntry & {
    waterEntry: NonNullable<typeof updatedWaterEntry['waterEntry']>
  }
}

// delete water entry by id
interface DeleteWaterEntryProps {
  userId: string
  journalEntryId: string
}
export async function deleteWaterEntry({ userId, journalEntryId }: DeleteWaterEntryProps) {
  const { data: deletedWaterEntry, error } = await tryCatch(db.journalEntry.delete({
    where: {
      id: journalEntryId,
      userId
    }
  }))

  //* if journalEntry does not exist or does not belong to the user delete will fail
  if (error) return null

  return deletedWaterEntry
}
