import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";
import useGetListIKU from "@/app/(protected)/master/iku/_hooks/use-get-list-iku";
import useSyncIkus from "../_hooks/use-sync-ikus";

type ModalAssignIkuProps = {
  open: boolean;
  onClose: () => void;
  bidangId: string;
  currentAssignIkuIds: string[];
};

const schema = z.object({
  ikuIds: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

const ModalAssignIku = ({ open, onClose, bidangId, currentAssignIkuIds }: ModalAssignIkuProps) => {
  const syncIkus = useSyncIkus(bidangId);
  const ikusQuery = useGetListIKU({ limit: 1000, page: 1 });
  const ikus = ikusQuery.data?.result?.data || [];

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ikuIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        ikuIds: currentAssignIkuIds,
      });
    }
  }, [open, currentAssignIkuIds, reset]);

  const handleClose = () => {
    reset({ ikuIds: [] });
    onClose();
  };

  const onSubmit = (data: FormData) => {
    syncIkus.mutate(data.ikuIds, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const ikuOptions = ikus.map((iku) => ({
    value: iku.id,
    label: `${iku.code} - ${iku.name}`,
  }));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Kelola IKU di Bidang</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormDropdownCheckboxField
              control={control}
              name="ikuIds"
              label="Pilih IKU"
              placeholder="Pilih satu atau beberapa IKU"
              options={ikuOptions}
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
            disabled={syncIkus.isPending || ikusQuery.isLoading}
            sx={{ fontWeight: 700 }}
          >
            {syncIkus.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalAssignIku;
