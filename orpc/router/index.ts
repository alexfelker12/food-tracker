//* onboard
import { createInitialProfile } from "@/orpc/router/onboard";

//* profile
import { getProfile } from "@/orpc/router/profile/get";
import { updateProfile } from "@/orpc/router/profile/update";

//* food
import { createFood } from "@/orpc/router/food/create";
import { foodById } from "@/orpc/router/food/get";
import { listFood } from "@/orpc/router/food/list";

//* journal
import { trackFood } from "@/orpc/router/journal/track";
import { journalDayEntriesByDate } from "@/orpc/router/journal/day/getEntries";
import { journalDayMacrosByDate } from "@/orpc/router/journal/day/getMacros";
import { deleteEntry } from "@/orpc/router/journal/entry/deleteEntry";
import { listJournalDays } from "@/orpc/router/journal/list";


// 0 implement track food functionality
//! 1st
//? 2nd
//* 3rd
//* 4th
// ^ currently here
// 5th
//// 6th

export const router = {
  // dashboard: { // 5th
  //// decide on which "widget" or generally which data to show on start/dashboard screen
  // },
  onboard: createInitialProfile,
  profile: {
    get: getProfile, //* 4th <--- get current profile data
    update: updateProfile //* 4th <--- update profile to get updated nutritionResult
  },
  food: {
    list: listFood,
    get: foodById,
    create: createFood,
    // update: base, // 5th <--- mutate food data
    // delete: base, // 5th <--- mutate food data
  },
  // meal: { //// 6th <--- meal feature
  //   list: base,
  //   get: mealById,
  //   create: base,
  //   update: base,
  //   delete: base,
  // },
  journal: {
    list: listJournalDays,
    track: trackFood,
    day: {
      getEntries: journalDayEntriesByDate,
      getMacros: journalDayMacrosByDate,
    },
    entry: {
      //     retrack: base, // 5th <--- mutate journal entries
      //     move: base, // 5th <--- mutate journal entries
      //     update: base, // 5th <--- mutate journal entries
      delete: deleteEntry,
    }
  },
}
