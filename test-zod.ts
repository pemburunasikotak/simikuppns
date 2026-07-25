import { z } from "zod";

const defaultProgramSchema = z.object({
  ikuId: z.object({
    value: z.string(),
    label: z.string(),
  }, { required_error: "IKU wajib dipilih" }),
  ikuCode: z.string().min(1, "Kode IKU wajib diisi"),
  title: z.string().min(1, "Judul Program wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  indicators: z.array(z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    unit: z.string().min(1, "Satuan wajib diisi"),
    order: z.coerce.number().min(1, "Minimal 1"),
  })).optional(),
});

const data = {
  ikuId: { value: "123", label: "IKU" },
  ikuCode: "IKU-01",
  title: "Test",
  description: "Test desc",
  indicators: [
    { name: "Ind", unit: "Unit", order: "1" }
  ]
};

const result = defaultProgramSchema.safeParse(data);
console.log(JSON.stringify(result, null, 2));
