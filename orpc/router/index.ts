//* onboard
import { createInitialProfile } from "./onboard";

//* profile
import { getProfile } from "./profile/get";
import { updateProfile } from "./profile/update";

//* food
import { createFood } from "./food/create";
import { foodById } from "./food/get";
import { foodsByBarcode } from "./food/getByBarcode";
import { listFood } from "./food/list";

//* journal
import { listJournalDays } from "./journal/list";
import { trackFood } from "./journal/track";
// day
import { journalEntriesByDate } from "./journal/day/getEntries";
import { journalDayMacrosByDate } from "./journal/day/getMacros";
// entry
import { deleteEntry } from "./journal/entry/deleteEntry";
import { moveEntry } from "./journal/entry/moveEntry";
import { retrackEntry } from "./journal/entry/retrackEntry";
import { updateEntryFood } from "./journal/entry/updateEntry";
// history
import { listPastWeekJournalEntryFoods } from "./journal/history/listPastWeek";

//* dashboard
import { getKcalRange } from "./dashboard/kcalRange";


// 0 implement track food functionality
//! 1st
//? 2nd
//* 3rd
//* 4th
// 5th
// ^ currently here
//// 6th

export const router = {
  dashboard: { // 5th
    // decide on which "widget" or generally which data to show on start/dashboard screen
    kcalRange: getKcalRange
  },
  onboard: createInitialProfile,
  profile: {
    get: getProfile,
    update: updateProfile
  },
  food: {
    list: listFood,
    get: foodById,
    getByBarcode: foodsByBarcode,
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
      getEntries: journalEntriesByDate,
      getMacros: journalDayMacrosByDate,
    },
    entry: {
      retrack: retrackEntry,
      move: moveEntry,
      delete: deleteEntry,
      food: {
        update: updateEntryFood,
      },
      // meal: {
      //   update: updateEntryMeal,
      // }
    },
    history: {
      listPastWeek: listPastWeekJournalEntryFoods
    }
  },
}
