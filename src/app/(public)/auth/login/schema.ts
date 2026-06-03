import zod from "@/libs/zod";

const BaseSchema = zod.object({
  nip: zod.string().min(1, "NIP wajib diisi"),
  password: zod.string().min(3, "Password minimal 3 karakter"),
});

export const loginSchema = BaseSchema;
export type TLoginFormData = zod.infer<typeof loginSchema>;
