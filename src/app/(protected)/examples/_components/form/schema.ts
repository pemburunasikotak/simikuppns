import zod from "@/libs/zod";

const BaseSchema = zod.object({
  name: zod
    .string({ error: "Nama Fasilitas harus diisi" })
    .min(1, { error: "Nama Fasilitas harus diisi" }),
  type: zod.object(
    {
      value: zod.string(),
      label: zod.string(),
    },
    { error: "Type Fasilitas harus diisi" },
  ),
  description: zod.string().optional(),
});

export const FacilitiesSchema = BaseSchema;
export type TFacilitiesFormData = zod.infer<typeof FacilitiesSchema>;
