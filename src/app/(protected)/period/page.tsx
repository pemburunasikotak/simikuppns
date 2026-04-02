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
import { TGetPeriodParams, TPeriodItem } from "@/api/period/type";
import useGetListPeriod from "./_hooks/use-get-list-period";
import useDeletePeriod from "./_hooks/use-delete-period";
import { formatDateTimeWIB } from "@/utils/date";

const PeriodPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilter<TGetPeriodParams>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const query = useGetListPeriod({
    order: filters.order || "DESC",
    limit: 10,
    page: filters.page || 1,
    search: filters.search,
  });

  const modal = useModal();
  const deletePeriod = useDeletePeriod();

  const columns: GridColDef<TPeriodItem>[] = [
    { field: "idPeriod", headerName: "Id", width: 150, },
    { field: "periodName", headerName: "Nama Periode", minWidth: 200, flex: 1 },
    { field: "year", headerName: "Tahun", width: 100, type: "string" },
    { field: "periodType", headerName: "Tipe", width: 130 },
    { field: "periodValue", headerName: "Nilai", width: 100, type: "number" },
    { field: "level", headerName: "Level", width: 90, type: "string" },
    { field: "parentId", headerName: "Parent ID", minWidth: 160, flex: 0.5 },
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
                  generatePath(paths.period.edit, { id: params.row.idPeriod }),
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
                    deletePeriod.mutate({ id: params.row.idPeriod });
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
      //     label: "Periode",
      //     path: null,
      //   },
      // ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Periode..."}
          defaultValue={{
            search_value: filters.search,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => navigate(paths.period.create)}
            >
              Tambah Periode
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
        getRowId={(row) => row.idPeriod}
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

export default PeriodPage;
