import zod from "@/libs/zod";

const BaseSchema = zod.object({
  year: zod
    .number({ error: "Tahun harus diisi" })
    .int({ message: "Tahun harus berupa angka bulat" })
    .min(2000, { message: "Tahun minimal 2000" }),
  periodType: zod
    .string({ error: "Tipe periode harus diisi" })
    .min(1, { message: "Tipe periode harus diisi" }),
  periodValue: zod
    .number({ error: "Nilai periode harus diisi" })
    .min(0, { message: "Nilai periode tidak boleh negatif" }),
  periodName: zod
    .string({ error: "Nama periode harus diisi" })
    .min(1, { message: "Nama periode harus diisi" }),
  level: zod
    .number({ error: "Level harus diisi" })
    .int({ message: "Level harus berupa angka bulat" })
    .min(0, { message: "Level tidak boleh negatif" }),
  parentId: zod.string().optional().nullable(),
});

export const PeriodSchema = BaseSchema;
export type TPeriodFormData = zod.infer<typeof PeriodSchema>;


