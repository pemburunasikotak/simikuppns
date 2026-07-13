import { FC, ReactElement, useState } from "react";
import { Button } from "@mui/material";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import useGetListDefaultProgram from "./_hooks/use-get-list-default-program";
import useDeleteDefaultProgram from "./_hooks/use-delete-default-program";
import { TDefaultProgram } from "@/api/proker/manajemenProgram/type";

import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";

const ManajemenProgramPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const modal = useModal();
  const deleteMutation = useDeleteDefaultProgram();
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  
  const { data, isLoading } = useGetListDefaultProgram({
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
  });

  const items = data?.data?.items || [];

  const columns: GridColDef<TDefaultProgram>[] = [
    { field: "ikuCode", headerName: "Kode IKU", minWidth: 150, flex: 0.5 },
    { field: "title", headerName: "Judul Program", minWidth: 200, flex: 1 },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
    {
      field: "actions",
      headerName: "Aksi",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const actionItems = [
          {
            key: "detail",
            type: "detail" as const,
            onClick: () => {
              navigate(`/proker/manajemenProgram/${params.row.id}`);
            },
          },
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => {
              navigate(`/proker/manajemenProgram/${params.row.id}/edit`);
            },
          },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              modal.confirm({
                title: "Hapus Program Default",
                description: "Apakah anda yakin ingin menghapus program ini?",
                icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                onOk: () => {
                  deleteMutation.mutate({ id: params.row.id });
                },
              });
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
          label: "Proker",
          path: "/proker",
        },
        {
          label: "Manajemen Program",
          path: "/proker/manajemenProgram",
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari Program..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => {
                navigate("/proker/manajemenProgram/tambah");
              }}
            >
              Tambah Program
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

export default ManajemenProgramPage;
