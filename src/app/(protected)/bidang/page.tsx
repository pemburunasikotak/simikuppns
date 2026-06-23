import { FC, ReactElement, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { generatePath, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider } from "@mui/material";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import FormTextField from "@/app/_components/ui/form-text-field";
import { useFilter } from "@/app/_hooks/use-filter";
import useModal from "@/app/_components/ui/modal";
import { SessionUser } from "@/libs/localstorage";
import { paths } from "@/commons/constants/paths";

import { TBidangItem, TGetBidangParams } from "@/api/bidang/type";
import useGetListBidang from "./_hooks/use-get-list-bidang";
import useGetBidangByUser from "./_hooks/use-get-bidang-by-user";
import useCreateBidang from "./_hooks/use-create-bidang";
import useUpdateBidang from "./_hooks/use-update-bidang";
import useDeleteBidang from "./_hooks/use-delete-bidang";

// Validation Schema
const bidangSchema = z.object({
  code: z.string().min(1, "Kode wajib diisi"),
  name: z.string().min(1, "Nama bidang wajib diisi"),
  description: z.string().optional(),
});

type TBidangForm = z.infer<typeof bidangSchema>;

const BidangListPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const modal = useModal();
  const { filters, setFilter } = useFilter<TGetBidangParams>();

  // Dialog State
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedBidang, setSelectedBidang] = useState<TBidangItem | null>(null);

  // Authentication & Role Check
  const sessionUser = SessionUser.get();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = sessionUser?.user ?? {};
  // const userRoleKeys = useMemo(() => user?.roles?.map((r: any) => r.key) || [], [user?.roles]);
  const isAdmin = true;

  // Fetch Queries
  const listParams = {
    limit: filters.per_page ? Number(filters.per_page) : 10,
    page: filters.page ? Number(filters.page) : 1,
    search: (filters.search_value as string) || (filters.search as string),
  };

  const adminQuery = useGetListBidang(listParams);
  const userQuery = useGetBidangByUser(user?.id || "");
  const query = isAdmin ? adminQuery : userQuery;

  // Mutations
  const createMutation = useCreateBidang();
  const updateMutation = useUpdateBidang();
  const deleteMutation = useDeleteBidang();

  // Form setup
  const form = useForm<TBidangForm>({
    resolver: zodResolver(bidangSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const handleOpenCreate = () => {
    setDialogMode("create");
    setSelectedBidang(null);
    form.reset({ code: "", name: "", description: "" });
    setIsOpenDialog(true);
  };

  const handleOpenEdit = (bidang: TBidangItem) => {
    setDialogMode("edit");
    setSelectedBidang(bidang);
    form.reset({
      code: bidang.code,
      name: bidang.name,
      description: bidang.description || "",
    });
    setIsOpenDialog(true);
  };

  const handleSubmitForm = async (data: TBidangForm) => {
    try {
      if (dialogMode === "create") {
        await createMutation.mutateAsync({
          code: data.code,
          name: data.name,
          description: data.description || "",
        });
      } else if (dialogMode === "edit" && selectedBidang) {
        await updateMutation.mutateAsync({
          id: selectedBidang.id,
          data: {
            code: data.code,
            name: data.name,
            description: data.description || "",
          },
        });
      }
      setIsOpenDialog(false);
    } catch {
      // Errors are already handled inside the hooks via enqueueSnackbar
    }
  };

  const handleDelete = (bidang: TBidangItem) => {
    modal.confirm({
      icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
      description: `Apakah kamu yakin ingin menghapus bidang "${bidang.name}"?`,
      onOk: () => {
        deleteMutation.mutate(bidang.id);
      },
    });
  };

  // Define Columns
  const columns: GridColDef<TBidangItem>[] = [
    { field: "code", headerName: "Kode Bidang", width: 150 },
    { field: "name", headerName: "Nama Bidang", minWidth: 200, flex: 0.5 },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: any[] = [
          {
            key: "detail",
            type: "detail",
            onClick: () => navigate(generatePath(paths.bidang.detail, { id: params.row.id })),
          },
        ];

        if (isAdmin) {
          items.push(
            {
              key: "edit",
              type: "edit",
              onClick: () => handleOpenEdit(params.row),
            },
            {
              key: "delete",
              type: "delete",
              onClick: () => handleDelete(params.row),
            }
          );
        }

        return <ActionButtonTable items={items} />;
      },
    },
  ];

  const filteredRows = query.data?.result?.data || [];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Dashboard",
          path: paths.dashboard,
        },
        {
          label: "Bidang",
          path: null,
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari bidang..."}
          defaultValue={{
            search_value: filters.search || filters.search_value,
          }}
          actions={
            isAdmin
              ? [
                <Button
                  key="add"
                  variant="contained"
                  startIcon={<AddOutlined />}
                  onClick={handleOpenCreate}
                >
                  Tambah Bidang
                </Button>,
              ]
              : []
          }
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={filteredRows}
        columns={columns}
        checkboxSelection={isAdmin}
        paginationInfo={createPaginationInfo({
          per_page: filters.per_page ? Number(filters.per_page) : 10,
          total: query.data?.result?.total || 0,
          page: query.data?.result?.currentPage || 1,
        })}
        handleChange={setFilter}
      />

      {/* Dialog Add/Edit Bidang */}
      <Dialog
        open={isOpenDialog}
        onClose={() => setIsOpenDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {dialogMode === "create" ? "Tambah Bidang Baru" : "Edit Bidang"}
        </DialogTitle>
        <Divider />
        <form onSubmit={form.handleSubmit(handleSubmitForm)}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <FormTextField
                label="Kode Bidang"
                control={form.control}
                name="code"
                required
                placeholder="Masukkan kode bidang (cth: BID-001)"
              />
              <FormTextField
                label="Nama Bidang"
                control={form.control}
                name="name"
                required
                placeholder="Masukkan nama bidang"
              />
              <FormTextField
                label="Deskripsi"
                control={form.control}
                name="description"
                placeholder="Masukkan deskripsi bidang"
                multiline
                rows={3}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setIsOpenDialog(false)} sx={{ fontWeight: 700, color: "text.secondary" }}>
              Batal
            </Button>
            <Button
              loading={createMutation.isPending || updateMutation.isPending}
              type="submit"
              variant="contained"
              sx={{ fontWeight: 700, px: 3 }}
            >
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Page>
  );
};

export default BidangListPage;
