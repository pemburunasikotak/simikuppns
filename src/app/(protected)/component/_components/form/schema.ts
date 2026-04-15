import zod from "@/libs/zod";

const BaseSchema = zod.object({
  idComponent: zod
    .string({ error: "Komponen harus diisi" })
    .min(1, { message: "Komponen harus diisi" }),
  // idPeriod: zod
  //   .string({ error: "Periode harus diisi" })
  //   .min(1, { message: "Periode harus diisi" }),
  year: zod
    .number({ error: "Tahun harus diisi" }),
  month: zod
    .number({ error: "Bulan harus diisi" }),
  value: zod
    .number({ error: "Nilai harus diisi" }),
});

export const ComponentRealizationSchema = BaseSchema;
export type TComponentRealizationFormData = zod.infer<typeof ComponentRealizationSchema>;
