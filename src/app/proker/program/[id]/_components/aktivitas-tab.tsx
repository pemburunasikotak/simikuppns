import { FC, ReactElement, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { Button, Box } from "@mui/material";
import { Add, DeleteOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";

import { useGetAktivitass } from "../aktivitas/_hooks/use-get-list-aktivitas";
import { useDeleteProgramActivity } from "../aktivitas/_hooks/use-delete-program-activity";
import { TProkerAktivitas } from "@/api/proker/aktivitas/type";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";

const AktivitasTab: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const modal = useModal();

  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });

  const { data, isLoading } = useGetAktivitass(id as string, {
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
    search: filter.search || filter.search_value,
  });

  const deleteMutation = useDeleteProgramActivity();

  const items = data?.data || [];

  const handleAdd = () => {
    navigate(`/proker/program/${id}/aktivitas/tambah`);
  };

  const columns: GridColDef<TProkerAktivitas>[] = [
    { field: "title", headerName: "Judul", minWidth: 200, flex: 1 },
    {
      field: "weight",
      headerName: "Bobot",
      minWidth: 100,
      renderCell: (params) => `${params.row.weight}%`,
    },
    { field: "description", headerName: "Deskripsi", minWidth: 300 },
    { field: "status", headerName: "Status", minWidth: 120 },
    {
      field: "waktu",
      headerName: "Waktu",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => {
        const start = params.row.startDate ? new Date(params.row.startDate).toLocaleDateString("id-ID") : "-";
        const end = params.row.endDate ? new Date(params.row.endDate).toLocaleDateString("id-ID") : "-";
        return `${start} s/d ${end}`;
      }
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "detail",
            type: "detail" as const,
            onClick: () => {
              navigate(`/proker/program/${id}/aktivitas/${params.row.id}`);
            },
          },
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => {
              navigate(`/proker/program/${id}/aktivitas/${params.row.id}/edit`, { state: { activity: params.row } });
            },
          },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              modal.confirm({
                title: "Hapus Aktivitas",
                description: "Apakah anda yakin ingin menghapus aktivitas ini?",
                icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                onOk: () => {
                  deleteMutation.mutate(params.row.id, {
                    onSuccess: () => {
                      enqueueSnackbar("Berhasil menghapus aktivitas", { variant: "success" });
                    },
                    onError: () => {
                      enqueueSnackbar("Gagal menghapus aktivitas", { variant: "error" });
                    },
                  });
                },
              });
            },
          },
        ];
        return <ActionButtonTable items={actionItems} />;
      },
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Filter
          variants={["search"]}
          labelSearch={"Cari Aktivitas..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
            >
              Tambah Aktivitas
            </Button>,
          ]}
        />
      </Box>
      <DataTable
        loading={isLoading || deleteMutation.isPending}
        rows={items}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: filter.per_page ? Number(filter.per_page) : 10,
          total: items.length || 0,
          page: filter.page ? Number(filter.page) : 1,
        })}
        handleChange={setFilter}
      />
    </Box>
  );
};

export default AktivitasTab;
