import { z } from "zod";

export const defaultProgramSchema = z.object({
  ikuId: z.object({
    value: z.string(),
    label: z.string(),
  }, { required_error: "IKU wajib dipilih" }),
  ikuCode: z.string().min(1, "Kode IKU wajib diisi"),
  title: z.string().min(1, "Judul Program wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

export type TDefaultProgramFormData = z.infer<typeof defaultProgramSchema>;
