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
  periodType: zod
    .string({ error: "Type Priode harus diisi" })
    .min(1, { message: "Type Priode harus diisi" }),
  // sourceType: zod
  //   .string({ error: "Source Type harus diisi" })
  //   .min(1, { message: "Source Type harus diisi" }),
});

export const ComponentSchema = BaseSchema;
export type TComponentFormData = zod.infer<typeof ComponentSchema>;

