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
import useGetListComponent from "./_hooks/use-get-list-iku";
import { paths } from "@/commons/constants/paths";
import { Button } from "@mui/material";
import { AddOutlined, DeleteOutlined } from "@mui/icons-material";
import useDeleteComponent from "./_hooks/use-delete-iku";
import useModal from "@/app/_components/ui/modal";

const Component: FC = (): ReactElement => {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilter<TGetIKUParams>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const query = useGetListComponent({
    order: filters.order || "DESC",
    limit: 10,
    page: filters.page || 1,
    search: filters.search,
  });
  const modal = useModal();
  const deleteComponent = useDeleteComponent();

  const columns: GridColDef<TIKUItem>[] = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "code", headerName: "Code", minWidth: 200, flex: 0.5 },
    { field: "name", headerName: "Name", minWidth: 250, flex: 1 },
    { field: "description", headerName: "Description", minWidth: 250, flex: 1 },
    { field: "dataType", headerName: "Data Type", minWidth: 250, flex: 1 },
    { field: "sourceType", headerName: "Source Type", minWidth: 250, flex: 1 },
    {
      field: "actions",
      headerName: "Action",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <ActionButtonTable
          items={[
            // {
            //   key: "detail",
            //   type: "detail",
            //   onClick: () =>
            //     navigate(generatePath(paths.master.component.detail, { id: params.row.id })),
            // },
            {
              key: "edit",
              type: "edit",
              onClick: () =>
                navigate(generatePath(paths.master.component.edit, { id: params.row.id })),
            },
            {
              key: "delete",
              type: "delete",
              onClick: () => {
                modal.confirm({
                  icon: <DeleteOutlined sx={{ height: 40, width: 40 }} />,
                  description: "Apakah kamu akan menghapus data ini ?",
                  onOk: () => {
                    deleteComponent.mutate({ id: params.row.id });
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
          label: "IKP",
          path: null,
        },
      ]}
      topPage={
        <Filter
          variants={["search"]}
          labelSearch={"Cari IKP..."}
          defaultValue={{
            search_value: filters.search,
          }}
          actions={[
            <Button
              key="add"
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => navigate(paths.master.component.create)}
            >
              Tambah IKP
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
        rows={query.data?.result?.data || []}
        columns={columns}
        checkboxSelection
        paginationInfo={createPaginationInfo({
          per_page: 10,
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
