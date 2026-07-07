import { FC, ReactElement, useState } from "react";
import { Button } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";

import { useGetOutputs } from "./_hooks/use-get-list-output";
import { TProkerOutput } from "@/api/proker/output/type";

import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";

const OutputPage: FC = (): ReactElement => {
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const { data, isLoading } = useGetOutputs({ 
    page: filter.page ? Number(filter.page) : 1, 
    limit: filter.per_page ? Number(filter.per_page) : 10 
  });
  
  const items = data?.data?.items || [];

  const columns: GridColDef<TProkerOutput>[] = [
    { field: "name", headerName: "Nama Output", minWidth: 200, flex: 1 },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
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
          label: "Manajemen Output",
          path: "/proker/output",
        },
        {
          label: "Output",
          path: "/proker/output",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Output..."}
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
              Tambah Output
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

export default OutputPage;
