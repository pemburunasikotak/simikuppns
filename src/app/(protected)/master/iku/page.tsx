import { FC, ReactElement, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { generatePath, useNavigate } from "react-router";

import { Page } from "@/app/_components/ui";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import Filter from "@/app/_components/ui/filter";
import ActionButtonTable from "@/app/_components/ui/action-button-table";
import { useFilter } from "@/app/_hooks/use-filter";

import { TIKUItem, TGetIKUParams } from "@/api/master/iku/type";
import useGetListIKU from "./_hooks/use-get-list-iku";
import { paths } from "@/commons/constants/paths";
import { Button } from "@mui/material";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import useDeleteIKU from "./_hooks/use-delete-iku";
import useModal from "@/app/_components/ui/modal";

const Component: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilter<TGetIKUParams>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const query = useGetListIKU({
    order: filters.order || "DESC",
    limit: filters.per_page ? Number(filters.per_page) : 10,
    page: filters.page ? Number(filters.page) : 1,
    search: (filters.search_value as string) || (filters.search as string),
  });

  const searchQuery = filters.search || filters.search_value || "";
  const filteredRows = (query.data?.result?.data || []).filter((row) => {
    if (!searchQuery) return true;
    return row.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const modal = useModal();

  const deleteIKU = useDeleteIKU();

  const columns: GridColDef<TIKUItem>[] = [
    { field: "code", headerName: "Kode IKU", width: 90 },
    // { field: "name", headerName: "Nama IKU", minWidth: 200, flex: 0.5 },
    {
      field: "name",
      headerName: "Nama IKU",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            lineHeight: "1.4",
            padding: "8px 0",
          }}
        >
          {params.value}
        </div>
      ),
    },
    // { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
    // { field: "isDirectInput", headerName: "Direct Input", minWidth: 100 },
    // { field: "unit", headerName: "Unit", minWidth: 100 },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            {
              key: "detail",
              type: "detail",
              onClick: () =>
                navigate(generatePath(paths.master.iku.detail, { id: params.row.id })),
            },
            {
              key: "edit",
              type: "edit",
              onClick: () =>
                navigate(generatePath(paths.master.iku.edit, { id: params.row.id })),
            },
            {
              key: "delete",
              type: "delete",
              onClick: () => {
                modal.confirm({
                  icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                  description: "Apakah kamu akan menghapus data ini ?",
                  onOk: () => {
                    deleteIKU.mutate({ id: params.row.id });
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
      breadcrumbs={[
        {
          label: "Master Data",
          path: null,
        },
        {
          label: "IKU",
          path: null,
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari IKU..."}
          defaultValue={{
            search_value: filters.search || filters.search_value,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => navigate(paths.master.iku.create)}
            >
              Tambah IKU
            </Button>,
            ...(selectedIds.length
              ? [
                <Button key="delete" variant="outlined" startIcon={<DeleteOutlined />}>
                  Delete
                </Button>,
              ]
              : []),
          ]}
        />
      }
    >
      <DataTable
        loading={query.isLoading}
        rows={filteredRows}
        columns={columns}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: filters.per_page ? Number(filters.per_page) : 10,
          total: query.data?.result?.total || 0,
          page: query.data?.result?.currentPage || 1,
        })}
        handleChange={setFilter}
        onRowSelectionModelChange={(ids) => {
          setSelectedIds(ids);
        }}
      />
    </Page>
  );
};

export default Component;
