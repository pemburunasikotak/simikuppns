import { z } from "zod";

export const ProgramSchema = z.object({
  title: z.string().min(1, "Judul program harus diisi"),
  code: z.string().min(1, "Kode program harus diisi"),
  description: z.string().optional(),
  objective: z.string().optional(),
  year: z.coerce.number({ invalid_type_error: "Tahun harus diisi" }).min(2000, "Tahun tidak valid"),
  unitId: z.string().min(1, "Unit ID harus diisi"),
  // categoryId: z.string().min(1, "Kategori ID harus diisi").optional(), // Making this optional since it's commented out in form
  categoryName: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.coerce.number().min(0, "Anggaran tidak valid").optional(),
  picId: z.string().optional(),
  ikuId: z.string().optional(),
  indicators: z.array(
    z.object({
      unitId: z.string().min(1, "Unit ID harus diisi"),
      name: z.string().min(1, "Nama indikator harus diisi"),
      masterUnitTypeId: z.string().min(1, "Master Unit Type ID harus diisi"),
      category: z.string().min(1, "Kategori harus diisi"),
      targetQ1: z.coerce.number().optional(),
      targetQ2: z.coerce.number().optional(),
      targetQ3: z.coerce.number().optional(),
      targetQ4: z.coerce.number().optional(),
      budget: z.coerce.number().optional(),
      picIds: z.array(z.string()).optional(),
      order: z.coerce.number().optional(),
      propsal: z.any().optional(),
      rab: z.any().optional(),
    })
  ).optional(),
});

export type TProgramFormData = z.infer<typeof ProgramSchema>;
