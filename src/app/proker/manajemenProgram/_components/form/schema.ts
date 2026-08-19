import { z } from "zod";

export const defaultProgramSchema = z.object({
  ikuId: z.object({
    value: z.string(),
    label: z.string(),
  }, { required_error: "IKU wajib dipilih" }),
  ikuCode: z.string().min(1, "Kode IKU wajib diisi"),
  title: z.string().min(1, "Judul Program wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  indicators: z.array(z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    masterUnitTypeId: z.string().min(1, "Satuan wajib dipilih"),
    category: z.string().optional(),
    order: z.coerce.number().min(1, "Minimal 1"),
  })).optional(),
});

export type TDefaultProgramFormData = z.infer<typeof defaultProgramSchema>;
