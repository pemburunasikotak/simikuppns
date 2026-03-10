import zod from "@/libs/zod";

const BaseSchema = zod.object({
  customerName: zod
    .string({ error: "Nama Lengkap harus diisi" })
    .trim()
    .optional(),
  // .min(1, { error: "Nama Lengkap harus diisi" }),
  customerEmail: zod.email({
    error: (issue) => {
      if (issue.input) {
        return "Format Email salah";
      }
      return "Email harus diisi";
    },

  }),
  customerWhatsapp: zod
    .string({ error: "No. Whatsapp harus diisi" })
    .optional(),
  // .trim()
  // .min(1, { message: "No. Whatsapp harus diisi" }),

  bookingDate: zod
    .string({ error: "Tanggal booking harus diisi" })
    // .min(1, { message: "Tanggal booking harus diisi" }),
    .optional(),

  totalPrice: zod
    .string({ error: "Total harga harus diisi" })
    // .min(1, { message: "Total harga harus diisi" }),
    .optional(),

  status:
    zod.string({ error: "Status harus diisi" })
      .optional(),
  // .min(1, { message: "Status harus diisi" }),

  customerAddress: zod
    .string({ error: "Provinsi harus diisi" })
    .optional(),
  // .min(1, { message: "Provinsi harus diisi" }),

  city: zod
    .string({ error: "Kota/Kabupaten harus diisi" })
    .min(1, { message: "Kota/Kabupaten harus diisi" }),

  district: zod
    .string({ error: "Kecamatan harus diisi" })
    .min(1, { message: "Kecamatan harus diisi" }),

  postal_code: zod
    .string({ error: "Kode pos harus diisi" })
    .min(1, { message: "Kode pos harus diisi" }),

  address: zod
    .string({ error: "Alamat lengkap harus diisi" })
    .min(1, { message: "Alamat lengkap harus diisi" }),
});

export const TransactionSchema = BaseSchema;
export type TTransactionFormData = zod.infer<typeof TransactionSchema>;
