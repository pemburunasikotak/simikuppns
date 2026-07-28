import { FC, ReactElement, useState } from "react";
import { Button, Chip, Stack, Tooltip } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import { useGetPrograms } from "./_hooks/use-get-list-program";
import { TProkerProgram } from "@/api/proker/program/type";

import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import useModal from "@/app/_components/ui/modal";
import useDeleteProgram from "./_hooks/use-delete-program";
import { DeleteOutlined } from "@mui/icons-material";

const ProgramPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const modal = useModal();
  const deleteProgram = useDeleteProgram();
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const { data, isLoading } = useGetPrograms({
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10
  });

  const items = data?.data?.items || [];

  const columns: GridColDef<TProkerProgram>[] = [
    { field: "code", headerName: "Kode Program", width: 150 },
    { field: "title", headerName: "Nama Program", minWidth: 200, flex: 1 },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
    { field: "objective", headerName: "Objective", minWidth: 200, flex: 1 },
    { field: "year", headerName: "Tahun", width: 100 },
    {
      field: "indicators",
      headerName: "Indikator",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        const indicators = params.row.indicators || [];
        if (indicators.length === 0) return "-";

        return (
          <Tooltip title={indicators.map((ind) => ind.name).join(", ")}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ height: "100%", overflow: "hidden" }}>
              {indicators.slice(0, 2).map((ind, i) => (
                <Chip key={i} label={ind.name} size="small" variant="outlined" />
              ))}
              {indicators.length > 2 && (
                <Chip label={`+${indicators.length - 2}`} size="small" variant="outlined" />
              )}
            </Stack>
          </Tooltip>
        );
      },
    },
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
              navigate(`/proker/program/${params.row.id}`);
            },
          },
          {
            key: "edit",
            type: "edit" as const,
            onClick: () => {
              navigate(`/proker/program/${params.row.id}/edit`);
            },
          },
          {
            key: "delete",
            type: "delete" as const,
            onClick: () => {
              modal.confirm({
                title: "Hapus Program",
                description: "Apakah anda yakin ingin menghapus program ini?",
                icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                onOk: () => {
                  deleteProgram.mutate({ id: params.row.id });
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
          label: "Proker Program",
          path: "/proker",
        },
        {
          label: "Program",
          path: "/proker/program",
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
                navigate("/proker/program/tambah");
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

export default ProgramPage;
