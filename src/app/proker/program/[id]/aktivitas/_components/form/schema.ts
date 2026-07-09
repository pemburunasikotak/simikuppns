import { z } from "zod";

export const ActivitySchema = z.object({
  title: z.string().min(1, "Judul aktivitas harus diisi"),
  description: z.string().optional(),
  weight: z.coerce.number({ invalid_type_error: "Bobot harus diisi" }).min(0, "Bobot tidak valid"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type TActivityFormData = z.infer<typeof ActivitySchema>;
