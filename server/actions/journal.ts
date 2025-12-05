import { db } from "@/lib/db";
import { journalEntrySchema } from "@/schemas/journal/journalEntrySchema";
import { JournalEntrySchema } from "@/schemas/types";


//* food with portions
interface CreateJournalEntryProps extends JournalEntrySchema {
  userId: string
}
export async function createJournalEntry({ userId, ...schemaProps }: CreateJournalEntryProps) {
  const { success, data } = await journalEntrySchema.safeParseAsync(schemaProps)
  if (!success) return null; // parse failed -> bad request

  const { consumableId, consumableType, daysToTrack, intakeTime, portionId, portionAmount } = data

  const portion = await db.foodPortion.findFirst({
    where: {
      id: portionId,
      foodId: consumableId
    }
  })

  if (!portion) return null // portion does not exist -> bad request

  const { name: portionName, grams: portionGrams } = portion

  //* because of the unability of using nested creates in 'createMany()' entries will be created in parellel and awaited together. 'Promise.all()' expects every promise to resolve. In case of any error, successful queries will not be returned. 'Promise.allSettled()' always resolves with information about rejected (failed) queries, giving more control
  //? handle failed queries: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
  const journalEntries = await Promise.allSettled(
    daysToTrack.map((date) => //* daysToTrack length -> amount of create queries
      db.journalEntry.create({
        data: {
          //* connectOrCreate journal day
          journalDay: {
            connectOrCreate: {
              where: {
                journalDayId: { userId, date },
              },
              create: { userId, date }
            }
          },
          //* portion reference
          portion: {
            create: {
              // discriminate between consumable type to set correct consumable portionId
              ...(consumableType === "FOOD"
                ? { foodPortionId: portionId }
                : { mealPortionId: portionId }
              ),
              portionName, portionGrams, portionAmount
            }
          },
          //* discriminate between consumable type to set correct consumable id
          ...(consumableType === "FOOD"
            ? {
              food: {
                connect: {
                  id: consumableId
                }
              }
            } : {
              meal: {
                connect: {
                  id: consumableId
                }
              }
            }
          ),
          //* intake time
          intakeTime
        }
      })
    )
  )
    //* only return fulfilled queries
    //? maybe collect rejected queries and pass them along fulfilled ones? (on hold)
    .then((results) => results.flatMap((result) => result.status === "fulfilled" ? result.value : []))

  return journalEntries
}


// journal day listing (for now all days - will be optimized)
interface GetJournalDaysProps {
  userId: string
}
export async function getJournalDays({ userId }: GetJournalDaysProps) {
  return await db.journalDay.findMany({
    where: { userId }
  })
}


// // food by id
// interface GetFoodByIdProps {
//   foodId: string
// }
// export async function getFoodById({ foodId }: GetFoodByIdProps) {
//   return await db.food.findFirst({
//     where: {
//       id: foodId,
//     },
//     include: {
//       portions: true,
//     }
//   })
// }
