import { createInitialProfile } from "./onboard";
import { listTests } from "./test";

export const router = {
  test: {
    list: listTests
  },
  onboard: {
    createProfile: createInitialProfile
  }
}
