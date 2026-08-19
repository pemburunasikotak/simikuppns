import { FC, ReactElement, useState } from "react";
import { GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import useGetListIkuProker from "./_hooks/use-get-list-iku-proker";
import { TProkerIku } from "@/api/proker/manajemenProgram/type";

import { Page } from "@/app/_components/ui";
import Filter from "@/app/_components/ui/filter";
import DataTable from "@/app/_components/ui/data-table";
import { createPaginationInfo } from "@/utils/data-table";
import ActionButtonTable from "@/app/_components/ui/action-button-table";

const ManajemenProgramPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Record<string, unknown>>({ per_page: 10 });
  const { data, isLoading } = useGetListIkuProker({
    page: filter.page ? Number(filter.page) : 1,
    limit: filter.per_page ? Number(filter.per_page) : 10,
    search: filter.search || filter.search_value || undefined,
  });

  const items = data?.data?.items || [];

  const columns: GridColDef<TProkerIku>[] = [
    { field: "code", headerName: "Kode IKU", minWidth: 150, flex: 0.5 },
    { field: "name", headerName: "Nama Indikator", minWidth: 200, flex: 1 },
    { field: "description", headerName: "Deskripsi", minWidth: 250, flex: 1 },
    { field: "type", headerName: "Tipe", width: 150 },
    {
      field: "actions",
      headerName: "Aksi",
      width: 120,
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
          labelSearch={"Program..."}
          defaultValue={{
            search_value: filter.search || filter.search_value,
          }}
        // actions={[
        //   <Button
        //     key="add"
        //     variant="contained"
        //     startIcon={<AddOutlined />}
        //     onClick={() => {
        //       navigate("/proker/manajemenProgram/tambah");
        //     }}
        //   >
        //     Tambah Program
        //   </Button>,
        // ]}
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
