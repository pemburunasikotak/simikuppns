import { FC, ReactElement, useState } from "react";
import { Button } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";

import { useGetProgresss } from "./_hooks/use-get-list-progress";
import { TProkerProgress } from "@/api/proker/progress/type";

import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";

const ProgressPage: FC = (): ReactElement => {
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const { data, isLoading } = useGetProgresss({ 
    page: filter.page ? Number(filter.page) : 1, 
    limit: filter.per_page ? Number(filter.per_page) : 10 
  });
  
  const items = data?.data?.items || [];

  const columns: GridColDef<TProkerProgress>[] = [
    { field: "aktivitasId", headerName: "ID Aktivitas", minWidth: 150, flex: 1 },
    { 
      field: "percentage", 
      headerName: "Persentase", 
      minWidth: 120, 
      flex: 0.5,
      renderCell: (params) => params.value != null ? `${params.value}%` : '-'
    },
    { field: "notes", headerName: "Catatan", minWidth: 250, flex: 1.5 },
    { 
      field: "date", 
      headerName: "Tanggal", 
      minWidth: 150, 
      flex: 1,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString('id-ID') : '-'
    },
    {
      field: "actions",
      headerName: "Aksi",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => {
              // TODO: implement handleOpenEdit
              console.log("Edit", params.row);
            },
          },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              // TODO: implement handleOpenDelete
              console.log("Delete", params.row);
            },
          },
        ];
        return <ActionButtonTable items={actionItems} />;
      },
    },
  ];

  return (
    <Page
      breadcrumbs={[
        {
          label: "Manajemen Progress",
          path: "/proker/progress",
        },
        {
          label: "Progress",
          path: "/proker/progress",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Progress..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => {
                // TODO: implement handleOpenAdd
                console.log("Add");
              }}
            >
              Tambah Progress
            </Button>,
          ]}
        />
      }
    >
      <DataTable
        loading={isLoading}
        rows={items}
        columns={columns}
        checkboxSelection={false}
        paginationInfo={createPaginationInfo({
          per_page: filter.per_page ? Number(filter.per_page) : 10,
          total: data?.data?.pagination?.totalItems || 0,
          page: data?.data?.pagination?.page || 1,
        })}
        handleChange={setFilter}
      />
    </Page>
  );
};

export default ProgressPage;
