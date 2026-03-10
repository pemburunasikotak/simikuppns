import { useEffect } from "react";
import { Button, Grid, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormDateField from "@/app/_components/ui/form-date-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import FormTextField from "@/app/_components/ui/form-text-field";

import { TransactionSchema, TTransactionFormData } from "./schema";

interface Props {
  loading?: boolean;
  isEdit?: boolean;
  handleSubmit: (data: TTransactionFormData) => void;
  defaultValues?: Partial<TTransactionFormData>;
}

const TransactionForm = ({ loading, handleSubmit, defaultValues }: Props) => {
  const form = useForm<TTransactionFormData>({
    resolver: zodResolver(TransactionSchema),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            variant="filled"
            label="Nama Lengkap"
            control={form.control}
            name="customerName"
            //required
            placeholder="Ex: johndoe"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Email"
            control={form.control}
            name="customerEmail"
            //required
            placeholder="Ex. john@doe.com"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="No. Whatsapp"
            control={form.control}
            name="customerWhatsapp"
            //required
            placeholder="Ex. 09888733483"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDateField
            label="Tanggal Booking"
            control={form.control}
            name="bookingDate"
            required
            placeholder="Pilih tanggal"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            type="number"
            label="Total Harga"
            control={form.control}
            name="totalPrice"
            //required
            placeholder="Ex : Rp. 10.000.000"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            label="Status"
            control={form.control}
            name="status"
            //required
            placeholder="Pilih Status"
            options={[
              {
                label: "REJECTED",
                value: "REJECTED",
              },
              {
                label: "APPROVED",
                value: "APPROVED",
              },
              {
                label: "PENDING",
                value: "PENDING",
              },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            label="Provinsi"
            control={form.control}
            name="customerAddress"
            //required
            placeholder="Pilih Provinsi"
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            label="Kabupaten/Kota"
            control={form.control}
            name="city"
            //required
            placeholder="Pilih Kabupaten"
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormDropdownField
            label="Kecamatan"
            control={form.control}
            name="district"
            //required
            placeholder="Pilih Kecamatan"
            options={[]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormTextField
            label="Kode Pos"
            control={form.control}
            name="postal_code"
            //required
            placeholder="Ex: 90234"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <FormTextField
            label="Alamat"
            control={form.control}
            name="address"
            //required
            placeholder="Ex. Jalan Waras"
            multiline
            rows={4}
          />
        </Grid>
      </Grid>
      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{
          mt: "24px",
        }}
      >
        <Button loading={loading} type="submit" variant="contained">
          Simpan
        </Button>
      </Stack>
    </form>
  );
};

export default TransactionForm;
