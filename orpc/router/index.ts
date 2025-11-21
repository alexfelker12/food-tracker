import { createFood } from "@/orpc/router/food/create";
import { createInitialProfile } from "@/orpc/router/onboard";
import { listTests } from "@/orpc/router/test";

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
  //   get: base,
  //   update: base
  // },
  food: {
    // list: base, //? 2nd
    create: createFood, //! 1st
    // update: base, //* 3rd
    // delete: base, //* 3rd
    // track: base //? 2nd
  },
  // meal: {
  //   list: base,
  //   create: base,
  //   update: base,
  //   delete: base,
  //   track: base
  // },
}
