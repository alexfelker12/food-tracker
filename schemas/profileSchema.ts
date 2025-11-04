import * as z from "zod";


// TODO: convert example schema to actual profile schema
export const profileSchema = z.object({
  step1: z.object({
    firstName: z.string().min(1, "Pflichtfeld"),
    lastName: z.string().min(1, "Pflichtfeld"),
  }),
  step2: z.object({
    email: z.email("Ungültige E-Mail"),
    age: z.number().min(18, "Nur 18+"),
  }),
  step3: z.object({
    agreeTerms: z.boolean().refine(val => val, "Muss akzeptiert werden"),
  }),
});
export type ProfileSchema = z.infer<typeof profileSchema>;
