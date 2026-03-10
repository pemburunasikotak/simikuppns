import zod from "@/libs/zod";

const BaseSchema = zod.object({
  email: zod.string().email("Email tidak valid"),
  password: zod.string().min(3, "Password minimal 3 karakter"),
});

export const loginSchema = BaseSchema;
export type TLoginFormData = zod.infer<typeof loginSchema>;
