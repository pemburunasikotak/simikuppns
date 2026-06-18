import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";
import useGetListComponent from "@/app/(protected)/master/component/_hooks/use-get-list-iku";
import useSyncComponents from "../_hooks/use-sync-components";
import { TComponentItem } from "@/api/master/component/type";


type ModalAssignComponentProps = {
  open: boolean;
  onClose: () => void;
  bidangId: string;
  currentAssignComponentIds: string[];
};

const schema = z.object({
  componentIds: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

const ModalAssignComponent = ({ open, onClose, bidangId, currentAssignComponentIds }: ModalAssignComponentProps) => {
  const syncComponents = useSyncComponents(bidangId);
  const componentsQuery = useGetListComponent({ limit: 1000, page: 1 });
  const components = componentsQuery.data?.result?.data || [];

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      componentIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        componentIds: currentAssignComponentIds,
      });
    }
  }, [open, currentAssignComponentIds, reset]);

  const handleClose = () => {
    reset({ componentIds: [] });
    onClose();
  };

  const onSubmit = (data: FormData) => {
    syncComponents.mutate(data.componentIds, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const componentOptions = components.map((comp: TComponentItem) => ({
    value: comp.id,
    label: `${comp.code} - ${comp.name}`,
  }));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Kelola IKP di Bidang</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormDropdownCheckboxField
              control={control}
              name="componentIds"
              label="Pilih IKP"
              placeholder="Pilih satu atau beberapa IKP"
              options={componentOptions}
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
            disabled={syncComponents.isPending || componentsQuery.isLoading}
            sx={{ fontWeight: 700 }}
          >
            {syncComponents.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalAssignComponent;
