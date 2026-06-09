import { FC, ReactElement, useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import { useFilter } from "@/app/_hooks/use-filter";
import { Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Divider } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSnackbar } from "notistack";

import { TAuthUserItem, TGetUsersParams } from "@/api/user/type";
import useGetListUser from "./_hooks/use-get-list-user";
import useRegisterUser from "./_hooks/use-register-user";
import useChangePassword from "./_hooks/use-change-password";
import useUpdateUser from "./_hooks/use-update-user";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import FormTextField from "@/app/_components/ui/form-text-field";
import FormDropdownField from "@/app/_components/ui/form-dropdown-field";

// ─── Validation Schemas ──────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  nip: z.string().min(1, "NIP wajib diisi"),
  type: z.string().min(1, "Tipe wajib diisi"),
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type TRegisterForm = z.infer<typeof registerSchema>;

const editSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  nip: z.string().min(1, "NIP wajib diisi"),
  type: z.string().min(1, "Tipe wajib diisi"),
  email: z.string().email("Format email tidak valid").min(1, "Email wajib diisi"),
});

type TEditForm = z.infer<typeof editSchema>;

const changePasswordSchema = z.object({
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type TChangePasswordForm = z.infer<typeof changePasswordSchema>;

import { AxiosError } from "axios";

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return String(err.response.data.message);
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Component: FC = (): ReactElement => {
  const { enqueueSnackbar } = useSnackbar();
  const { filters, setFilter } = useFilter<TGetUsersParams>();

  // Dialog states
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TAuthUserItem | null>(null);

  // Queries & Mutations
  const query = useGetListUser({
    limit: filters.per_page ? Number(filters.per_page) : 10,
    page: filters.page ? Number(filters.page) : 1,
    search: filters.search,
  });

  const registerMutation = useRegisterUser();
  const updateMutation = useUpdateUser();
  const changePasswordMutation = useChangePassword();

  // Forms
  const registerForm = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      nip: "",
      type: "EMPLOYEE",
      email: "",
      password: "",
    },
  });

  const editForm = useForm<TEditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: "",
      nip: "",
      type: "EMPLOYEE",
      email: "",
    },
  });

  const changePasswordForm = useForm<TChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Sync edit form default values on open
  useEffect(() => {
    if (selectedUser && isEditOpen) {
      editForm.reset({
        name: selectedUser.name,
        nip: selectedUser.nip,
        type: selectedUser.type,
        email: selectedUser.email,
      });
    }
  }, [selectedUser, isEditOpen, editForm]);

  // Action Handlers
  const handleRegisterSubmit = async (data: TRegisterForm) => {
    try {
      await registerMutation.mutateAsync(data);
      enqueueSnackbar("User berhasil ditambahkan", { variant: "success" });
      setIsRegisterOpen(false);
      registerForm.reset();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal menambahkan user"), { variant: "error" });
    }
  };

  const handleEditSubmit = async (data: TEditForm) => {
    if (!selectedUser) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedUser.id,
        data,
      });
      enqueueSnackbar("Data user berhasil diperbarui", { variant: "success" });
      setIsEditOpen(false);
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal memperbarui user"), { variant: "error" });
    }
  };

  const handleChangePasswordSubmit = async (data: TChangePasswordForm) => {
    if (!selectedUser) return;
    try {
      await changePasswordMutation.mutateAsync({
        id: selectedUser.id,
        userId: selectedUser.id,
        email: selectedUser.email,
        nip: selectedUser.nip,
        password: data.password,
      });
      enqueueSnackbar("Password user berhasil diperbarui", { variant: "success" });
      setIsChangePasswordOpen(false);
      changePasswordForm.reset();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Gagal memperbarui password"), { variant: "error" });
    }
  };

  const columns: GridColDef<TAuthUserItem>[] = [
    { field: "nip", headerName: "NIP", width: 150 },
    { field: "name", headerName: "Nama User", minWidth: 200, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 200, flex: 1 },
    { field: "type", headerName: "Tipe", width: 130 },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.row.isActive ? "Aktif" : "Nonaktif"}
          color={params.row.isActive ? "success" : "default"}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Tanggal Dibuat",
      width: 180,
      renderCell: (params) => dayjs(params.row.createdAt).format("DD MMM YYYY HH:mm"),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            {
              key: "edit",
              type: "edit",
              onClick: () => {
                setSelectedUser(params.row);
                setIsEditOpen(true);
              },
            },
            {
              key: "change-password",
              type: "lock",
              onClick: () => {
                setSelectedUser(params.row);
                setIsChangePasswordOpen(true);
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "User Management",
          path: null,
        },
        {
          label: "User",
          path: null,
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari user..."}
          defaultValue={{
            search_value: filters.search || filters.search_value,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => setIsRegisterOpen(true)}
            >
              Tambah User
            </Button>,
          ]}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={query.data?.data || []}
        columns={columns}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: filters.per_page ? Number(filters.per_page) : 10,
          total: query.data?.pagination?.total || 0,
          page: query.data?.pagination?.page || 1,
        })}
        handleChange={setFilter}
      />

      {/* Dialog Tambah User */}
      <Dialog
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Tambah User Baru</DialogTitle>
        <Divider />
        <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <FormTextField
                label="Nama Lengkap"
                control={registerForm.control}
                name="name"
                required
                placeholder="Masukkan nama lengkap"
              />
              <FormTextField
                label="NIP"
                control={registerForm.control}
                name="nip"
                required
                placeholder="Masukkan NIP"
              />
              <FormDropdownField
                label="Tipe User"
                control={registerForm.control}
                name="type"
                required
                options={[
                  { value: "EMPLOYEE", label: "EMPLOYEE" },
                  { value: "STAFF", label: "STAFF" },
                ]}
              />
              <FormTextField
                label="Email"
                control={registerForm.control}
                name="email"
                required
                placeholder="Masukkan email"
              />
              <FormTextField
                label="Password"
                type="password"
                control={registerForm.control}
                name="password"
                required
                placeholder="Masukkan password"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setIsRegisterOpen(false)} sx={{ fontWeight: 700, color: "text.secondary" }}>
              Batal
            </Button>
            <Button
              loading={registerMutation.isPending}
              type="submit"
              variant="contained"
              sx={{ fontWeight: 700, px: 3 }}
            >
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Edit User */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Edit Detail User</DialogTitle>
        <Divider />
        <form onSubmit={editForm.handleSubmit(handleEditSubmit)}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <FormTextField
                label="Nama Lengkap"
                control={editForm.control}
                name="name"
                required
                placeholder="Masukkan nama lengkap"
              />
              <FormTextField
                label="NIP"
                control={editForm.control}
                name="nip"
                required
                placeholder="Masukkan NIP"
              />
              <FormDropdownField
                label="Tipe User"
                control={editForm.control}
                name="type"
                required
                options={[
                  { value: "EMPLOYEE", label: "EMPLOYEE" },
                  { value: "STAFF", label: "STAFF" },
                ]}
              />
              <FormTextField
                label="Email"
                control={editForm.control}
                name="email"
                required
                placeholder="Masukkan email"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setIsEditOpen(false)} sx={{ fontWeight: 700, color: "text.secondary" }}>
              Batal
            </Button>
            <Button
              loading={updateMutation.isPending}
              type="submit"
              variant="contained"
              sx={{ fontWeight: 700, px: 3 }}
            >
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog Edit Password */}
      <Dialog
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Ubah Password User</DialogTitle>
        <Divider />
        <form onSubmit={changePasswordForm.handleSubmit(handleChangePasswordSubmit)}>
          <DialogContent>
            {selectedUser && (
              <Stack spacing={1} sx={{ mb: 3, p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                <Typography variant="caption" color="text.secondary">Target User:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>{selectedUser.name}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedUser.email} • NIP {selectedUser.nip}</Typography>
              </Stack>
            )}
            <Stack spacing={2.5}>
              <FormTextField
                label="Password Baru"
                type="password"
                control={changePasswordForm.control}
                name="password"
                required
                placeholder="Masukkan password baru"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setIsChangePasswordOpen(false)} sx={{ fontWeight: 700, color: "text.secondary" }}>
              Batal
            </Button>
            <Button
              loading={changePasswordMutation.isPending}
              type="submit"
              variant="contained"
              sx={{ fontWeight: 700, px: 3 }}
            >
              Ubah Password
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Page>
  );
};

export default Component;
