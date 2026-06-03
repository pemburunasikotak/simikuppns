import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email Required" })
    .min(1, { message: "Email Required" })
    .email({ message: "Invalid email" }),
  nip: z
    .string({ required_error: "NIP Required" })
    .min(1, { message: "NIP Required" }),
  password: z
    .string({ required_error: "Password Required" })
    .min(1, { message: "Password Required" }),
});
