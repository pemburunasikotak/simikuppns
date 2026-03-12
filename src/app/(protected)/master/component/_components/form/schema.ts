import zod from "@/libs/zod";

const BaseSchema = zod.object({
  code: zod
    .string({ error: "Kode harus diisi" })
    .min(1, { message: "Kode harus diisi" }),
  name: zod
    .string({ error: "Nama harus diisi" })
    .min(1, { message: "Nama harus diisi" }),
  description: zod
    .string({ error: "Deskripsi harus diisi" })
    .min(1, { message: "Deskripsi harus diisi" }),
});

export const IKUSchema = BaseSchema;
export type TIKUFormData = zod.infer<typeof IKUSchema>;
