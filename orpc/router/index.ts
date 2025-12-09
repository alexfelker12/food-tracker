//* profile
import { createInitialProfile } from "@/orpc/profile/onboard";

//* food
import { createFood } from "@/orpc/router/food/create";
import { foodById } from "@/orpc/router/food/get";
import { listFood } from "@/orpc/router/food/list";

//* journal
import { trackFood } from "@/orpc/router/journal/track";
import { journalDayEntriesByDate } from "./journal/day/getEntries";
import { listJournalDays } from "./journal/list";
import { journalDayMacrosByDate } from "./journal/day/getMacros";


// 0 implement track food functionality
//! 1st
//? 2nd
//* 3rd
// ^ currently here
//* 4th
// 5th
//// 6th

export const router = {
  onboard: {
    createProfile: createInitialProfile
  },
  // dashboard: { // 5th
  //// decide on which "widget" or generally which data to show on start/dashboard screen
  // },
  // profile: {
  //   get: base, //* 4th <--- get current profile data
  //   update: base //* 4th <--- update profile to get updated nutritionResult
  // },
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
    //   entry: {
    //     update: base, // 5th <--- mutate journal entries
    //     delete: base, //* 3rd <--- mutate journal entries
    //     retrack: base, // 5th <--- mutate journal entries
    //     move: base, // 5th <--- mutate journal entries
    //   }
  },
}
