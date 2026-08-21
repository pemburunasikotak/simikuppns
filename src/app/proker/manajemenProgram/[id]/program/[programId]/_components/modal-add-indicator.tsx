import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";
import { useGetProkerMasterUnits } from "@/app/proker/master-unit/_hooks/use-get-master-units";
import { TDefaultProgramIndicator } from "@/api/proker/manajemenProgram/type";
import useCreateDefaultProgramIndicator from "../_hooks/use-create-default-program-indicator";
import useUpdateProgramIndicator from "../_hooks/use-update-program-indicator";

type ModalAddIndicatorProps = {
  open: boolean;
  onClose: () => void;
  programId: string;
  mode: "add" | "edit";
  selectedIndicator: TDefaultProgramIndicator | null;
};

const schema = z.object({
  name: z.string().min(1, "Nama Indikator wajib diisi"),
  category: z.string().optional(),
  masterUnitTypeId: z.string().min(1, "Satuan wajib dipilih"),
  order: z.coerce.number().min(1, "Urutan minimal 1"),
});

type FormData = z.infer<typeof schema>;

const ModalAddIndicator = ({ open, onClose, programId, mode, selectedIndicator }: ModalAddIndicatorProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const createMutation = useCreateDefaultProgramIndicator();
  const updateMutation = useUpdateProgramIndicator();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const { data: unitTypesData } = useGetProkerMasterUnits({ limit: 50 });
  const unitOptions = unitTypesData?.items?.map(unit => ({ value: unit.id, label: unit.name })) || [];

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "",
      masterUnitTypeId: "",
      order: 1,
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && selectedIndicator) {
        let masterUnitTypeId = "";
        if (typeof selectedIndicator.masterUnitType === 'object' && selectedIndicator.masterUnitType !== null) {
          masterUnitTypeId = selectedIndicator.masterUnitType.id;
        } else if (typeof selectedIndicator.masterUnitType === 'string') {
          masterUnitTypeId = selectedIndicator.masterUnitType;
        } else if (typeof selectedIndicator.unit === 'object' && selectedIndicator.unit !== null) {
          masterUnitTypeId = selectedIndicator.unit.id;
        } else if (typeof selectedIndicator.unit === 'string') {
          masterUnitTypeId = selectedIndicator.unit;
        }

        reset({
          name: selectedIndicator.name,
          category: selectedIndicator.category || "",
          masterUnitTypeId,
          order: selectedIndicator.order,
        });
      } else {
        reset({
          name: "",
          category: "",
          masterUnitTypeId: "",
          order: 1,
        });
      }
    }
  }, [open, mode, selectedIndicator, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: FormData) => {
    const basePayload: import("@/api/proker/manajemenProgram/type").TCreateDefaultProgramIndicatorPayload = {
      name: data.name,
      category: data.category,
      masterUnitTypeId: data.masterUnitTypeId,
      unit: data.masterUnitTypeId,
      order: data.order,
    };

    if (mode === "add") {
      createMutation.mutate(
        { id: programId, payload: basePayload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil menambahkan indikator", { variant: "success" });
            handleClose();
          },
          onError: () => {
            enqueueSnackbar("Gagal menambahkan indikator", { variant: "error" });
          },
        }
      );
    } else {
      if (!selectedIndicator) return;
      updateMutation.mutate(
        { programId, id: selectedIndicator.id, payload: basePayload },
        {
          onSuccess: () => {
            enqueueSnackbar("Berhasil mengubah indikator", { variant: "success" });
            handleClose();
          },
          onError: () => {
            enqueueSnackbar("Gagal mengubah indikator", { variant: "error" });
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>
        {mode === "add" ? "Tambah Indikator" : "Ubah Indikator"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <FormTextField
              control={control}
              name="name"
              label="Nama Indikator"
              placeholder="Contoh: Jumlah Publikasi"
              required
            />
            <FormDropdownField
              label="Kategori"
              control={control}
              name="category"
              options={[
                { value: "TUSI", label: "TUSI" },
                { value: "RUTIN", label: "RUTIN" },
                { value: "PENGEMBANGAN", label: "PENGEMBANGAN" },
              ]}
            />
            <FormDropdownField
              control={control}
              name="masterUnitTypeId"
              label="Satuan"
              options={unitOptions}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            sx={{ fontWeight: 700 }}
          >
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalAddIndicator;

