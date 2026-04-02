import { FC, ReactElement, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { generatePath, useNavigate } from "react-router";
import { Button } from "@mui/material";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useFilter } from "@/app/_hooks/use-filter";
import useModal from "@/app/_components/ui/modal";

import { paths } from "@/commons/constants/paths";
import { TGetComponentRealizationParams, TComponentRealizationItem } from "@/api/master/component-realization/type";
import useGetListComponentRealization from "./_hooks/use-get-list-component-realization";
import useDeleteComponentRealization from "./_hooks/use-delete-component-realization";
import { formatDateTimeWIB } from "@/utils/date";

const ComponentRealizationPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilter<TGetComponentRealizationParams>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const query = useGetListComponentRealization({
    order: filters.order || "DESC",
    limit: 10,
    page: filters.page || 1,
    search: filters.search,
  });

  const modal = useModal();
  const deleteRealization = useDeleteComponentRealization();

  const columns: GridColDef<TComponentRealizationItem>[] = [
    { field: "idRealization", headerName: "ID Realisasi", width: 120 },
    { field: "idComponent", headerName: "ID Komponen", minWidth: 200, flex: 0.5 },
    { field: "idPeriod", headerName: "ID Periode", minWidth: 200, flex: 0.5 },
    { field: "value", headerName: "Nilai", width: 150, type: "number" },
    {
      field: "createdAt",
      headerName: "Dibuat",
      minWidth: 180,
      flex: 1,
      valueFormatter: (value: string) => formatDateTimeWIB(value),
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            {
              key: "edit",
              type: "edit",
              onClick: () =>
                navigate(
                  generatePath(paths.component.edit, {
                    id: String(params.row.idRealization),
                  }),
                ),
            },
            {
              key: "delete",
              type: "delete",
              onClick: () => {
                modal.confirm({
                  icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                  description: "Apakah kamu akan menghapus data ini?",
                  onOk: () => {
                    deleteRealization.mutate({ id: String(params.row.idRealization) });
                  },
                });
              },
            },
          ]}
        />
      ),
    },
  ];

  return (
    <Page
      // breadcrumbs={[
      //   {
      //     label: "Realisasi Komponen",
      //     path: null,
      //   },
      // ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Realisasi Komponen..."}
          defaultValue={{
            search_value: filters.search,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => navigate(paths.component.create)}
            >
              Tambah Realisasi
            </Button>,
            ...(selectedIds.length
              ? [
                <Button key="delete" variant="outlined" startIcon={<DeleteOutlined />}>
                  Hapus
                </Button>,
              ]
              : []),
          ]}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={query.data?.result?.data || []}
        columns={columns}
        getRowId={(row) => row.idRealization}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: 10,
          total: query.data?.result?.total || 0,
          page: query.data?.result?.currentPage || 1,
        })}
        handleChange={setFilter}
        onRowSelectionModelChange={(ids) => {
          setSelectedIds(ids as string[]);
        }}
      />
    </Page>
  );
};

export default ComponentRealizationPage;
