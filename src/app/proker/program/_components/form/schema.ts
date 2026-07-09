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
});

export type TProgramFormData = z.infer<typeof ProgramSchema>;
