import { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import FormDropdownCheckboxField from "@/app/_components/ui/form-dropdown-checkbox-field";
import useGetListUser from "@/app/(protected)/user/_hooks/use-get-list-user";
import useSyncUsers from "../_hooks/use-sync-users";

type ModalAssignUserProps = {
  open: boolean;
  onClose: () => void;
  bidangId: string;
  currentAssignUserIds: string[];
};

const schema = z.object({
  userIds: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

const ModalAssignUser = ({ open, onClose, bidangId, currentAssignUserIds }: ModalAssignUserProps) => {
  const syncUsers = useSyncUsers(bidangId);
  const usersQuery = useGetListUser({ limit: 1000, page: 1 });
  const users = usersQuery.data?.data || [];

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userIds: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        userIds: currentAssignUserIds,
      });
    }
  }, [open, currentAssignUserIds, reset]);

  const handleClose = () => {
    reset({ userIds: [] });
    onClose();
  };

  const onSubmit = (data: FormData) => {
    syncUsers.mutate(data.userIds, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const userOptions = users.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.nip}) - ${user.type}`,
  }));

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Kelola User di Bidang</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormDropdownCheckboxField
              control={control}
              name="userIds"
              label="Pilih User"
              placeholder="Pilih satu atau beberapa user"
              options={userOptions}
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
            disabled={syncUsers.isPending || usersQuery.isLoading}
            sx={{ fontWeight: 700 }}
          >
            {syncUsers.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ModalAssignUser;
