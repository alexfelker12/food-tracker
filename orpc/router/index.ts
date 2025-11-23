import { createFood } from "@/orpc/router/food/create";
import { createInitialProfile } from "@/orpc/router/onboard";
import { listTests } from "@/orpc/router/test";
import { base } from "../middleware/base";
import { listFood } from "./food/list";

//! 1st
//? 2nd
//* 3rd
// 4th

export const router = {
  test: {
    list: listTests
  },
  onboard: {
    createProfile: createInitialProfile
  },
  // profile: {
  //   get: base, //* 3rd
  //   update: base //* 3rd
  // },
  food: {
    list: listFood,
    create: createFood,
    // update: base, //? 2nd
    // delete: base, //? 2nd
    // track: base //! 1st
  },
  // meal: {
  //   list: base,
  //   create: base,
  //   update: base,
  //   delete: base,
  //   track: base
  // },
  // journal: { // 4th
  //   list: base,
  //   day: {
  //     today: base,
  //     get: base,
  //     update: base,
  //   }
  // },
}
