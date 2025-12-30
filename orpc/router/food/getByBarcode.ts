import z from "zod";

import { authMiddleware } from "@/orpc/middleware/authorized";
import { base } from "@/orpc/middleware/base";

import { getFoodsByBarcode } from "@/server/actions/food";


type ProcedureReturnType = Awaited<ReturnType<typeof getFoodsByBarcode>>
export type BarcodeResultFoods = NonNullable<ProcedureReturnType>
export const foodsByBarcode = base
  .use(authMiddleware)
  .route({
    method: "GET",
    path: "/food/getByBarcode",
    summary: "Gets a list of trackable foods by a barcode (EAN, ...)",
    tags: ["Food"]
  })
  .input(z.object({
    barcode: z.string()
  }))
  .output(z.custom<ProcedureReturnType>())
  .handler(async ({ input: { barcode } }) => {
    const barcodeFoods = await getFoodsByBarcode({ barcode })
    return barcodeFoods
    // return [...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods, ...barcodeFoods,]
  })
