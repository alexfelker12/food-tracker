//* profile
import { createInitialProfile } from "@/orpc/profile/onboard";

//* food
import { createFood } from "@/orpc/router/food/create";
import { foodById } from "@/orpc/router/food/get";
import { listFood } from "@/orpc/router/food/list";

//* journal
import { trackFood } from "@/orpc/router/journal/track";
import { journalDayByDate } from "./journal/day/get";
import { listJournalDays } from "./journal/list";


// 0 implement track food functionality
//! 1st
//? 2nd
// ^ currently here
//* 3rd
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
  //   get: base, //* 3rd <--- get current profile data
  //   update: base //* 3rd <--- update profile to get updated nutritionResult
  // },
  food: {
    list: listFood,
    get: foodById,
    create: createFood,
    // update: base, //* 4th <--- mutate food data
    // delete: base, //* 4th <--- mutate food data
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
      get: journalDayByDate, //? 2nd <--- for now just show specific day to implement journal day view
    },
    //   entry: {
    //     update: base, //* 4th <--- mutate journal entries
    //     delete: base, //* 4th <--- mutate journal entries
    //   }
  },
}
